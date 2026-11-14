// Todas as frases que o cliente recebe, num lugar só, para a Rita aprovar.
// Os fatos (horário, endereço, preços) não ficam aqui: vêm de conhecimento.md.
import { secao } from './conhecimento.mjs';

// Mensagens que encerram o envio ao cliente (sem resposta).
export const PALAVRAS_PARAR = ['parar', 'pare'];

export const TEXTOS = {
  saudacao:
    'Oi! Tudo bem? Sou o assistente virtual do Patas Felizes. Posso responder sobre horário, endereço, preços de banho e tosa, hotelzinho, táxi dog, pagamento e ração.',
  identidade:
    'Sou o assistente virtual do Patas Felizes, não uma pessoa. Respondo perguntas frequentes e, para o resto, passo para a equipe.',
  saude:
    'Não consigo avaliar a saúde do animal por aqui. Vou passar para a equipe, que vai te ajudar. Se for urgente, procure um veterinário agora.',
  pessoa: 'Claro! Vou passar para a equipe. Uma pessoa vai te responder.',
  agendamento:
    'Agendamento, remarcação e cancelamento são com a equipe. Vou passar para eles.',
  reclamacao:
    'Sinto muito pelo transtorno. Vou passar para a equipe, que vai cuidar disso com você.',
  fora_da_base:
    'Essa informação eu não tenho. Vou passar para a equipe, que vai te responder.',
  nao_texto:
    'Por enquanto só consigo ler mensagens de texto. Vou passar sua mensagem para a equipe.',
  // Repasse padrão: usado quando um guardrail de saída barra a resposta.
  repasse:
    'Vou passar para a equipe, que vai te responder.',
  limite:
    'Recebi muitas mensagens de uma vez. Aguarde um minuto e escreva de novo.',
};

// Todo repasse termina citando o horário da base (decisão 3).
export function comHorario(texto) {
  return `${texto}\n\nNosso horário de atendimento: ${secao('Horário de funcionamento')}`;
}
