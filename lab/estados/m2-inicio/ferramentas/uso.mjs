// Lê da entrada padrão o JSON de `claude -p ... --output-format json` e mostra os campos de cache do turno.
// Uso: claude -p "Responda apenas: ok" --continue --output-format json | node ferramentas/uso.mjs
let texto = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (pedaco) => (texto += pedaco));
process.stdin.on('end', () => {
  let saida;
  try {
    saida = JSON.parse(texto.replace(/^﻿/, ''));
  } catch {
    console.error('A entrada não é o JSON do claude -p. Confira se usou --output-format json.');
    process.exit(1);
  }
  if (saida.is_error) {
    console.error(`A chamada falhou e não gastou tokens: ${saida.result}`);
    process.exit(1);
  }
  const uso = saida.usage ?? {};
  const n = (v) => Number(v ?? 0).toLocaleString('pt-BR');
  console.log(`escrito no cache: ${n(uso.cache_creation_input_tokens)}`);
  console.log(`lido do cache:    ${n(uso.cache_read_input_tokens)}`);
  console.log(`entrada sem cache: ${n(uso.input_tokens)} | saída: ${n(uso.output_tokens)}`);
  console.log(`modelos da sessão: ${Object.keys(saida.modelUsage ?? {}).join(', ') || 'nenhum'}`);
  console.log(`custo acumulado (preço de tabela): US$ ${Number(saida.total_cost_usd ?? 0).toFixed(4)}`);
});
