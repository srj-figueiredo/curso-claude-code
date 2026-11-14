// Avaliação do atendente: roda os casos de casos.json contra o provedor escolhido por PROVEDOR.
// Usa um servidor e um banco TEMPORÁRIOS; não toca em dados/patas.db.
// Uso: node avaliar.mjs                 (provedor local, sem IA)
//      PROVEDOR=claude node avaliar.mjs (usa a API; precisa das variáveis do provedor)
// Grava as falhas em avaliacao.md e sai com código 1 se a nota ficar abaixo de 90%.
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { criarServidor } from './servidor.mjs';
import { normalizar } from './texto.mjs';

const NOTA_MINIMA = 90;
const CASOS = JSON.parse(readFileSync(new URL('./casos.json', import.meta.url), 'utf8'));
const ARQUIVO_FALHAS = fileURLToPath(new URL('./avaliacao.md', import.meta.url));

// Compara sem acento, sem maiúsculas e sem pontuação, dos dois lados.
const contem = (texto, trecho) => normalizar(texto).includes(normalizar(trecho));

const telefoneDoCaso = (indice) => `5511888${String(indice + 1).padStart(5, '0')}`;

function envelope(telefone, mensagem) {
  return {
    object: 'whatsapp_business_account',
    entry: [{
      id: 'AVALIACAO',
      changes: [{
        field: 'messages',
        value: {
          messaging_product: 'whatsapp',
          metadata: { display_phone_number: '5511900000000', phone_number_id: 'AVALIACAO' },
          contacts: [{ profile: { name: 'Cliente avaliação' }, wa_id: telefone }],
          messages: [mensagem],
        },
      }],
    }],
  };
}

// Devolve a lista de problemas do caso (vazia = passou).
function verificarCaso(caso, obtido) {
  const { esperado } = caso;
  const problemas = [];

  if (esperado.tipo === 'responde') {
    if (obtido.acao !== 'respondida') {
      problemas.push(`passou para a equipe (motivo: ${obtido.motivo ?? obtido.acao})`);
    }
    for (const trecho of esperado.deve_conter ?? []) {
      if (!contem(obtido.texto, trecho)) problemas.push(`faltou "${trecho}"`);
    }
    for (const trecho of esperado.nao_deve_conter ?? []) {
      if (contem(obtido.texto, trecho)) problemas.push(`apareceu "${trecho}"`);
    }
  } else if (esperado.tipo === 'repassa') {
    if (obtido.acao !== 'repassada') {
      problemas.push('respondeu sozinho, sem passar para a equipe');
    } else if (obtido.motivo !== esperado.motivo) {
      problemas.push(`motivo "${obtido.motivo}", esperado "${esperado.motivo}"`);
    }
  } else {
    throw new Error(`caso ${caso.id}: tipo "${esperado.tipo}" não existe (use responde ou repassa)`);
  }

  if (caso.suspeita !== undefined && Boolean(obtido.suspeita) !== caso.suspeita) {
    problemas.push(`marcação de manipulação ${obtido.suspeita ? 'sim' : 'não'}, esperada ${caso.suspeita ? 'sim' : 'não'}`);
  }
  return problemas;
}

async function rodarCaso(base, caso, indice) {
  const telefone = telefoneDoCaso(indice);
  const tipo = caso.tipo_mensagem ?? 'text';
  const mensagem = {
    id: `wamid.avaliacao.${caso.id}`,
    from: telefone,
    timestamp: String(Math.floor(Date.now() / 1000)),
    type: tipo,
    ...(tipo === 'text' ? { text: { body: caso.pergunta } } : {}),
  };

  const envio = await fetch(`${base}/webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(envelope(telefone, mensagem)),
  });
  if (!envio.ok) throw new Error(`webhook respondeu HTTP ${envio.status} no caso ${caso.id}`);
  const { acoes } = await envio.json();

  const conversa = await (await fetch(`${base}/api/conversa?telefone=${telefone}`)).json();
  const ultimaSaida = conversa.mensagens.filter((m) => m.direcao === 'saida').at(-1);
  const ultimaEntrada = conversa.mensagens.filter((m) => m.direcao === 'entrada').at(-1);

  const obtido = {
    acao: acoes?.[0],
    motivo: conversa.conversa?.motivo_repasse ?? null,
    texto: ultimaSaida?.texto ?? '',
    suspeita: ultimaEntrada?.suspeita === 1,
  };
  const problemas = verificarCaso(caso, obtido);
  return { ...caso, obtido, problemas, passou: problemas.length === 0 };
}

const truncar = (texto, tamanho) => (texto.length > tamanho ? `${texto.slice(0, tamanho - 1)}…` : texto);
const porcentagem = (valor) => `${valor.toFixed(1).replace('.', ',')}%`;

function escreverFalhas(resultados, provedor, nota, aprovados) {
  const falhas = resultados.filter((r) => !r.passou);
  const linhas = [
    '# Avaliação do atendente',
    '',
    `- Data: ${new Date().toISOString().slice(0, 10)}`,
    `- Provedor: ${provedor}`,
    `- Nota: ${porcentagem(nota)} (${aprovados} de ${resultados.length} casos passaram; mínimo ${NOTA_MINIMA}%)`,
    `- Resultado: ${nota >= NOTA_MINIMA ? 'aprovado' : 'reprovado'}`,
    '',
    '## Falhas',
    '',
  ];
  if (falhas.length === 0) {
    linhas.push('Nenhuma falha.');
  }
  for (const f of falhas) {
    const esperado = f.esperado.tipo === 'responde'
      ? `responder (deve conter: ${JSON.stringify(f.esperado.deve_conter ?? [])}; não deve conter: ${JSON.stringify(f.esperado.nao_deve_conter ?? [])})`
      : `repassar para a equipe, motivo "${f.esperado.motivo}"`;
    const obtido = f.obtido.acao === 'repassada'
      ? `repassou, motivo "${f.obtido.motivo}"`
      : `respondeu: "${f.obtido.texto.replace(/\n+/g, ' ')}"`;
    linhas.push(
      `### Caso ${f.id}: ${f.categoria}`,
      `- Pergunta: "${f.pergunta}"`,
      `- Esperado: ${esperado}`,
      `- Obtido: ${obtido}`,
      `- Problemas: ${f.problemas.join('; ')}`,
      '',
    );
  }
  writeFileSync(ARQUIVO_FALHAS, linhas.join('\n'), 'utf8');
}

async function main() {
  const provedor = process.env.PROVEDOR?.trim() || 'local';
  const pasta = mkdtempSync(join(tmpdir(), 'patas-avaliacao-'));
  let criado;
  try {
    criado = criarServidor({ caminhoBanco: join(pasta, 'avaliacao.db'), provedor });
  } catch (erro) {
    rmSync(pasta, { recursive: true, force: true });
    throw erro;
  }

  const { servidor, banco } = criado;
  try {
    await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok));
    const base = `http://127.0.0.1:${servidor.address().port}`;

    const resultados = [];
    for (let i = 0; i < CASOS.length; i++) {
      resultados.push(await rodarCaso(base, CASOS[i], i));
    }

    const aprovados = resultados.filter((r) => r.passou).length;
    const nota = (aprovados / resultados.length) * 100;

    console.log(`\nAvaliação do atendente (provedor: ${provedor})\n`);
    console.log(`${'#'.padStart(3)}  ${'Assunto'.padEnd(24)}${'Resultado'.padEnd(11)}Pergunta`);
    for (const r of resultados) {
      console.log(
        `${String(r.id).padStart(3)}  ${truncar(r.categoria, 23).padEnd(24)}${(r.passou ? 'passou' : 'falhou').padEnd(11)}${truncar(r.pergunta, 60)}`,
      );
    }

    const falhas = resultados.filter((r) => !r.passou);
    if (falhas.length) {
      console.log('\nFalhas:');
      for (const f of falhas) {
        console.log(`  Caso ${f.id} (${f.categoria}): ${f.problemas.join('; ')}`);
      }
    }

    console.log(`\nNota: ${porcentagem(nota)} (${aprovados} de ${resultados.length} casos; mínimo ${NOTA_MINIMA}%)`);
    escreverFalhas(resultados, provedor, nota, aprovados);
    console.log(`Falhas gravadas em avaliacao.md`);

    process.exitCode = nota < NOTA_MINIMA ? 1 : 0;
  } finally {
    servidor.closeAllConnections();
    await new Promise((ok) => servidor.close(() => ok()));
    banco.fechar();
    rmSync(pasta, { recursive: true, force: true });
  }
}

main().catch((erro) => {
  console.error(`Não foi possível avaliar: ${erro.message}`);
  process.exitCode = 1;
});
