// Regras que valem para qualquer provedor: quem já pediu "parar", conversa com a equipe,
// registro de entrada e saída. O provedor só decide o texto da resposta.
import { normalizar } from './texto.mjs';
import { TEXTOS, PALAVRAS_PARAR, comHorario } from './textos.mjs';
import { novoIdDeSaida } from './banco.mjs';

export async function processarMensagem({ banco, provedor, msg }) {
  const { wa_id, telefone, nome, tipo, texto } = msg;

  banco.garantirCliente(telefone, nome);
  const nova = banco.registrarMensagem({ wa_id, telefone, direcao: 'entrada', autor: 'cliente', tipo, texto });
  if (!nova) return { acao: 'duplicada' };

  if (tipo === 'text' && PALAVRAS_PARAR.includes(normalizar(texto))) {
    banco.marcarParou(telefone);
    return { acao: 'parou' };
  }
  if (banco.obterCliente(telefone).parou) return { acao: 'silencio', motivo: 'parou' };
  if (banco.obterConversa(telefone).status === 'com_pessoa') {
    return { acao: 'silencio', motivo: 'com_pessoa' };
  }

  const resposta =
    tipo === 'text'
      ? await provedor.responder({ texto, telefone, historico: banco.historico(telefone, 20) })
      : { texto: comHorario(TEXTOS.nao_texto), passar_para_pessoa: true, motivo: 'nao_texto' };

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
    texto: resposta.texto,
  };
}
