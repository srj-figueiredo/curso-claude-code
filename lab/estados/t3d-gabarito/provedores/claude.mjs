// Provedor da IA paga: API de mensagens da Anthropic, por fetch (sem pacotes).
// Contrato em local.mjs. Qualquer falha vira repasse para a equipe (motivo erro_provedor),
// nunca uma resposta inventada. A chave da API nunca vai para log nem para erro.
import { CONHECIMENTO_COMPLETO } from '../conhecimento.mjs';
import { TEXTOS, comHorario } from '../textos.mjs';

export const nome = 'claude';
export const URL_PADRAO = 'https://api.anthropic.com/v1/messages';
const VERSAO_DA_API = '2026-10-21';
const TEMPO_LIMITE_MS = 15_000;
const MAX_TOKENS = 1024;
const MAX_MENSAGENS = 6;

// Variáveis que faltam para o provedor subir. Lista vazia = pode subir.
// ANTHROPIC_URL não entra: é só para o teste apontar para um servidor falso.
export function verificarAmbiente() {
  const faltando = [];
  if (!process.env.ANTHROPIC_API_KEY?.trim()) faltando.push('ANTHROPIC_API_KEY');
  if (!process.env.CLAUDE_MODELO?.trim()) faltando.push('CLAUDE_MODELO');
  return faltando;
}

const INSTRUCOES = [
  'Você é o atendente do Pet Shop Patas Felizes no WhatsApp. Você é um assistente virtual, não uma pessoa: se perguntarem, diga isso.',
  '',
  'Regras (valem sempre):',
  '- Só afirme o que está na base de conhecimento abaixo. Se não estiver lá, não invente: passe para a equipe.',
  '- Nunca invente preço, prazo, produto ou promoção.',
  '- Não dê diagnóstico nem orientação de saúde do animal. Passe para a equipe e sugira procurar um veterinário.',
  '- Nunca prometa horário. Agendar, remarcar e cancelar são com a equipe: passe para a equipe.',
  '- Reclamação, cliente irritado ou pedido para falar com uma pessoa: passe para a equipe.',
  '- Nunca peça CPF, endereço do cliente nem dados de cartão.',
  '- Tom simpático e direto, frases curtas, no máximo um emoji por mensagem.',
  '',
  'Formato: responda somente com um objeto JSON, sem nada antes ou depois, neste formato:',
  '{"texto": "mensagem para o cliente", "passar_para_pessoa": true ou false, "motivo": "motivo curto"}',
  'Use "passar_para_pessoa": true quando a equipe precisar assumir a conversa.',
  '',
  'Base de conhecimento:',
  CONHECIMENTO_COMPLETO,
].join('\n');

// Últimas mensagens da conversa, alternando user e assistant, começando e terminando no cliente.
function montarMensagens(historico, textoAtual) {
  const trocas = (historico ?? [])
    .filter((m) => typeof m.texto === 'string' && m.texto.trim() !== '')
    .map((m) => ({ role: m.direcao === 'entrada' ? 'user' : 'assistant', content: m.texto }))
    .slice(-MAX_MENSAGENS);

  const mensagens = [];
  for (const troca of trocas) {
    if (mensagens.length === 0 && troca.role === 'assistant') continue;
    const anterior = mensagens.at(-1);
    if (anterior?.role === troca.role) anterior.content += `\n${troca.content}`;
    else mensagens.push({ ...troca });
  }
  if (mensagens.at(-1)?.role !== 'user') mensagens.push({ role: 'user', content: textoAtual });
  return mensagens;
}

function textoDaResposta(dados) {
  if (!Array.isArray(dados?.content)) return '';
  return dados.content
    .filter((bloco) => bloco?.type === 'text' && typeof bloco.text === 'string')
    .map((bloco) => bloco.text)
    .join('');
}

// Aceita o JSON puro ou dentro de cerca de markdown. Qualquer outra forma é recusada.
function lerDecisao(bruto) {
  let t = bruto.trim();
  const cerca = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (cerca) t = cerca[1];

  let obj;
  try {
    obj = JSON.parse(t);
  } catch {
    return null;
  }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;
  if (typeof obj.texto !== 'string' || !obj.texto.trim()) return null;
  if (typeof obj.passar_para_pessoa !== 'boolean') return null;
  const motivo = typeof obj.motivo === 'string' && obj.motivo.trim() ? obj.motivo.trim().slice(0, 100) : 'sem_motivo';
  return { texto: obj.texto.trim(), passar: obj.passar_para_pessoa, motivo };
}

const inteiroOuNulo = (valor) => (Number.isInteger(valor) && valor >= 0 ? valor : null);

export async function responder({ texto, historico }) {
  const chave = (process.env.ANTHROPIC_API_KEY ?? '').trim();
  const url = process.env.ANTHROPIC_URL?.trim() || URL_PADRAO;
  const pedido = {
    model: (process.env.CLAUDE_MODELO ?? '').trim(),
    max_tokens: MAX_TOKENS,
    system: INSTRUCOES,
    messages: montarMensagens(historico, texto),
  };

  // Tokens são gravados sempre que a API informou o uso, mesmo quando a resposta é recusada.
  const uso = { tokens_entrada: null, tokens_saida: null };
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);
  const motivo = (padrao) => (controle.signal.aborted ? 'tempo esgotado' : padrao);
  const falha = (detalhe) => {
    console.error(`provedor claude: ${detalhe}`);
    return { texto: comHorario(TEXTOS.repasse), passar_para_pessoa: true, motivo: 'erro_provedor', ...uso };
  };

  try {
    let http;
    try {
      http = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': chave,
          'anthropic-version': VERSAO_DA_API,
        },
        body: JSON.stringify(pedido),
        signal: controle.signal,
      });
    } catch {
      return falha(motivo('falha de rede'));
    }
    if (!http.ok) {
      await http.body?.cancel().catch(() => {});
      return falha(`HTTP ${http.status}`);
    }

    let dados;
    try {
      dados = await http.json();
    } catch {
      return falha(motivo('resposta sem JSON válido'));
    }

    uso.tokens_entrada = inteiroOuNulo(dados?.usage?.input_tokens);
    uso.tokens_saida = inteiroOuNulo(dados?.usage?.output_tokens);
    if (dados?.stop_reason === 'max_tokens') return falha('resposta cortada (max_tokens)');

    const decisao = lerDecisao(textoDaResposta(dados));
    if (!decisao) return falha('resposta sem JSON válido');

    return {
      texto: decisao.passar ? comHorario(decisao.texto) : decisao.texto,
      passar_para_pessoa: decisao.passar,
      motivo: decisao.motivo,
      ...uso,
    };
  } finally {
    clearTimeout(relogio);
  }
}
