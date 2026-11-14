// Servidor HTTP da Oficina Boa Estrada (node:http, sem pacotes). Exige login para a API.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  STATUS, abrirBanco, semearExemplos, validarOrdem, inserirOrdem, listarOrdens, mudarStatus, painel, faturamentoDoMes,
} from './banco.mjs';
import {
  carregarArquivoEnv, lerSenhas, prepararUsuarios, entrar, sessaoDaRequisicao, encerrarSessao,
  cookieSessao, cookieExpirado, DURACAO_BLOQUEIO_MS,
} from './autenticacao.mjs';

const RAIZ = fileURLToPath(new URL('.', import.meta.url));
const PUBLICO = join(RAIZ, 'publico');
const PORTA = Number(process.env.PORTA) || 3000;
const CAMINHO_BANCO = process.env.OFICINA_DB || join(RAIZ, 'dados', 'oficina.db');
const HOST = '127.0.0.1'; // só esta máquina

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};
const LIMITE_CORPO = 16 * 1024;

function enviarJson(res, codigo, corpo, extras = {}) {
  res.writeHead(codigo, {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
    ...extras,
  });
  res.end(JSON.stringify(corpo));
}

async function lerJson(req) {
  let total = 0;
  const partes = [];
  for await (const parte of req) {
    total += parte.length;
    if (total > LIMITE_CORPO) return null;
    partes.push(parte);
  }
  try {
    return JSON.parse(Buffer.concat(partes).toString('utf8'));
  } catch {
    return null;
  }
}

async function servirArquivo(p, res) {
  const relativo = p === '/' ? 'index.html' : decodeURIComponent(p.slice(1));
  const caminho = resolve(PUBLICO, relativo);
  if (!caminho.startsWith(PUBLICO + sep)) {
    enviarJson(res, 404, { erro: 'Não encontrado.' });
    return;
  }
  try {
    const conteudo = await readFile(caminho);
    res.writeHead(200, {
      'Content-Type': TIPOS[extname(caminho)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
    });
    res.end(conteudo);
  } catch {
    enviarJson(res, 404, { erro: 'Não encontrado.' });
  }
}

async function entrarPost(req, res, db) {
  const corpo = await lerJson(req);
  if (!corpo || typeof corpo.usuario !== 'string' || typeof corpo.senha !== 'string') {
    return enviarJson(res, 400, { erro: 'Informe usuário e senha.' });
  }
  const r = await entrar(db, corpo.usuario.trim(), corpo.senha);
  if (r.motivo === 'bloqueado') {
    const segundos = Math.ceil(DURACAO_BLOQUEIO_MS / 1000);
    return enviarJson(res, 429,
      { erro: 'Muitas senhas erradas seguidas. Espere 1 minuto e tente de novo.' },
      { 'Retry-After': String(segundos) });
  }
  if (!r.ok) return enviarJson(res, 401, { erro: 'Usuário ou senha incorretos.' });
  return enviarJson(res, 200, { usuario: r.usuario, papel: r.papel },
    { 'Set-Cookie': cookieSessao(r.token) });
}

// Rotas da API que exigem sessão. `sessao` tem { usuario, papel }.
async function rotearApi(req, res, db, url, sessao) {
  const p = url.pathname;

  if (p === '/api/sessao' && req.method === 'GET') {
    return enviarJson(res, 200, { usuario: sessao.usuario, papel: sessao.papel });
  }

  if (p === '/api/faturamento' && req.method === 'GET') {
    if (sessao.papel !== 'dono') return enviarJson(res, 403, { erro: 'Só o dono vê o faturamento.' });
    return enviarJson(res, 200, faturamentoDoMes(db));
  }

  if (p === '/api/ordens' && req.method === 'GET') {
    const status = url.searchParams.get('status') || 'todas';
    if (status !== 'todas' && !STATUS.includes(status)) {
      return enviarJson(res, 400, { erro: 'Status inválido.' });
    }
    return enviarJson(res, 200, listarOrdens(db, status === 'todas' ? null : status));
  }

  if (p === '/api/ordens' && req.method === 'POST') {
    const corpo = await lerJson(req);
    if (corpo === null) return enviarJson(res, 400, { erro: 'Dados inválidos.' });
    const v = validarOrdem(corpo);
    if (!v.ok) return enviarJson(res, 400, { erros: v.erros });
    const id = inserirOrdem(db, v.dados);
    return enviarJson(res, 201, { id });
  }

  const trocar = p.match(/^\/api\/ordens\/(\d+)\/status$/);
  if (trocar && req.method === 'PATCH') {
    const corpo = await lerJson(req);
    if (!corpo || !STATUS.includes(corpo.status)) {
      return enviarJson(res, 400, { erro: 'Status inválido.' });
    }
    if (!mudarStatus(db, Number(trocar[1]), corpo.status)) {
      return enviarJson(res, 404, { erro: 'Ordem não encontrada.' });
    }
    return enviarJson(res, 200, { ok: true });
  }

  if (p === '/api/painel' && req.method === 'GET') {
    return enviarJson(res, 200, painel(db));
  }

  return enviarJson(res, 404, { erro: 'Não encontrado.' });
}

async function rotear(req, res, db) {
  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname;

  if (p === '/api/entrar' && req.method === 'POST') return entrarPost(req, res, db);

  if (p === '/api/sair' && req.method === 'POST') {
    encerrarSessao(db, req);
    return enviarJson(res, 200, { ok: true }, { 'Set-Cookie': cookieExpirado() });
  }

  if (p.startsWith('/api/')) {
    const sessao = sessaoDaRequisicao(db, req);
    if (!sessao) return enviarJson(res, 401, { erro: 'Entre para continuar.' });
    return rotearApi(req, res, db, url, sessao);
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return enviarJson(res, 405, { erro: 'Método não permitido.' });
  }
  return servirArquivo(p, res);
}

export function criarServidor(db) {
  return createServer(async (req, res) => {
    try {
      await rotear(req, res, db);
    } catch (err) {
      console.error(err);
      if (!res.headersSent) enviarJson(res, 500, { erro: 'Erro interno.' });
    }
  });
}

carregarArquivoEnv(join(RAIZ, '.env'));
let senhas;
try {
  senhas = lerSenhas();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

const db = abrirBanco(CAMINHO_BANCO);
await prepararUsuarios(db, senhas);
if (semearExemplos(db)) console.log('Ordens de exemplo (EXEMPLO) criadas.');
criarServidor(db).listen(PORTA, HOST, () => {
  console.log(`Oficina Boa Estrada rodando em http://localhost:${PORTA}`);
});
