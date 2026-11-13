// Compara commands.json com a página oficial de comandos e aponta diferenças.
// Uso: node scripts/reconciliar-comandos.mjs [--cache]
//   sem flag: busca https://code.claude.com/docs/en/commands.md ao vivo
//   --cache : usa .docs-cache/en/commands.md
// Sai com código 1 quando há comando novo na página oficial ou carta que sumiu de lá.
import { readFileSync } from 'node:fs';

const URL_OFICIAL = 'https://code.claude.com/docs/en/commands.md';
const texto = process.argv.includes('--cache')
  ? readFileSync('.docs-cache/en/commands.md', 'utf8')
  : await (await fetch(URL_OFICIAL, { headers: { 'user-agent': 'docs-reader' } })).text();

// Cada linha da tabela começa com | `/nome ...`; uma linha pode trazer mais de um nome.
const oficiais = new Set();
for (const linha of texto.split('\n').filter((l) => l.startsWith('| `/'))) {
  const primeira = linha.split('|')[1];
  for (const m of primeira.matchAll(/`\/([a-z][a-z0-9-]*)/g)) oficiais.add(m[1]);
}

const cartas = JSON.parse(readFileSync('src/content/comandos/commands.json', 'utf8'));
const conhecidos = new Set(cartas.flatMap((c) => [c.id, ...c.aliases.map((a) => a.replace(/^\//, ''))]));
const novos = [...oficiais].filter((n) => !conhecidos.has(n));
const sumidos = cartas.filter((c) => !oficiais.has(c.id)).map((c) => c.id);

console.log(`Página oficial: ${oficiais.size} nomes · curso: ${cartas.length} cartas`);
console.log(novos.length ? `NOVOS na página oficial (falta carta): ${novos.map((n) => '/' + n).join(' ')}` : 'Nenhum comando novo.');
console.log(sumidos.length ? `SUMIRAM da página oficial (viram carta "removido"?): ${sumidos.map((n) => '/' + n).join(' ')}` : 'Nenhuma carta órfã.');
process.exitCode = novos.length || sumidos.length ? 1 : 0;
