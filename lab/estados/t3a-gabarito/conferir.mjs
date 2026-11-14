// Verificação automática do atendente. Não precisa de internet nem de IA: node conferir.mjs
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { criarServidor } from './servidor.mjs';
import { resolverProvedor } from './provedores/index.mjs';

const CONHECIMENTO = readFileSync(new URL('./conhecimento.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

const pasta = mkdtempSync(join(tmpdir(), 'patas-conferir-'));
const { servidor, banco, provedor } = criarServidor({ caminhoBanco: join(pasta, 'teste.db'), provedor: 'local' });
await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok));
const base = `http://127.0.0.1:${servidor.address().port}`;

let total = 0;
let falhas = 0;
const respostasDoAtendente = [];
let contador = 0;
const novoTelefone = () => `551199999${String(++contador).padStart(4, '0')}`;

function afirmar(nome, condicao, detalhe = '') {
  total++;
  if (condicao) {
    console.log(`  OK      ${nome}`);
  } else {
    falhas++;
    console.log(`  FALHOU  ${nome}${detalhe ? `  (${detalhe})` : ''}`);
  }
}

async function post(caminho, corpo) {
  const resposta = await fetch(base + caminho, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof corpo === 'string' ? corpo : JSON.stringify(corpo),
  });
  return { status: resposta.status, corpo: await resposta.json() };
}

async function conversa(telefone) {
  const resposta = await fetch(`${base}/api/conversa?telefone=${telefone}`);
  return resposta.json();
}

function envelope(telefone, mensagem) {
  return {
    object: 'whatsapp_business_account',
    entry: [{
      id: 'TESTE',
      changes: [{
        field: 'messages',
        value: {
          messaging_product: 'whatsapp',
          metadata: { display_phone_number: '5511900000000', phone_number_id: 'TESTE' },
          contacts: [{ profile: { name: 'Cliente teste' }, wa_id: telefone }],
          messages: [mensagem],
        },
      }],
    }],
  };
}

// Manda uma mensagem e devolve o que o atendente respondeu nesse turno.
async function turno(telefone, texto, { tipo = 'text', id } = {}) {
  const wa_id = id ?? `wamid.TESTE${Date.now()}${Math.floor(Math.random() * 1e6)}`;
  const mensagem = tipo === 'text'
    ? { from: telefone, id: wa_id, timestamp: '1700000000', type: 'text', text: { body: texto } }
    : { from: telefone, id: wa_id, timestamp: '1700000000', type: tipo, [tipo]: { id: 'midia' } };

  const antes = (await conversa(telefone)).mensagens.filter((m) => m.direcao === 'saida').length;
  const recebido = await post('/webhook', envelope(telefone, mensagem));
  const depois = await conversa(telefone);
  const novas = depois.mensagens.filter((m) => m.direcao === 'saida').slice(antes).map((m) => m.texto);

  respostasDoAtendente.push(...novas);
  console.log(`      cliente: ${tipo === 'text' ? texto : `[${tipo}]`}`);
  for (const r of novas) console.log(`      atendente: ${r.replace(/\n/g, ' / ')}`);

  return { status: recebido.status, corpo: recebido.corpo, respostas: novas, conv: depois.conversa, cliente: depois.cliente, mensagens: depois.mensagens };
}

try {
  console.log('1. Respostas pela base de conhecimento');
  const casosBase = [
    ['Qual o horário de vocês?', 'Segunda a sexta'],
    ['Qual o endereço?', 'Rua dos Ipês, 88'],
    ['Quanto custa o banho e tosa de um cão de 5 kg?', 'R$ 80,00'],
    ['Quanto tempo leva o banho?', '1h30 a 2h'],
    ['Vocês têm hotelzinho?', 'R$ 60,00'],
    ['Quanto custa a diária do hotel?', 'R$ 60,00'],
    ['Faz táxi dog?', 'R$ 20,00'],
    ['Aceitam pix?', 'Pix'],
    ['Vendem ração?', 'Vendemos ração'],
    ['Vocês abrem aos domingos?', 'Domingo fechado'],
  ];
  for (const [pergunta, esperado] of casosBase) {
    const t = await turno(novoTelefone(), pergunta);
    afirmar(`"${pergunta}" responde com a base, sem repasse`,
      t.respostas.some((r) => r.includes(esperado)) && t.conv.status === 'bot',
      `status ${t.conv.status}`);
  }
  const oi = await turno(novoTelefone(), 'Oi, tudo bem?');
  afirmar('saudação se apresenta como assistente virtual', oi.respostas.some((r) => r.includes('assistente virtual')));

  console.log('\n2. Repasses para a equipe (motivo gravado)');
  const casosRepasse = [
    ['Quero agendar um banho para amanhã', 'agendamento'],
    ['Preciso cancelar o hotel', 'agendamento'],
    ['Que absurdo, fui mal atendido', 'reclamacao'],
    ['Meu cão está vomitando, o que eu faço?', 'saude_animal'],
    ['Quero falar com uma pessoa', 'pediu_pessoa'],
    ['Vocês atendem gatos?', 'fora_da_base'],
  ];
  for (const [pergunta, motivo] of casosRepasse) {
    const t = await turno(novoTelefone(), pergunta);
    afirmar(`"${pergunta}" → repasse (${motivo})`,
      t.conv.status === 'com_pessoa' && t.conv.motivo_repasse === motivo && t.respostas.length === 1,
      `status ${t.conv.status}, motivo ${t.conv.motivo_repasse}`);
    afirmar(`   repasse cita o horário da base`,
      t.respostas.some((r) => r.includes('Nosso horário de atendimento: Segunda a sexta')));
  }
  const saude = await turno(novoTelefone(), 'Meu cão está com febre');
  afirmar('saúde: sugere veterinário e não traz preço', saude.respostas.some((r) => r.includes('veterinário')) && !saude.respostas.some((r) => r.includes('R$')));

  const robo = await turno(novoTelefone(), 'Você é um robô?');
  afirmar('"Você é um robô?" → assistente virtual, sem repasse',
    robo.respostas.some((r) => r.includes('assistente virtual')) && robo.conv.status === 'bot');

  const audio = await turno(novoTelefone(), '', { tipo: 'audio' });
  afirmar('áudio: avisa que só lê texto e repassa',
    audio.respostas.some((r) => r.includes('só consigo ler mensagens de texto')) && audio.conv.status === 'com_pessoa');

  console.log('\n3. "parar" e "pare"');
  const tp = novoTelefone();
  await turno(tp, 'Oi');
  const parar = await turno(tp, 'Parar');
  afirmar('"Parar" não gera nenhuma resposta', parar.respostas.length === 0);
  afirmar('cliente fica marcado como parou', parar.cliente.parou === 1);
  const depoisDeParar = await turno(tp, 'Quanto custa o hotel?');
  afirmar('depois de "parar", nenhuma mensagem é enviada', depoisDeParar.respostas.length === 0);
  afirmar('a mensagem depois de "parar" fica registrada',
    depoisDeParar.mensagens.some((m) => m.direcao === 'entrada' && m.texto === 'Quanto custa o hotel?'));

  const tp2 = novoTelefone();
  const pare = await turno(tp2, 'Pare!');
  afirmar('"Pare!" (com pontuação) também para', pare.respostas.length === 0 && pare.cliente.parou === 1);

  const frase = await turno(novoTelefone(), 'Quero parar de receber');
  afirmar('"quero parar de receber" não conta como "parar"',
    frase.cliente.parou === 0 && frase.respostas.length === 1);

  console.log('\n4. Com a equipe assumindo, o atendente se cala');
  const tc = novoTelefone();
  await turno(tc, 'Quero falar com uma pessoa');
  const durante = await turno(tc, 'Oi, tudo bem?');
  afirmar('nenhuma resposta enquanto está com a equipe', durante.respostas.length === 0 && durante.conv.status === 'com_pessoa');
  afirmar('a mensagem durante o repasse fica registrada',
    durante.mensagens.some((m) => m.direcao === 'entrada' && m.texto === 'Oi, tudo bem?'));

  console.log('\n5. Webhook e registro');
  const tw = novoTelefone();
  const idRepetido = 'wamid.REPETIDO000001';
  await turno(tw, 'Oi', { id: idRepetido });
  const antesReenvio = (await conversa(tw)).mensagens.length;
  const reenvio = await post('/webhook', envelope(tw, { from: tw, id: idRepetido, timestamp: '1700000000', type: 'text', text: { body: 'Oi' } }));
  const depoisReenvio = await conversa(tw);
  afirmar('reenvio do mesmo id é reconhecido e ignorado',
    reenvio.status === 200 && reenvio.corpo.acoes.includes('duplicada'));
  afirmar('reenvio não duplica nem responde de novo',
    depoisReenvio.mensagens.length === antesReenvio);

  const semEntry = await post('/webhook', { object: 'whatsapp_business_account' });
  afirmar('payload sem "entry" → 400', semEntry.status === 400);
  const jsonQuebrado = await post('/webhook', '{isto não é json');
  afirmar('JSON inválido → 400', jsonQuebrado.status === 400);
  const semIdNemFrom = await post('/webhook', { entry: [{ changes: [{ field: 'messages', value: { messages: [{ type: 'text' }] } }] }] });
  afirmar('mensagem sem id/from → 400', semIdNemFrom.status === 400);

  const eventoStatus = await post('/webhook', {
    object: 'whatsapp_business_account',
    entry: [{ id: 'TESTE', changes: [{ field: 'messages', value: { statuses: [{ id: 'x', status: 'delivered' }] } }] }],
  });
  afirmar('evento de status (sem mensagens) → 200 e nada processado',
    eventoStatus.status === 200 && eventoStatus.corpo.recebidas === 0);

  const registro = await conversa(tw);
  afirmar('registra quem perguntou (telefone e nome)', registro.cliente.telefone === tw && registro.cliente.nome === 'Cliente teste');
  afirmar('registra entrada e saída',
    registro.mensagens.some((m) => m.direcao === 'entrada') && registro.mensagens.some((m) => m.direcao === 'saida'));

  console.log('\n6. Provedor escolhido por PROVEDOR');
  afirmar('sem PROVEDOR, usa "local"', resolverProvedor(undefined).nome === 'local');
  afirmar('PROVEDOR vazio, usa "local"', resolverProvedor('   ').nome === 'local');
  let erroProvedor = null;
  try { resolverProvedor('inexistente'); } catch (erro) { erroProvedor = erro; }
  afirmar('PROVEDOR desconhecido recusa iniciar', erroProvedor !== null);
  const info = await (await fetch(`${base}/api/info`)).json();
  afirmar('API informa o provedor em uso', info.provedor === 'local' && provedor.nome === 'local');

  console.log('\n7. Conteúdo de todas as respostas do atendente');
  const todas = respostasDoAtendente.join('\n');
  const precos = [...new Set(todas.match(/R\$ ?\d{1,3}(\.\d{3})*,\d{2}/g) ?? [])];
  afirmar(`todo preço dito existe em conhecimento.md (${precos.length} valores diferentes)`,
    precos.every((p) => CONHECIMENTO.includes(p)),
    precos.filter((p) => !CONHECIMENTO.includes(p)).join(', '));
  afirmar('nenhuma resposta pede CPF, endereço do cliente ou dados de cartão',
    !/\bcpf\b|\bcnpj\b/i.test(todas) &&
    !/(informe|envie|me (passe|mande|diga)|qual (e |é )?(seu|sua))[^.\n]{0,40}(cpf|endereco|cartao)/i.test(todas));
  afirmar('nenhuma resposta confirma ou promete horário',
    !/\b(agendado|confirmado|marcado para|vou marcar|marquei)\b/i.test(todas));
  afirmar('no máximo um emoji por mensagem',
    respostasDoAtendente.every((r) => (r.match(/\p{Extended_Pictographic}/gu) ?? []).length <= 1));
} catch (erro) {
  falhas++;
  total++;
  console.log(`  FALHOU  execução interrompida: ${erro.message}`);
} finally {
  servidor.closeAllConnections();
  servidor.close();
  banco.fechar();
  rmSync(pasta, { recursive: true, force: true });
}

console.log(`\n${total - falhas} de ${total} verificações passaram.`);
process.exitCode = falhas ? 1 : 0;
