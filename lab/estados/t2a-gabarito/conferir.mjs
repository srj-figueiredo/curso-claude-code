// Confere o sistema de ponta a ponta: sobe o servidor numa porta de teste,
// usa um banco temporário e testa cadastro, validação, filtro, troca de status e painel.
import { spawn } from 'node:child_process';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('.', import.meta.url));
const PORTA = 3917;
const BASE = `http://127.0.0.1:${PORTA}`;
const BANCO = join(tmpdir(), `oficina-conferir-${process.pid}-${Date.now()}.db`);

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

const servidor = spawn(process.execPath, [join(RAIZ, 'servidor.mjs')], {
  env: { ...process.env, PORTA: String(PORTA), OFICINA_DB: BANCO },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let saidaServidor = '';
servidor.stdout.on('data', (d) => (saidaServidor += d));
servidor.stderr.on('data', (d) => (saidaServidor += d));

async function esperarServidor() {
  const limite = Date.now() + 10000;
  while (Date.now() < limite) {
    try {
      const r = await fetch(`${BASE}/api/painel`);
      if (r.ok) return;
    } catch {
      // ainda não subiu
    }
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error(`servidor não respondeu em 10 s. Saída:\n${saidaServidor}`);
}

async function chamar(metodo, caminho, corpo) {
  const r = await fetch(BASE + caminho, {
    method: metodo,
    headers: corpo !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
  });
  const dados = await r.json().catch(() => null);
  return { codigo: r.status, dados };
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

  // 1. Painel: só abertas e prontas, sem faturamento (decisão 1)
  const antes = await chamar('GET', '/api/painel');
  checar('painel responde 200', antes.codigo === 200);
  checar('painel tem só abertas e prontas', JSON.stringify(Object.keys(antes.dados).sort()) === '["abertas","prontas"]', JSON.stringify(antes.dados));

  // 2. Exemplos: três, todos marcados EXEMPLO
  const todas0 = await chamar('GET', '/api/ordens');
  const exemplos = todas0.dados.filter((o) => o.exemplo);
  checar('três ordens de exemplo criadas', exemplos.length === 3, `achou ${exemplos.length}`);
  checar('exemplos com EXEMPLO no nome', exemplos.every((o) => o.cliente.includes('EXEMPLO')));

  // 3. Cadastro válido
  const novo = await chamar('POST', '/api/ordens', ORDEM_TESTE);
  checar('cadastro válido responde 201', novo.codigo === 201, `código ${novo.codigo}`);
  const id = novo.dados?.id;
  checar('cadastro devolve id', Number.isInteger(id));

  // 4. Cadastro inválido
  const ruim = await chamar('POST', '/api/ordens', { ...ORDEM_TESTE, placa: 'XX', valor: 'abc' });
  checar('placa e valor inválidos respondem 400', ruim.codigo === 400, `código ${ruim.codigo}`);
  checar('erros dizem o que corrigir', (ruim.dados?.erros || []).length === 2, JSON.stringify(ruim.dados));

  // 5. Lista: nova ordem aparece como aberta, com valor em centavos e placa normalizada
  const abertas = await chamar('GET', '/api/ordens?status=aberta');
  const achada = abertas.dados.find((o) => o.id === id);
  checar('ordem nova aparece no filtro aberta', Boolean(achada));
  checar('ordem nova começa como aberta', achada?.status === 'aberta');
  checar('valor "1.250,50" guardado como 125050 centavos', achada?.valor_centavos === 125050, `achou ${achada?.valor_centavos}`);
  checar('placa normalizada para TST1A23', achada?.placa === 'TST1A23', `achou ${achada?.placa}`);
  checar('telefone guardado só com dígitos', achada?.telefone === '11988887777', `achou ${achada?.telefone}`);

  // 6. Painel depois do cadastro: abertas sobe 1
  const depoisCadastro = await chamar('GET', '/api/painel');
  checar('painel: abertas +1 após cadastro', depoisCadastro.dados.abertas === antes.dados.abertas + 1,
    `antes ${antes.dados.abertas}, depois ${depoisCadastro.dados.abertas}`);

  // 7. Troca de status para pronta
  const troca = await chamar('PATCH', `/api/ordens/${id}/status`, { status: 'pronta' });
  checar('troca para pronta responde 200', troca.codigo === 200, `código ${troca.codigo}`);

  // 8. Painel depois da troca: prontas sobe 1, abertas volta ao valor anterior
  const depoisTroca = await chamar('GET', '/api/painel');
  checar('painel: prontas +1 após troca', depoisTroca.dados.prontas === antes.dados.prontas + 1,
    `antes ${antes.dados.prontas}, depois ${depoisTroca.dados.prontas}`);
  checar('painel: abertas voltou ao valor de antes', depoisTroca.dados.abertas === antes.dados.abertas,
    `antes ${antes.dados.abertas}, depois ${depoisTroca.dados.abertas}`);

  // 9. Filtro pronta mostra a ordem; filtro aberta não mostra mais
  const filtroPronta = await chamar('GET', '/api/ordens?status=pronta');
  checar('filtro pronta mostra a ordem trocada', filtroPronta.dados.some((o) => o.id === id));
  const filtroAberta = await chamar('GET', '/api/ordens?status=aberta');
  checar('filtro aberta não mostra mais a ordem', !filtroAberta.dados.some((o) => o.id === id));

  // 10. Troca livre: volta para aberta (decisão 4)
  const volta = await chamar('PATCH', `/api/ordens/${id}/status`, { status: 'aberta' });
  checar('troca livre (pronta → aberta) responde 200', volta.codigo === 200);

  // 11. Erros de status
  const statusRuim = await chamar('PATCH', `/api/ordens/${id}/status`, { status: 'faturada' });
  checar('status fora da lista responde 400', statusRuim.codigo === 400, `código ${statusRuim.codigo}`);
  const naoExiste = await chamar('PATCH', '/api/ordens/999999/status', { status: 'pronta' });
  checar('ordem inexistente responde 404', naoExiste.codigo === 404, `código ${naoExiste.codigo}`);
  const filtroRuim = await chamar('GET', '/api/ordens?status=xyz');
  checar('filtro inválido responde 400', filtroRuim.codigo === 400, `código ${filtroRuim.codigo}`);

  // 12. Página inicial é servida, e não há campo de faturamento na tela
  const pagina = await fetch(`${BASE}/`);
  const html = await pagina.text();
  checar('página inicial responde 200', pagina.status === 200);
  checar('tela não mostra faturamento', !/faturamento|faturado/i.test(html));

  saidaOk = true;
} catch (err) {
  falhas++;
  console.log(`  ERRO   ${err.message}`);
} finally {
  servidor.kill();
  await new Promise((r) => (servidor.exitCode !== null ? r() : servidor.once('exit', r)));
  try {
    await rm(BANCO, { force: true });
  } catch (err) {
    console.log(`  aviso: não consegui apagar o banco temporário (${err.code}). Pode apagar à mão: ${BANCO}`);
  }
}

console.log(`\nResultado: ${total - falhas} de ${total} verificações OK${falhas ? ` — ${falhas} falha(s)` : ''}.`);
process.exitCode = falhas || !saidaOk ? 1 : 0;
