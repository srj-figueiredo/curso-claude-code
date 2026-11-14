// Relatório da Rita: lê o banco de dados/patas.db (só leitura) e imprime os números do atendimento.
// Uso: node relatorio.mjs
// Custo: defina PRECO_ENTRADA e PRECO_SAIDA (por milhão de tokens, na moeda que você usa).
//        Não há preço padrão no código: sem essas variáveis, o custo não é estimado.
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { secao, titulosDeSecoes } from './conhecimento.mjs';
import { TEXTOS } from './textos.mjs';

const CAMINHO = fileURLToPath(new URL('./dados/patas.db', import.meta.url));

const porcentagem = (parte, todo) => (todo === 0 ? '0,0%' : `${((parte / todo) * 100).toFixed(1).replace('.', ',')}%`);

// Lê PRECO_ENTRADA ou PRECO_SAIDA. Devolve null se não estiver definido ou for inválido.
function lerPreco(nome) {
  const bruto = process.env[nome]?.trim();
  if (!bruto) return null;
  const valor = Number(bruto.replace(',', '.'));
  if (!Number.isFinite(valor) || valor < 0) {
    console.log(`  Aviso: ${nome}="${bruto}" não é um número válido; ignorado.`);
    return null;
  }
  return valor;
}

function main() {
  if (!existsSync(CAMINHO)) {
    console.log(`Ainda não há conversas: o banco ${CAMINHO} não existe.`);
    return;
  }

  const db = new DatabaseSync(CAMINHO, { readOnly: true });
  try {
    const todos = (sql, ...params) => db.prepare(sql).all(...params);
    const um = (sql, ...params) => db.prepare(sql).get(...params);

    const total = um('SELECT COUNT(*) AS n FROM conversas').n;
    if (total === 0) {
      console.log('Ainda não há conversas no banco.');
      return;
    }

    const resolvidas = um("SELECT COUNT(*) AS n FROM conversas WHERE status = 'bot'").n;
    const repasses = todos(`
      SELECT COALESCE(motivo_repasse, 'sem motivo') AS motivo, COUNT(*) AS n
      FROM conversas WHERE status = 'com_pessoa'
      GROUP BY motivo ORDER BY n DESC
    `);
    const comPessoa = repasses.reduce((soma, r) => soma + r.n, 0);

    console.log('Patas Felizes: relatório do atendimento\n');
    console.log(`Conversas: ${total}`);
    console.log(`Resolvidas pelo atendente, sem pessoa: ${resolvidas} (${porcentagem(resolvidas, total)})`);
    console.log(`Passaram para uma pessoa: ${comPessoa} (${porcentagem(comPessoa, total)})`);

    console.log('\nRepasses por motivo:');
    if (repasses.length === 0) console.log('  nenhum');
    for (const r of repasses) console.log(`  ${r.motivo}: ${r.n}`);

    // Assunto: a resposta do atendente é o texto exato de uma seção da base de conhecimento.
    const assuntoDaResposta = new Map(titulosDeSecoes().map((titulo) => [secao(titulo), titulo]));
    const contagemDeAssuntos = new Map();
    for (const { texto } of todos("SELECT texto FROM mensagens WHERE direcao = 'saida' AND texto IS NOT NULL")) {
      const assunto = assuntoDaResposta.get(texto.trim());
      if (assunto) contagemDeAssuntos.set(assunto, (contagemDeAssuntos.get(assunto) ?? 0) + 1);
    }
    console.log('\nAssuntos mais perguntados (respondidos pela base):');
    const topo = [...contagemDeAssuntos].sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (topo.length === 0) console.log('  nenhum (o provedor atual não responde pela base de conhecimento)');
    for (const [assunto, n] of topo) console.log(`  ${assunto}: ${n}`);

    // Mensagens suspeitas: só a contagem e a data, sem o texto nem o telefone inteiro.
    const suspeitas = todos(`
      SELECT m.criado_em, c.telefone
      FROM mensagens m JOIN conversas c ON c.id = m.conversa_id
      WHERE m.suspeita = 1 ORDER BY m.id
    `);
    console.log(`\nMensagens suspeitas (tentativa de manipular o atendente): ${suspeitas.length}`);
    for (const s of suspeitas.slice(-10)) {
      console.log(`  ${s.criado_em}  final ${String(s.telefone).slice(-4)}`);
    }

    // Ignoradas pelo limite: a estimativa usa o banco, que não guarda o motivo do silêncio.
    // Conta mensagens do cliente que não tiveram resposta depois do aviso de limite, em conversas
    // que seguem com o atendente (sem repasse e sem "parar").
    const linhas = todos(`
      SELECT m.conversa_id, m.id, m.direcao, m.texto, c.status, cl.parou
      FROM mensagens m
      JOIN conversas c ON c.id = m.conversa_id
      JOIN clientes cl ON cl.telefone = c.telefone
      ORDER BY m.conversa_id, m.id
    `);
    const porConversa = new Map();
    for (const linha of linhas) {
      if (!porConversa.has(linha.conversa_id)) porConversa.set(linha.conversa_id, []);
      porConversa.get(linha.conversa_id).push(linha);
    }
    let avisos = 0;
    let ignoradas = 0;
    for (const grupo of porConversa.values()) {
      const avisoEm = grupo.findIndex((m) => m.direcao === 'saida' && m.texto === TEXTOS.limite);
      avisos += grupo.filter((m) => m.direcao === 'saida' && m.texto === TEXTOS.limite).length;
      if (avisoEm < 0 || grupo[0].status !== 'bot' || grupo[0].parou) continue;
      grupo.forEach((m, i) => {
        if (i <= avisoEm || m.direcao !== 'entrada') return;
        const proxima = grupo[i + 1];
        if (!proxima || proxima.direcao === 'entrada') ignoradas++;
      });
    }
    console.log(`\nAvisos de limite enviados: ${avisos}`);
    console.log(`Mensagens ignoradas pelo limite (estimativa): ${ignoradas}`);

    // Tokens: só existem nas respostas da IA (provedor claude).
    const tokens = um(`
      SELECT COUNT(*) AS n, SUM(tokens_entrada) AS entrada, SUM(tokens_saida) AS saida
      FROM mensagens WHERE tokens_entrada IS NOT NULL OR tokens_saida IS NOT NULL
    `);
    if (tokens.n > 0) {
      const entrada = tokens.entrada ?? 0;
      const saida = tokens.saida ?? 0;
      console.log('\nTokens gravados (respostas da IA):');
      console.log(`  Entrada: ${entrada.toLocaleString('pt-BR')}`);
      console.log(`  Saída: ${saida.toLocaleString('pt-BR')}`);

      const precoEntrada = lerPreco('PRECO_ENTRADA');
      const precoSaida = lerPreco('PRECO_SAIDA');
      if (precoEntrada !== null && precoSaida !== null) {
        const custo = (entrada / 1_000_000) * precoEntrada + (saida / 1_000_000) * precoSaida;
        console.log(`  Custo estimado: ${custo.toFixed(4).replace('.', ',')} (na moeda dos preços informados)`);
      } else {
        console.log('  Custo: defina PRECO_ENTRADA e PRECO_SAIDA (por milhão de tokens) para estimar.');
      }
    }
  } finally {
    db.close();
  }
}

main();
