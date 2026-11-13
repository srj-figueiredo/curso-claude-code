// Verificador de "cobertura por nome": toda função exportada de src/pendencias.js precisa ser citada em test/.
// Uso: node ferramentas/cobertura.mjs   (código de saída 0 = tudo coberto, 1 = falta teste)
import { readFileSync, readdirSync } from 'node:fs';

const fonte = readFileSync('src/pendencias.js', 'utf8');
const exportadas = [...fonte.matchAll(/export function (\w+)/g)].map((m) => m[1]);
const testes = readdirSync('test')
  .filter((f) => f.endsWith('.js'))
  .map((f) => readFileSync(`test/${f}`, 'utf8'))
  .join('\n');

const citada = (nome) => testes.split(/\W+/).includes(nome);
const semTeste = exportadas.filter((nome) => !citada(nome));
for (const nome of exportadas) console.log(`${semTeste.includes(nome) ? 'SEM TESTE' : 'ok       '}  ${nome}`);
if (semTeste.length) {
  console.log(`\n${semTeste.length} função(ões) sem teste: ${semTeste.join(', ')}`);
  process.exit(1);
}
console.log('\nTodas as funções exportadas têm teste.');
