// Junta src/content/comandos/partes/r*.json em commands.json (ordem alfabética) e valida contra a distribuição.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PASTA = 'src/content/comandos';
const plano = JSON.parse(readFileSync('docs/comandos-por-secao.json', 'utf8'));
const todos = readdirSync(join(PASTA, 'partes'))
  .filter((f) => f.endsWith('.json'))
  .flatMap((f) => JSON.parse(readFileSync(join(PASTA, 'partes', f), 'utf8')));

let erro = false;
for (const [secao, nomes] of Object.entries(plano).filter(([k]) => /^R\d$/.test(k))) {
  const feitos = todos.filter((c) => c.categoria === secao).map((c) => c.id);
  if (feitos.length === 0) continue; // seção ainda não escrita
  const faltam = nomes.filter((n) => !feitos.includes(n));
  const sobram = feitos.filter((n) => !nomes.includes(n));
  if (faltam.length || sobram.length) {
    erro = true;
    console.error(`${secao}: faltam [${faltam}] sobram [${sobram}]`);
  }
}
const ids = todos.map((c) => c.id);
const repetidos = ids.filter((id, i) => ids.indexOf(id) !== i);
if (repetidos.length) {
  erro = true;
  console.error(`ids repetidos: ${repetidos}`);
}
todos.sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(join(PASTA, 'commands.json'), JSON.stringify(todos, null, 2) + '\n');
console.log(`commands.json: ${todos.length} comandos`);
process.exitCode = erro ? 1 : 0;
