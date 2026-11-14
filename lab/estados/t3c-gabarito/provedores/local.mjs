// Provedor local: sem IA. Responde pela base de conhecimento e decide quando passar para a equipe.
//
// Contrato que todo provedor precisa cumprir:
//   nome                                   -> texto curto, ex.: 'local'
//   responder({ texto, telefone, historico }) -> { texto, passar_para_pessoa, motivo, tokens_entrada?, tokens_saida? }
//   verificarAmbiente() -> lista de variáveis que faltam para subir (opcional; vazia = pode subir)
//
// A ordem importa: a primeira regra que casar vence.
import { normalizar } from '../texto.mjs';
import { secao } from '../conhecimento.mjs';
import { TEXTOS, comHorario } from '../textos.mjs';

export const nome = 'local';

// 2. Saúde do animal: nunca opina.
const SAUDE = /\b(vomit\w*|ferid\w*|febre|sangue|sangr\w*|diarreia|mancan\w*|mancou|machuc\w*|convuls\w*|tosse|desmai\w*|intoxic\w*|veneno|envenen\w*|sem apetite|nao (esta|ta) comendo|dor|inchad\w*|sonolent\w*|prostrad\w*)\b/;
// 6. Identidade: diz que é assistente virtual.
const IDENTIDADE = /\bvoce e (um |uma )?(robo|bot|pessoa|humano|maquina|ia)\b|\be (um |uma )?(robo|bot)\b/;
// 3. Pediu uma pessoa.
const PESSOA = /\bfalar com\b|\bquero (uma |um )?(pessoa|humano|atendente)\b|\batendente humano\b|\bpessoa de verdade\b|\balguem da (loja|equipe)\b/;
// 4. Agendar, remarcar, cancelar: a equipe marca.
const AGENDA = /\b(agend\w*|remarc\w*|desmarc\w*|cancel\w*|marcar|marque|marcacao)\b/;
// 5. Reclamação.
const RECLAMACAO = /\b(reclam\w*|absurd\w*|pessim\w*|horriv\w*|raiva|irrit\w*|vergonh\w*|inaceit\w*|golpe|procon|estorno|devolu\w*|insatisf\w*|pior|maus tratos|nunca mais)\b/;
// 8. Saudação simples.
const SAUDACAO = /^(oi+|ola|tudo bem|bom dia|boa (tarde|noite)|e ai|opa)\b/;

// Perguntas de preço, tempo de banho e tosa só valem quando citam banho, tosa ou cão.
const BANHO = /\b(banho|tosa|tosar|cao|caes|porte|pequeno|medio|grande|cachorro)\b/;

// 7. Perguntas da base. Ordem: específicas antes das gerais.
const CONSULTAS = [
  { titulo: 'Hotelzinho', padrao: /\b(hotel\w*|hospeda\w*|diaria\w*)\b/ },
  { titulo: 'Táxi dog', padrao: /\b(taxi|busca|buscar|buscam|entrega|entregar)\b/ },
  { titulo: 'Ração', padrao: /\bracao(es)?\b/ },
  { titulo: 'Formas de pagamento', padrao: /\b(pagar|pagamento|pagam|pix|cartao|cartoes|debito|credito|cheque|parcel\w*|dinheiro)\b/ },
  { titulo: 'Banho e tosa: quanto tempo demora', padrao: /\b(quanto tempo|demor\w*|leva)\b/, exigeBanho: true },
  { titulo: 'Banho e tosa: preços', padrao: /\b(preco\w*|valor\w*|custa\w*|custo|quanto)\b/, exigeBanho: true },
  { titulo: 'Horário de funcionamento', padrao: /\b(horari\w*|funciona\w*|abre\w*|abert\w*|fecha\w*|que horas|sabado|domingo|segunda|feriado)\b/ },
  { titulo: 'Endereço', padrao: /\b(endereco|localiz\w*|onde|rua|bairro|como chego)\b/ },
];

function buscarConsulta(t) {
  for (const consulta of CONSULTAS) {
    if (!consulta.padrao.test(t)) continue;
    if (consulta.exigeBanho && !BANHO.test(t)) continue;
    return consulta.titulo;
  }
  return null;
}

export async function responder({ texto }) {
  const t = normalizar(texto);

  if (SAUDE.test(t)) {
    return { texto: comHorario(TEXTOS.saude), passar_para_pessoa: true, motivo: 'saude_animal' };
  }
  if (IDENTIDADE.test(t)) {
    return { texto: TEXTOS.identidade, passar_para_pessoa: false, motivo: 'identidade' };
  }
  if (PESSOA.test(t)) {
    return { texto: comHorario(TEXTOS.pessoa), passar_para_pessoa: true, motivo: 'pediu_pessoa' };
  }
  if (AGENDA.test(t)) {
    return { texto: comHorario(TEXTOS.agendamento), passar_para_pessoa: true, motivo: 'agendamento' };
  }
  if (RECLAMACAO.test(t)) {
    return { texto: comHorario(TEXTOS.reclamacao), passar_para_pessoa: true, motivo: 'reclamacao' };
  }

  const titulo = buscarConsulta(t);
  if (titulo) {
    return { texto: secao(titulo), passar_para_pessoa: false, motivo: `base: ${titulo}` };
  }
  if (SAUDACAO.test(t)) {
    return { texto: TEXTOS.saudacao, passar_para_pessoa: false, motivo: 'saudacao' };
  }

  // 9. Não está na base: repassa (decisão 4).
  return { texto: comHorario(TEXTOS.fora_da_base), passar_para_pessoa: true, motivo: 'fora_da_base' };
}
