#!/usr/bin/env node
// Uso: node src/cli.js <comando> [argumento]
//   add "texto"   adiciona uma pendência
//   list          mostra todas
//   done <id>     marca como feita
//   rm <id>       remove
import { adicionar, concluir, remover, formatar } from './pendencias.js';
import { carregar, salvar } from './armazenamento.js';

const [comando, ...resto] = process.argv.slice(2);

try {
  const lista = await carregar();
  if (comando === 'add') {
    const nova = adicionar(lista, resto.join(' '));
    await salvar(nova);
    console.log(`Anotado: ${nova.at(-1).id}. ${nova.at(-1).texto}`);
  } else if (comando === 'done') {
    await salvar(concluir(lista, Number(resto[0])));
    console.log(`Feita: ${resto[0]}.`);
  } else if (comando === 'rm') {
    await salvar(remover(lista, Number(resto[0])));
    console.log(`Removida: ${resto[0]}.`);
  } else if (comando === 'list' || comando === undefined) {
    console.log(formatar(lista));
  } else {
    console.error(`Comando desconhecido: ${comando}. Use add, list, done ou rm.`);
    process.exitCode = 1;
  }
} catch (erro) {
  console.error(erro.message);
  process.exitCode = 1;
}
