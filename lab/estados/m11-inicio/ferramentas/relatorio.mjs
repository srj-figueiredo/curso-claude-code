// Mostra quantas pendências já foram concluídas.
// Uso: node ferramentas/relatorio.mjs
import { carregar } from '../src/armazenamento.js';
import { abertas } from '../src/pendencias.js';

const lista = await carregar();
const feitas = lista.length - abertas(lista).length;
const pct = Math.round((feitas / lista.length) * 100);
console.log(`${pct}% concluídas (${feitas} de ${lista.length})`);
