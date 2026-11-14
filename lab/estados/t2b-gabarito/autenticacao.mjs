// Login da Oficina Boa Estrada (node:crypto e node:fs, sem pacotes).
// Senhas vêm do arquivo .env (ou do ambiente) e ficam no banco só como hash scrypt com sal.
import { randomBytes, createHash, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCb);

export const PAPEIS = { antonio: 'dono', clara: 'atendente' };
export const NOME_COOKIE = 'sessao';
export const DURACAO_SESSAO_S = 8 * 60 * 60; // 8 horas
export const MAX_FALHAS = 5;
export const DURACAO_BLOQUEIO_MS = 60 * 1000; // 1 minuto
const TAMANHO_MIN_SENHA = 8;

// ---------- .env ----------

// Lê KEY=VALOR de um arquivo. Não sobrescreve variáveis que já existem no ambiente.
export function carregarArquivoEnv(caminho) {
  if (!existsSync(caminho)) return;
  for (const linha of readFileSync(caminho, 'utf8').split(/\r?\n/)) {
    const m = linha.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    let [, chave, valor] = m;
    if (/^(['"]).*\1$/.test(valor)) valor = valor.slice(1, -1);
    if (process.env[chave] === undefined) process.env[chave] = valor;
  }
}

// Devolve { antonio, clara } ou lança erro dizendo o que falta.
export function lerSenhas() {
  const senhas = { antonio: process.env.SENHA_ANTONIO, clara: process.env.SENHA_CLARA };
  const problemas = [];
  for (const [usuario, senha] of Object.entries(senhas)) {
    const nome = `SENHA_${usuario.toUpperCase()}`;
    if (!senha) problemas.push(`${nome} não definida`);
    else if (senha.length < TAMANHO_MIN_SENHA) problemas.push(`${nome} tem menos de ${TAMANHO_MIN_SENHA} caracteres`);
  }
  if (problemas.length) {
    throw new Error(`Configure o arquivo .env (veja .env.example): ${problemas.join('; ')}.`);
  }
  return senhas;
}

// ---------- senhas ----------

export async function gerarHash(senha) {
  const sal = randomBytes(16);
  const chave = await scrypt(senha, sal, 64);
  return `scrypt$${sal.toString('hex')}$${Buffer.from(chave).toString('hex')}`;
}

export async function conferirSenha(senha, armazenado) {
  const [alg, salHex, chaveHex] = String(armazenado).split('$');
  if (alg !== 'scrypt' || !salHex || !chaveHex) return false;
  const esperado = Buffer.from(chaveHex, 'hex');
  const obtido = Buffer.from(await scrypt(senha, Buffer.from(salHex, 'hex'), esperado.length));
  return obtido.length === esperado.length && timingSafeEqual(obtido, esperado);
}

// Cria ou atualiza os usuários a partir do .env a cada inicialização.
// Também encerra as sessões antigas, para que uma troca de senha derrube quem estava logado.
export async function prepararUsuarios(db, senhas) {
  db.exec('DELETE FROM sessoes');
  for (const [usuario, senha] of Object.entries(senhas)) {
    const hash = await gerarHash(senha);
    db.prepare(`
      INSERT INTO usuarios (usuario, papel, senha_hash) VALUES (?, ?, ?)
      ON CONFLICT(usuario) DO UPDATE SET papel = excluded.papel, senha_hash = excluded.senha_hash
    `).run(usuario, PAPEIS[usuario], hash);
  }
}

// ---------- login e bloqueio ----------

const hashToken = (token) => createHash('sha256').update(token).digest('hex');

// Devolve { ok: true, token, usuario, papel } ou { ok: false, motivo: 'senha' | 'bloqueado' }.
// Usuário inexistente e senha errada têm a mesma resposta, para não revelar nomes de usuário.
export async function entrar(db, usuario, senha, agora = Date.now()) {
  const u = db.prepare('SELECT id, usuario, papel, senha_hash, falhas_seguidas, bloqueado_ate FROM usuarios WHERE usuario = ?').get(usuario);
  if (!u) return { ok: false, motivo: 'senha' };

  if (u.bloqueado_ate && Date.parse(u.bloqueado_ate) > agora) return { ok: false, motivo: 'bloqueado' };

  if (await conferirSenha(senha, u.senha_hash)) {
    db.prepare('UPDATE usuarios SET falhas_seguidas = 0, bloqueado_ate = NULL WHERE id = ?').run(u.id);
    db.prepare('DELETE FROM sessoes WHERE expira_em <= ?').run(new Date(agora).toISOString());
    const token = randomBytes(32).toString('base64url');
    db.prepare('INSERT INTO sessoes (token_hash, usuario_id, expira_em) VALUES (?, ?, ?)')
      .run(hashToken(token), u.id, new Date(agora + DURACAO_SESSAO_S * 1000).toISOString());
    return { ok: true, token, usuario: u.usuario, papel: u.papel };
  }

  const falhas = u.falhas_seguidas + 1;
  if (falhas >= MAX_FALHAS) {
    db.prepare('UPDATE usuarios SET falhas_seguidas = 0, bloqueado_ate = ? WHERE id = ?')
      .run(new Date(agora + DURACAO_BLOQUEIO_MS).toISOString(), u.id);
    return { ok: false, motivo: 'bloqueado' };
  }
  db.prepare('UPDATE usuarios SET falhas_seguidas = ? WHERE id = ?').run(falhas, u.id);
  return { ok: false, motivo: 'senha' };
}

// ---------- sessão ----------

function lerCookie(cabecalho, nome) {
  for (const parte of String(cabecalho || '').split(';')) {
    const i = parte.indexOf('=');
    if (i > 0 && parte.slice(0, i).trim() === nome) return parte.slice(i + 1).trim();
  }
  return null;
}

// Devolve { usuario, papel } se a requisição traz uma sessão válida; senão null.
export function sessaoDaRequisicao(db, req, agora = Date.now()) {
  const token = lerCookie(req.headers.cookie, NOME_COOKIE);
  if (!token) return null;
  const h = hashToken(token);
  const s = db.prepare(`
    SELECT u.usuario, u.papel, s.expira_em
    FROM sessoes s JOIN usuarios u ON u.id = s.usuario_id
    WHERE s.token_hash = ?
  `).get(h);
  if (!s) return null;
  if (Date.parse(s.expira_em) <= agora) {
    db.prepare('DELETE FROM sessoes WHERE token_hash = ?').run(h);
    return null;
  }
  return { usuario: s.usuario, papel: s.papel };
}

export function encerrarSessao(db, req) {
  const token = lerCookie(req.headers.cookie, NOME_COOKIE);
  if (token) db.prepare('DELETE FROM sessoes WHERE token_hash = ?').run(hashToken(token));
}

export function cookieSessao(token) {
  return `${NOME_COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${DURACAO_SESSAO_S}`;
}

export function cookieExpirado() {
  return `${NOME_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
}
