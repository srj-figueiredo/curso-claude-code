// Regras que valem para qualquer provedor: quem já pediu "parar", conversa com a equipe,
// limite de mensagens, guardrails de saída e registro de entrada e saída.
// O provedor só decide o texto da resposta; daqui ele não escapa sem passar pelas regras.
import { normalizar } from './texto.mjs';
import { TEXTOS, PALAVRAS_PARAR, comHorario } from './textos.mjs';
import { novoIdDeSaida } from './banco.mjs';
import { VALORES_CONHECIDOS, PADRAO_VALOR, numeroDoValor } from './conhecimento.mjs';

// ---------- Entrada: manipulação ----------
// Só marca no registro (coluna suspeita). O fluxo segue normal.
const MANIPULACAO = [
  /\bignor\w*\s+(\w+\s+){0,2}(regras|instrucoes)\b/,
  /\besquec\w*\s+(\w+\s+){0,2}(regras|instrucoes)\b/,
  /\baja como\b/,
  /\bmodo desenvolvedor\b/,
];

export function pareceManipulacao(texto) {
  const t = normalizar(texto);
  return MANIPULACAO.some((padrao) => padrao.test(t));
}

// ---------- Saída: guardrails ----------
// Cada regra recebe a resposta pronta (texto) e diz se ela deve ser barrada.
// Os textos são normalizados (sem acento, minúsculo): 'garanto' pega 'Garanto', por exemplo.
const PEDIDO = '(informe|informa|envie|envia|mande|manda|digite|digita|me (passe|passa|mande|manda|diga|fale|envie)|preciso (do|da|de|dos|das)|pode (me )?(informar|passar|enviar|mandar)|qual (e )?(o |a )?(seu|sua))';
const PROMESSA = [/garanto/i, /100\s*%/, /sem falta/i, /com certeza absoluta/i];
const DIAGNOSTICO = [
  /\bdiagnostic\w*/,
  /\b(seu|o|a) (cao|gato|cachorro|animal|pet)\b[^.]{0,30}\b(tem|esta com|sofre de|apresenta)\b/,
  /\b(e|esta com|parece|provavel\w*|deve ser|pode ser|sinal de|sintoma de)\b[^.]{0,20}\b(infeccao|doenca|alergia|virose|verme|vermes|intoxicacao|parasita|cinomose|sarna|pulga|fratura|tumor|gastrite)\b/,
  /\b(de|dar|tome|use|aplique|administre) (o |um |uma |algum )?(remedio|medicamento|antibiotico|antiinflamatorio|analgesico|vermifugo)\b/,
];

const REGRAS_DE_SAIDA = [
  {
    regra: 'preco_fora_da_base',
    barra: (texto) => {
      return [...texto.matchAll(PADRAO_VALOR)].some((m) => !VALORES_CONHECIDOS.has(numeroDoValor(m[0])));
    },
  },
  {
    regra: 'promessa',
    barra: (texto) => PROMESSA.some((padrao) => padrao.test(texto)),
  },
  {
    regra: 'pede_dado_pessoal',
    barra: (texto) => {
      const t = normalizar(texto);
      return new RegExp(`\\b${PEDIDO}\\b[^.]{0,40}\\b(cpf|cnpj|endereco|cartao|cvv|validade)\\b`).test(t)
        || /\b(seu|sua|teu|tua)\s+(cpf|cnpj|cvv|numero do cartao|dados do cartao)\b/.test(t);
    },
  },
  {
    regra: 'diagnostico',
    barra: (texto) => DIAGNOSTICO.some((padrao) => padrao.test(normalizar(texto))),
  },
];

// Devolve o nome da regra que barrou a resposta, ou null se ela pode seguir.
export function barrarSaida(texto) {
  if (!texto) return null;
  const regra = REGRAS_DE_SAIDA.find((r) => r.barra(texto));
  return regra ? regra.regra : null;
}

// ---------- Fluxo ----------
export async function processarMensagem({ banco, provedor, limitador, msg }) {
  const { wa_id, telefone, nome, tipo, texto } = msg;

  banco.garantirCliente(telefone, nome);
  const suspeita = tipo === 'text' && pareceManipulacao(texto);
  const nova = banco.registrarMensagem({ wa_id, telefone, direcao: 'entrada', autor: 'cliente', tipo, texto, suspeita });
  if (!nova) return { acao: 'duplicada' };

  if (tipo === 'text' && PALAVRAS_PARAR.includes(normalizar(texto))) {
    banco.marcarParou(telefone);
    return { acao: 'parou', suspeita };
  }
  if (banco.obterCliente(telefone).parou) return { acao: 'silencio', motivo: 'parou', suspeita };
  if (banco.obterConversa(telefone).status === 'com_pessoa') {
    return { acao: 'silencio', motivo: 'com_pessoa', suspeita };
  }

  const limite = limitador.verificar(telefone);
  if (limite === 'silencio') return { acao: 'silencio', motivo: 'limite_mensagens', suspeita };
  if (limite === 'aviso') {
    banco.registrarMensagem({ wa_id: novoIdDeSaida(), telefone, direcao: 'saida', autor: 'bot', tipo: 'text', texto: TEXTOS.limite });
    return { acao: 'limitada', motivo: 'limite_mensagens', texto: TEXTOS.limite, suspeita };
  }

  let resposta =
    tipo === 'text'
      ? await provedor.responder({ texto, telefone, historico: banco.historico(telefone, 20) })
      : { texto: comHorario(TEXTOS.nao_texto), passar_para_pessoa: true, motivo: 'nao_texto' };

  const regra = barrarSaida(resposta.texto);
  if (regra) {
    resposta = { texto: comHorario(TEXTOS.repasse), passar_para_pessoa: true, motivo: 'guardrail', regra };
  }

  if (resposta.texto) {
    banco.registrarMensagem({
      wa_id: novoIdDeSaida(),
      telefone,
      direcao: 'saida',
      autor: 'bot',
      tipo: 'text',
      texto: resposta.texto,
    });
  }
  if (resposta.passar_para_pessoa) banco.definirStatus(telefone, 'com_pessoa', resposta.motivo);

  return {
    acao: resposta.passar_para_pessoa ? 'repassada' : 'respondida',
    motivo: resposta.motivo,
    regra: resposta.regra,
    suspeita,
    texto: resposta.texto,
  };
}
