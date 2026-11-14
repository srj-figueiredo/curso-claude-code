// Servidor falso da API da Anthropic. Só o conferir.mjs usa (não sobe sozinho).
// Confere o pedido como a API faria (cabeçalhos, modelo, max_tokens, base no system, mensagens
// alternando) e responde no formato da API. A última mensagem do cliente escolhe a resposta.
// ultimo() devolve o último pedido recebido e os problemas encontrados nele.
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';

const BASE = readFileSync(new URL('./conhecimento.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const VERSAO_DA_API = '2026-10-21';
const USO = { input_tokens: 321, output_tokens: 45 };

const json = (texto, passar = false, motivo = 'base') => JSON.stringify({ texto, passar_para_pessoa: passar, motivo });
const erro = (status, tipo) => ({ status, corpo: { type: 'error', error: { type: tipo, message: 'erro simulado' } } });

// Gatilho (trecho da mensagem do cliente) -> o que responder.
const GATILHOS = [
  ['teste 401', erro(401, 'authentication_error')],
  ['teste 429', erro(429, 'rate_limit_error')],
  ['teste 500', erro(500, 'api_error')],
  ['teste lento', { lento: true }],
  ['teste json', { texto: 'isto não é JSON' }],
  ['teste max', { texto: '{"texto": "Claro, vou', parada: 'max_tokens' }],
  ['teste cercas', { texto: '```json\n' + json('Banho e tosa para cão pequeno: R$ 80,00.') + '\n```' }],
  ['teste preco', { texto: json('O banho sai por R$ 45,00 para cães pequenos.') }],
  ['teste promessa', { texto: json('Garanto que fica pronto hoje.') }],
  ['teste cpf', { texto: json('Para continuar, informe seu CPF.') }],
  ['teste diagnostico', { texto: json('Seu cão tem uma infecção. Dê antibiótico a ele.') }],
  ['teste valido', { texto: json('Banho e tosa para cão pequeno: R$ 80,00.') }],
  ['teste agenda', { texto: json('Vou passar para a equipe.', true, 'agendamento') }],
];

function escolherResposta(textoCliente) {
  const t = textoCliente.toLowerCase();
  const achado = GATILHOS.find(([gatilho]) => t.includes(gatilho));
  if (achado) return achado[1];
  if (/hor[aá]rio/i.test(textoCliente)) {
    return { texto: json('Segunda a sexta, das 8h às 18h. Sábado, das 8h às 14h. Domingo fechado.', false, 'base: Horário de funcionamento') };
  }
  return { texto: json('Oi! Sou o assistente virtual do Patas Felizes.', false, 'saudacao') };
}

// Mesmas regras que a API aplica ao pedido. Devolve a lista de problemas (vazia = pedido correto).
function conferirPedido(cabecalhos, corpo, chave, modelo) {
  const problemas = [];
  if (!String(cabecalhos['content-type'] ?? '').startsWith('application/json')) problemas.push('content-type');
  if (cabecalhos['x-api-key'] !== chave) problemas.push('x-api-key');
  if (cabecalhos['anthropic-version'] !== VERSAO_DA_API) problemas.push('anthropic-version');
  if (corpo?.model !== modelo) problemas.push('model');
  if (corpo?.max_tokens !== 1024) problemas.push('max_tokens');
  if (typeof corpo?.system !== 'string' || !corpo.system.includes(BASE)) problemas.push('system sem a base de conhecimento');

  const mensagens = corpo?.messages;
  if (!Array.isArray(mensagens) || mensagens.length === 0 || mensagens.length > 6) {
    problemas.push('messages: deve ter de 1 a 6 mensagens');
  } else {
    mensagens.forEach((m, i) => {
      if (m?.role !== (i % 2 === 0 ? 'user' : 'assistant')) problemas.push(`messages: papel fora de ordem na posição ${i}`);
      if (typeof m?.content !== 'string' || !m.content.trim()) problemas.push(`messages: conteúdo vazio na posição ${i}`);
    });
    if (mensagens.at(-1)?.role !== 'user') problemas.push('messages: não termina com o cliente');
  }
  return problemas;
}

function lerCorpo(req) {
  return new Promise((ok, falha) => {
    const partes = [];
    req.on('data', (parte) => partes.push(parte));
    req.on('end', () => ok(Buffer.concat(partes).toString('utf8')));
    req.on('error', falha);
  });
}

function enviar(res, status, corpo) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(corpo));
}

export async function iniciarFalsoAnthropic({ chave, modelo }) {
  let ultimo = null;

  const servidor = createServer(async (req, res) => {
    if (req.method !== 'POST' || req.url !== '/v1/messages') {
      return enviar(res, 404, { type: 'error', error: { type: 'not_found_error', message: 'rota desconhecida' } });
    }

    const bruto = await lerCorpo(req);
    let corpo = null;
    try {
      corpo = JSON.parse(bruto);
    } catch {
      corpo = null;
    }
    const problemas = conferirPedido(req.headers, corpo, chave, modelo);
    ultimo = { cabecalhos: req.headers, corpo, problemas };

    if (req.headers['x-api-key'] !== chave) {
      return enviar(res, 401, { type: 'error', error: { type: 'authentication_error', message: 'chave inválida' } });
    }
    if (problemas.length) {
      return enviar(res, 400, { type: 'error', error: { type: 'invalid_request_error', message: problemas.join('; ') } });
    }

    const ultimaMensagem = corpo.messages.at(-1).content;
    const r = escolherResposta(ultimaMensagem);
    if (r.lento) return; // não responde: o provedor precisa desistir sozinho
    if (r.status) return enviar(res, r.status, r.corpo);

    enviar(res, 200, {
      id: 'msg_falso',
      type: 'message',
      role: 'assistant',
      model: modelo,
      content: [{ type: 'text', text: r.texto }],
      stop_reason: r.parada ?? 'end_turn',
      stop_sequence: null,
      usage: USO,
    });
  });

  await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok));
  return {
    url: `http://127.0.0.1:${servidor.address().port}/v1/messages`,
    ultimo: () => ultimo,
    parar: () => new Promise((ok) => {
      servidor.closeAllConnections();
      servidor.close(() => ok());
    }),
  };
}
