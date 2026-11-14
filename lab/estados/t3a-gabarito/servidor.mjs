// Servidor do atendente Patas Felizes.
// Rodar: node servidor.mjs  ->  http://localhost:3100
// Variáveis: PROVEDOR (padrão local), PORTA (padrão 3100).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { abrirBanco } from './banco.mjs';
import { extrairMensagens, PayloadInvalido } from './webhook.mjs';
import { processarMensagem } from './nucleo.mjs';
import { resolverProvedor } from './provedores/index.mjs';

const CAMINHO_BANCO_PADRAO = fileURLToPath(new URL('./dados/patas.db', import.meta.url));
const PAGINA = fileURLToPath(new URL('./publico/index.html', import.meta.url));
const LIMITE_CORPO = 1024 * 1024;

export function criarServidor({
  caminhoBanco = CAMINHO_BANCO_PADRAO,
  provedor: nomeProvedor = process.env.PROVEDOR,
} = {}) {
  const provedor = resolverProvedor(nomeProvedor);
  const banco = abrirBanco(caminhoBanco);

  const servidor = createServer(async (req, res) => {
    try {
      await rotear(req, res);
    } catch (erro) {
      console.error(erro);
      enviarJson(res, 500, { erro: 'erro interno' });
    }
  });

  return { servidor, banco, provedor };

  async function rotear(req, res) {
    const url = new URL(req.url, 'http://localhost');

    if (req.method === 'GET' && url.pathname === '/') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      return res.end(await readFile(PAGINA));
    }
    if (req.method === 'GET' && url.pathname === '/api/info') {
      return enviarJson(res, 200, { provedor: provedor.nome });
    }
    if (req.method === 'GET' && url.pathname === '/api/conversa') {
      const telefone = url.searchParams.get('telefone') ?? '';
      if (!/^\d{5,20}$/.test(telefone)) return enviarJson(res, 400, { erro: 'telefone inválido' });
      return enviarJson(res, 200, {
        cliente: banco.obterCliente(telefone) ?? null,
        conversa: banco.obterConversa(telefone) ?? null,
        mensagens: banco.historico(telefone, 200),
      });
    }
    if (req.method === 'POST' && url.pathname === '/webhook') {
      return receberWebhook(req, res);
    }
    return enviarJson(res, 404, { erro: 'não encontrado' });
  }

  async function receberWebhook(req, res) {
    let mensagens;
    try {
      const payload = JSON.parse(await lerCorpo(req));
      mensagens = extrairMensagens(payload);
    } catch (erro) {
      if (erro instanceof PayloadInvalido || erro instanceof SyntaxError) {
        return enviarJson(res, 400, { erro: erro.message });
      }
      throw erro;
    }

    const acoes = [];
    for (const msg of mensagens) {
      acoes.push((await processarMensagem({ banco, provedor, msg })).acao);
    }
    return enviarJson(res, 200, { recebidas: mensagens.length, acoes });
  }
}

function lerCorpo(req) {
  return new Promise((ok, falha) => {
    const partes = [];
    let tamanho = 0;
    req.on('data', (parte) => {
      tamanho += parte.length;
      if (tamanho > LIMITE_CORPO) {
        falha(new PayloadInvalido('corpo grande demais'));
        req.destroy();
        return;
      }
      partes.push(parte);
    });
    req.on('end', () => ok(Buffer.concat(partes).toString('utf8')));
    req.on('error', falha);
  });
}

function enviarJson(res, status, corpo) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(corpo));
}

// Só sobe o servidor quando o arquivo é executado diretamente (node servidor.mjs).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const porta = Number(process.env.PORTA ?? 3100);
  const { servidor, provedor } = criarServidor();
  servidor.listen(porta, () => {
    console.log(`Patas Felizes: atendente em http://localhost:${porta} (provedor: ${provedor.nome})`);
  });
}
