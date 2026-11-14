// Servidor HTTP da Oficina Boa Estrada (node:http, sem pacotes). Sem login nesta fase.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  STATUS, abrirBanco, semearExemplos, validarOrdem, inserirOrdem, listarOrdens, mudarStatus, painel,
} from './banco.mjs';

const RAIZ = fileURLToPath(new URL('.', import.meta.url));
const PUBLICO = join(RAIZ, 'publico');
const PORTA = Number(process.env.PORTA) || 3000;
const CAMINHO_BANCO = process.env.OFICINA_DB || join(RAIZ, 'dados', 'oficina.db');
const HOST = '127.0.0.1'; // só esta máquina, já que não há login

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};
const LIMITE_CORPO = 16 * 1024;

function enviarJson(res, codigo, corpo) {
  res.writeHead(codigo, {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
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

async function rotear(req, res, db) {
  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname;

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

const db = abrirBanco(CAMINHO_BANCO);
if (semearExemplos(db)) console.log('Ordens de exemplo (EXEMPLO) criadas.');
criarServidor(db).listen(PORTA, HOST, () => {
  console.log(`Oficina Boa Estrada rodando em http://localhost:${PORTA}`);
});
