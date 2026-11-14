// Confere o sistema de ponta a ponta: sobe o servidor numa porta de teste,
// usa um banco temporário e senhas aleatórias só deste teste, e checa
// login, papéis, bloqueio, cadastro, validação, filtro, troca de status e painel.
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { lerSenhas } from './autenticacao.mjs';

const RAIZ = fileURLToPath(new URL('.', import.meta.url));
const PORTA = 3917;
const BASE = `http://127.0.0.1:${PORTA}`;
const BANCO = join(tmpdir(), `oficina-conferir-${process.pid}-${Date.now()}.db`);
const PASTA_BACKUPS = join(tmpdir(), `oficina-conferir-backups-${process.pid}-${Date.now()}`);
const ARQUIVO_QUALQUER = join(tmpdir(), `oficina-conferir-qualquer-${process.pid}-${Date.now()}.db`);
// Senhas aleatórias, só para este teste. Não ficam em nenhum arquivo.
const SENHA_ANTONIO = randomBytes(12).toString('base64url');
const SENHA_CLARA = randomBytes(12).toString('base64url');

let total = 0;
let falhas = 0;
function checar(nome, cond, detalhe = '') {
  total++;
  if (cond) {
    console.log(`  OK     ${nome}`);
  } else {
    falhas++;
    console.log(`  FALHA  ${nome}${detalhe ? ` (${detalhe})` : ''}`);
  }
}

// ---------- configuração das senhas (sem subir servidor) ----------
{
  const guardadas = { antonio: process.env.SENHA_ANTONIO, clara: process.env.SENHA_CLARA };
  delete process.env.SENHA_ANTONIO;
  delete process.env.SENHA_CLARA;
  let semSenha = false;
  try { lerSenhas(); } catch { semSenha = true; }
  checar('sem SENHA_ANTONIO e SENHA_CLARA, o servidor recusa começar', semSenha);

  process.env.SENHA_ANTONIO = 'curta';
  process.env.SENHA_CLARA = SENHA_CLARA;
  let curta = false;
  try { lerSenhas(); } catch { curta = true; }
  checar('senha com menos de 8 caracteres é recusada', curta);

  process.env.SENHA_ANTONIO = SENHA_ANTONIO;
  let ok = false;
  try { ok = lerSenhas().clara === SENHA_CLARA; } catch { ok = false; }
  checar('senhas válidas são lidas', ok);

  for (const [k, v] of Object.entries({ SENHA_ANTONIO: guardadas.antonio, SENHA_CLARA: guardadas.clara })) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
}

const servidor = spawn(process.execPath, [join(RAIZ, 'servidor.mjs')], {
  env: { ...process.env, PORTA: String(PORTA), OFICINA_DB: BANCO, SENHA_ANTONIO, SENHA_CLARA },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let saidaServidor = '';
servidor.stdout.on('data', (d) => (saidaServidor += d));
servidor.stderr.on('data', (d) => (saidaServidor += d));

// Para o servidor de teste (funciona mesmo se ele já tiver sido encerrado).
async function pararServidor() {
  if (servidor.exitCode !== null || servidor.signalCode !== null) return;
  const saiu = new Promise((r) => servidor.once('exit', r));
  servidor.kill();
  await saiu;
}

// Roda backup.mjs ou restaurar.mjs como processo separado, apontando para o banco e a pasta de teste.
function rodarScript(arquivo, args = []) {
  return new Promise((resolver) => {
    const p = spawn(process.execPath, [join(RAIZ, arquivo), ...args], {
      env: { ...process.env, BANCO, BACKUPS: PASTA_BACKUPS },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let saida = '';
    p.stdout.on('data', (d) => (saida += d));
    p.stderr.on('data', (d) => (saida += d));
    p.on('close', (codigo) => resolver({ codigo, saida }));
  });
}

function ordemExiste(id) {
  const db = new DatabaseSync(BANCO);
  try {
    return db.prepare('SELECT COUNT(*) AS n FROM ordens WHERE id = ?').get(id).n === 1;
  } finally {
    db.close();
  }
}

async function esperarServidor() {
  const limite = Date.now() + 10000;
  while (Date.now() < limite) {
    try {
      const r = await fetch(`${BASE}/`);
      if (r.ok) return;
    } catch {
      // ainda não subiu
    }
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error(`servidor não respondeu em 10 s. Saída:\n${saidaServidor}`);
}

async function chamar(metodo, caminho, corpo, cookie) {
  const cabecalhos = {};
  if (corpo !== undefined) cabecalhos['Content-Type'] = 'application/json';
  if (cookie) cabecalhos.Cookie = cookie;
  const r = await fetch(BASE + caminho, {
    method: metodo,
    headers: Object.keys(cabecalhos).length ? cabecalhos : undefined,
    body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
  });
  const dados = await r.json().catch(() => null);
  return { codigo: r.status, dados, cabecalhos: r.headers };
}

// Faz login e devolve também o cookie já no formato "sessao=..." para enviar de volta.
async function entrar(usuario, senha) {
  const r = await chamar('POST', '/api/entrar', { usuario, senha });
  const setCookie = r.cabecalhos.get('set-cookie') || '';
  const valor = /sessao=([^;]+)/.exec(setCookie)?.[1];
  return { ...r, setCookie, cookie: valor ? `sessao=${valor}` : undefined };
}

const ORDEM_TESTE = {
  cliente: 'Cliente de Conferência',
  telefone: '(11) 98888-7777',
  placa: 'tst1a23',
  modelo: 'Modelo Teste',
  descricao: 'Revisão de conferência',
  valor: '1.250,50',
};

let saidaOk = false;
try {
  await esperarServidor();
  console.log('Servidor de teste no ar. Verificações:\n');

  // 1. Login: quem não entrou não acessa a API
  console.log('Login:');
  checar('API sem login responde 401', (await chamar('GET', '/api/ordens')).codigo === 401);
  checar('painel sem login responde 401', (await chamar('GET', '/api/painel')).codigo === 401);
  checar('faturamento sem login responde 401', (await chamar('GET', '/api/faturamento')).codigo === 401);

  const errada = await entrar('antonio', 'senha-errada-123');
  checar('senha errada responde 401', errada.codigo === 401, `código ${errada.codigo}`);
  const inexistente = await entrar('fulano', 'qualquer-coisa');
  checar('usuário inexistente responde 401 com a mesma mensagem',
    inexistente.codigo === 401 && inexistente.dados?.erro === errada.dados?.erro);
  const semSenha = await chamar('POST', '/api/entrar', { usuario: 'antonio' });
  checar('entrada sem senha responde 400', semSenha.codigo === 400, `código ${semSenha.codigo}`);

  const antonio = await entrar('antonio', SENHA_ANTONIO);
  checar('login do antonio responde 200 como dono', antonio.codigo === 200 && antonio.dados?.papel === 'dono',
    `código ${antonio.codigo}`);
  checar('cookie de sessão é HttpOnly', /HttpOnly/i.test(antonio.setCookie));
  checar('cookie de sessão é SameSite=Strict', /SameSite=Strict/.test(antonio.setCookie));
  checar('cookie de sessão expira em 8 horas (28800 s)', /Max-Age=28800/.test(antonio.setCookie), antonio.setCookie);
  const dono = antonio.cookie;
  checar('cookie do antonio foi recebido', Boolean(dono));

  const sessaoDono = await chamar('GET', '/api/sessao', undefined, dono);
  checar('sessão do antonio mostra papel dono', sessaoDono.dados?.papel === 'dono');
  checar('cookie inventado responde 401', (await chamar('GET', '/api/painel', undefined, 'sessao=inventado')).codigo === 401);

  const banco1 = await readFile(BANCO);
  checar('senhas não aparecem em texto puro no banco',
    !banco1.includes(SENHA_ANTONIO) && !banco1.includes(SENHA_CLARA));
  checar('senhas estão guardadas como hash scrypt', banco1.includes('scrypt$'));

  const atendente = await entrar('clara', SENHA_CLARA);
  checar('login da clara responde 200 como atendente', atendente.codigo === 200 && atendente.dados?.papel === 'atendente');
  const atend = atendente.cookie;

  // 2. Papéis: só o dono vê o faturamento
  console.log('\nPapéis:');
  const fatClara = await chamar('GET', '/api/faturamento', undefined, atend);
  checar('faturamento para a clara responde 403', fatClara.codigo === 403, `código ${fatClara.codigo}`);
  const painelClara = await chamar('GET', '/api/painel', undefined, atend);
  checar('painel da clara não tem campo de faturamento',
    painelClara.codigo === 200 && JSON.stringify(Object.keys(painelClara.dados)) === '["abertas","prontas"]',
    JSON.stringify(painelClara.dados));
  const fatDono0 = await chamar('GET', '/api/faturamento', undefined, dono);
  checar('faturamento para o antonio responde 200',
    fatDono0.codigo === 200 && Number.isInteger(fatDono0.dados?.centavos) && /^\d{4}-\d{2}$/.test(fatDono0.dados?.mes ?? ''),
    JSON.stringify(fatDono0.dados));
  checar('exemplos não entram no faturamento (banco novo começa em 0)', fatDono0.dados?.centavos === 0,
    `achou ${fatDono0.dados?.centavos}`);

  const entregaClara = await chamar('POST', '/api/ordens', ORDEM_TESTE, atend);
  const idEntregue = entregaClara.dados?.id;
  await chamar('PATCH', `/api/ordens/${idEntregue}/status`, { status: 'entregue' }, atend);
  const fatDono1 = await chamar('GET', '/api/faturamento', undefined, dono);
  checar('ordem entregue pela clara soma no faturamento do antonio',
    fatDono1.dados?.centavos === fatDono0.dados.centavos + 125050, `achou ${fatDono1.dados?.centavos}`);

  const antiga = await chamar('POST', '/api/ordens', { ...ORDEM_TESTE, valor: '99,00' }, atend);
  await chamar('PATCH', `/api/ordens/${antiga.dados?.id}/status`, { status: 'entregue' }, atend);
  const bancoEdit = new DatabaseSync(BANCO);
  bancoEdit.prepare('UPDATE ordens SET entregue_em = ? WHERE id = ?')
    .run('2000-01-15T12:00:00.000Z', antiga.dados?.id);
  bancoEdit.close();
  const fatDono2 = await chamar('GET', '/api/faturamento', undefined, dono);
  checar('entrega de outro mês não entra no faturamento deste mês',
    fatDono2.dados?.centavos === fatDono1.dados?.centavos, `achou ${fatDono2.dados?.centavos}`);

  const telaHtml = await (await fetch(`${BASE}/`)).text();
  checar('página inicial não tem campo de faturamento (aparece só depois do login do dono)',
    !/faturamento|faturado/i.test(telaHtml));

  const sair = await chamar('POST', '/api/sair', undefined, atend);
  checar('sair responde 200 e manda expirar o cookie',
    sair.codigo === 200 && /Max-Age=0/.test(sair.cabecalhos.get('set-cookie') || ''));
  checar('cookie deixa de valer depois de sair', (await chamar('GET', '/api/sessao', undefined, atend)).codigo === 401);

  // 3. Bloqueio: 5 senhas erradas seguidas bloqueiam a conta por 1 minuto
  console.log('\nBloqueio:');
  const atendente2 = await entrar('clara', 'senha-errada-0');
  const primeiras4 = [atendente2.codigo];
  for (let i = 1; i < 4; i++) primeiras4.push((await entrar('clara', `senha-errada-${i}`)).codigo);
  checar('4 senhas erradas seguidas ainda respondem 401', primeiras4.every((c) => c === 401), primeiras4.join(','));
  const acertou = await entrar('clara', SENHA_CLARA);
  checar('senha certa antes do quinto erro entra e zera o contador', acertou.codigo === 200);

  const outras4 = [];
  for (let i = 0; i < 4; i++) outras4.push((await entrar('clara', `senha-errada-x${i}`)).codigo);
  checar('mais 4 erros seguidos ainda respondem 401', outras4.every((c) => c === 401), outras4.join(','));
  const quinta = await entrar('clara', 'senha-errada-x4');
  checar('quinta senha errada seguida bloqueia com 429', quinta.codigo === 429, `código ${quinta.codigo}`);
  checar('bloqueio avisa Retry-After de 60 s', quinta.cabecalhos.get('retry-after') === '60',
    quinta.cabecalhos.get('retry-after'));

  const bancoBloq = new DatabaseSync(BANCO);
  const { bloqueado_ate } = bancoBloq.prepare("SELECT bloqueado_ate FROM usuarios WHERE usuario = 'clara'").get();
  const restanteMs = Date.parse(bloqueado_ate) - Date.now();
  checar('bloqueio dura cerca de 1 minuto', restanteMs > 55000 && restanteMs <= 60000, `${Math.round(restanteMs / 1000)} s`);
  bancoBloq.close();

  const durante = await entrar('clara', SENHA_CLARA);
  checar('durante o bloqueio, nem a senha certa entra (429)', durante.codigo === 429, `código ${durante.codigo}`);

  // Simula a passagem do minuto alterando o fim do bloqueio no banco de teste
  const bancoFim = new DatabaseSync(BANCO);
  bancoFim.prepare("UPDATE usuarios SET bloqueado_ate = '2000-01-01T00:00:00.000Z' WHERE usuario = 'clara'").run();
  bancoFim.close();
  const umErro = await entrar('clara', 'senha-errada-depois');
  checar('depois do minuto, um erro volta a dar 401 (contador recomeçou)', umErro.codigo === 401, `código ${umErro.codigo}`);
  const depois = await entrar('clara', SENHA_CLARA);
  checar('depois do minuto, a senha certa volta a entrar', depois.codigo === 200, `código ${depois.codigo}`);

  // 4. Cadastro, validação, filtro e status (agora com sessão do dono)
  console.log('\nOrdens:');
  const painelAntes = await chamar('GET', '/api/painel', undefined, dono);
  checar('painel responde 200', painelAntes.codigo === 200);
  checar('painel tem só abertas e prontas', JSON.stringify(Object.keys(painelAntes.dados).sort()) === '["abertas","prontas"]',
    JSON.stringify(painelAntes.dados));

  const todas0 = await chamar('GET', '/api/ordens', undefined, dono);
  const exemplos = todas0.dados.filter((o) => o.exemplo);
  checar('três ordens de exemplo criadas', exemplos.length === 3, `achou ${exemplos.length}`);
  checar('exemplos com EXEMPLO no nome', exemplos.every((o) => o.cliente.includes('EXEMPLO')));

  const novo = await chamar('POST', '/api/ordens', ORDEM_TESTE, dono);
  checar('cadastro válido responde 201', novo.codigo === 201, `código ${novo.codigo}`);
  const id = novo.dados?.id;
  checar('cadastro devolve id', Number.isInteger(id));

  const ruim = await chamar('POST', '/api/ordens', { ...ORDEM_TESTE, placa: 'XX', valor: 'abc' }, dono);
  checar('placa e valor inválidos respondem 400', ruim.codigo === 400, `código ${ruim.codigo}`);
  checar('erros dizem o que corrigir', (ruim.dados?.erros || []).length === 2, JSON.stringify(ruim.dados));

  const abertas = await chamar('GET', '/api/ordens?status=aberta', undefined, dono);
  const achada = abertas.dados.find((o) => o.id === id);
  checar('ordem nova aparece no filtro aberta', Boolean(achada));
  checar('ordem nova começa como aberta', achada?.status === 'aberta');
  checar('valor "1.250,50" guardado como 125050 centavos', achada?.valor_centavos === 125050, `achou ${achada?.valor_centavos}`);
  checar('placa normalizada para TST1A23', achada?.placa === 'TST1A23', `achou ${achada?.placa}`);
  checar('telefone guardado só com dígitos', achada?.telefone === '11988887777', `achou ${achada?.telefone}`);

  const depoisCadastro = await chamar('GET', '/api/painel', undefined, dono);
  checar('painel: abertas +1 após cadastro', depoisCadastro.dados.abertas === painelAntes.dados.abertas + 1,
    `antes ${painelAntes.dados.abertas}, depois ${depoisCadastro.dados.abertas}`);

  const troca = await chamar('PATCH', `/api/ordens/${id}/status`, { status: 'pronta' }, dono);
  checar('troca para pronta responde 200', troca.codigo === 200, `código ${troca.codigo}`);

  const depoisTroca = await chamar('GET', '/api/painel', undefined, dono);
  checar('painel: prontas +1 após troca', depoisTroca.dados.prontas === painelAntes.dados.prontas + 1,
    `antes ${painelAntes.dados.prontas}, depois ${depoisTroca.dados.prontas}`);
  checar('painel: abertas voltou ao valor de antes', depoisTroca.dados.abertas === painelAntes.dados.abertas,
    `antes ${painelAntes.dados.abertas}, depois ${depoisTroca.dados.abertas}`);

  const filtroPronta = await chamar('GET', '/api/ordens?status=pronta', undefined, dono);
  checar('filtro pronta mostra a ordem trocada', filtroPronta.dados.some((o) => o.id === id));
  const filtroAberta = await chamar('GET', '/api/ordens?status=aberta', undefined, dono);
  checar('filtro aberta não mostra mais a ordem', !filtroAberta.dados.some((o) => o.id === id));

  const volta = await chamar('PATCH', `/api/ordens/${id}/status`, { status: 'aberta' }, dono);
  checar('troca livre (pronta → aberta) responde 200', volta.codigo === 200);

  const statusRuim = await chamar('PATCH', `/api/ordens/${id}/status`, { status: 'faturada' }, dono);
  checar('status fora da lista responde 400', statusRuim.codigo === 400, `código ${statusRuim.codigo}`);
  const naoExiste = await chamar('PATCH', '/api/ordens/999999/status', { status: 'pronta' }, dono);
  checar('ordem inexistente responde 404', naoExiste.codigo === 404, `código ${naoExiste.codigo}`);
  const filtroRuim = await chamar('GET', '/api/ordens?status=xyz', undefined, dono);
  checar('filtro inválido responde 400', filtroRuim.codigo === 400, `código ${filtroRuim.codigo}`);

  const pagina = await fetch(`${BASE}/`);
  checar('página inicial responde 200', pagina.status === 200);

  // 5. Backup e restauração. O servidor é parado antes: no Windows ele mantém o arquivo do banco aberto.
  console.log('\nBackup e restauração:');
  await pararServidor();
  await mkdir(PASTA_BACKUPS, { recursive: true });

  // Backups falsos e antigos, para testar a regra de guardar só os 7 mais recentes.
  for (let i = 1; i <= 8; i++) {
    await writeFile(join(PASTA_BACKUPS, `oficina-2000-01-0${i}-0000.db`), 'antigo');
  }

  const bkp = await rodarScript('backup.mjs');
  checar('backup roda com sucesso', bkp.codigo === 0, bkp.saida.trim());
  const backups = (await readdir(PASTA_BACKUPS)).filter((n) => /^oficina-\d{4}-\d{2}-\d{2}-\d{4}\.db$/.test(n)).sort();
  checar('backup novo está na pasta de backups', backups.at(-1)?.startsWith('oficina-2') === true, backups.join(', '));
  checar('ficam só 7 backups (os mais antigos saem)', backups.length === 7, `achou ${backups.length}`);
  checar('os dois backups mais antigos foram apagados',
    !backups.includes('oficina-2000-01-01-0000.db') && !backups.includes('oficina-2000-01-02-0000.db'));

  const arquivoBkp = join(PASTA_BACKUPS, backups.at(-1));
  const copia = new DatabaseSync(arquivoBkp, { readOnly: true });
  const naCopia = copia.prepare('SELECT COUNT(*) AS n FROM ordens WHERE id = ?').get(id).n;
  copia.close();
  checar('o backup contém a ordem de teste', naCopia === 1);

  const apagar = new DatabaseSync(BANCO);
  apagar.prepare('DELETE FROM ordens WHERE id = ?').run(id);
  apagar.close();
  checar('ordem de teste apagada do banco de teste', !ordemExiste(id));

  const rest = await rodarScript('restaurar.mjs', [arquivoBkp]);
  checar('restauração roda com sucesso', rest.codigo === 0, rest.saida.trim());
  checar('a ordem apagada voltou depois de restaurar', ordemExiste(id));
  checar('o banco anterior foi guardado em antes-da-restauracao',
    (await readdir(PASTA_BACKUPS)).some((n) => n.startsWith('antes-da-restauracao-')));

  await writeFile(ARQUIVO_QUALQUER, 'isto é um texto, não um banco de dados\n');
  const bytesAntes = await readFile(BANCO);
  const qtdAntes = (await readdir(PASTA_BACKUPS)).length;
  const recusa = await rodarScript('restaurar.mjs', [ARQUIVO_QUALQUER]);
  checar('arquivo qualquer é recusado (saída diferente de 0)', recusa.codigo !== 0, `código ${recusa.codigo}`);
  checar('a recusa diz que não é um banco SQLite', /não começa com o cabeçalho de um banco SQLite/.test(recusa.saida),
    recusa.saida.trim());
  checar('o banco não muda depois da recusa', Buffer.compare(await readFile(BANCO), bytesAntes) === 0);
  checar('nenhuma cópia nova é criada na recusa', (await readdir(PASTA_BACKUPS)).length === qtdAntes);

  saidaOk = true;
} catch (err) {
  falhas++;
  console.log(`  ERRO   ${err.message}`);
} finally {
  await pararServidor();
  for (const alvo of [BANCO, ARQUIVO_QUALQUER]) {
    try {
      await rm(alvo, { force: true });
    } catch (err) {
      console.log(`  aviso: não consegui apagar o arquivo temporário (${err.code}). Pode apagar à mão: ${alvo}`);
    }
  }
  try {
    await rm(PASTA_BACKUPS, { recursive: true, force: true });
  } catch (err) {
    console.log(`  aviso: não consegui apagar a pasta temporária (${err.code}). Pode apagar à mão: ${PASTA_BACKUPS}`);
  }
}

console.log(`\nResultado: ${total - falhas} de ${total} verificações OK${falhas ? ` — ${falhas} falha(s)` : ''}.`);
process.exitCode = falhas || !saidaOk ? 1 : 0;
