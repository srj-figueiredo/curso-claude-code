import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adicionar, concluir, remover, abertas, formatar, extrairPrioridade } from '../src/pendencias.js';

test('adicionar cria id sequencial e não altera a lista original', () => {
  const vazia = [];
  const uma = adicionar(vazia, 'comprar café');
  const duas = adicionar(uma, 'pagar boleto');
  assert.equal(vazia.length, 0);
  assert.deepEqual(duas.map((i) => i.id), [1, 2]);
  assert.equal(duas[1].feita, false);
});

test('adicionar recusa texto vazio', () => {
  assert.throws(() => adicionar([], '   '), /precisa de um texto/);
});

test('concluir marca só a pendência pedida', () => {
  const lista = adicionar(adicionar([], 'a'), 'b');
  const depois = concluir(lista, 2);
  assert.deepEqual(depois.map((i) => i.feita), [false, true]);
  assert.equal(abertas(depois).length, 1);
});

test('concluir e remover reclamam de id inexistente', () => {
  assert.throws(() => concluir([], 9), /Não existe pendência 9/);
  assert.throws(() => remover([], 9), /Não existe pendência 9/);
});

test('formatar mostra caixas marcadas e lista vazia', () => {
  assert.equal(formatar([]), 'Nada pendente. Aproveite.');
  const lista = concluir(adicionar([], 'a'), 1);
  assert.equal(formatar(lista), '[x] 1. a');
});

test('adicionar usa prioridade normal por padrão e grava a prioridade alta', () => {
  const normal = adicionar([], 'a');
  const alta = adicionar([], 'b', 'alta');
  assert.equal(normal[0].prioridade, 'normal');
  assert.equal(alta[0].prioridade, 'alta');
});

test('adicionar recusa prioridade inválida', () => {
  assert.throws(() => adicionar([], 'a', 'urgente'), /Prioridade inválida: urgente/);
});

test('formatar põe ! só nas pendências de prioridade alta', () => {
  let lista = adicionar([], 'normal');
  lista = adicionar(lista, 'importante', 'alta');
  lista = [...lista, { id: 3, texto: 'antiga', feita: false }];
  assert.equal(formatar(lista), '[ ] 1. normal\n! [ ] 2. importante\n[ ] 3. antiga');
  assert.equal(formatar(concluir(lista, 2)), '[ ] 1. normal\n! [x] 2. importante\n[ ] 3. antiga');
});

test('extrairPrioridade lê a flag em qualquer posição', () => {
  assert.deepEqual(extrairPrioridade(['comprar', 'café']), { prioridade: 'normal', resto: ['comprar', 'café'] });
  assert.deepEqual(extrairPrioridade(['--prioridade', 'alta', 'pagar', 'boleto']), { prioridade: 'alta', resto: ['pagar', 'boleto'] });
  assert.deepEqual(extrairPrioridade(['pagar', 'boleto', '--prioridade', 'alta']), { prioridade: 'alta', resto: ['pagar', 'boleto'] });
  assert.deepEqual(extrairPrioridade(['a', '--prioridade', 'normal', 'b']), { prioridade: 'normal', resto: ['a', 'b'] });
});

test('extrairPrioridade recusa a flag sem valor', () => {
  assert.throws(() => extrairPrioridade(['a', '--prioridade']), /precisa de um valor/);
  assert.throws(() => extrairPrioridade(['--prioridade', '--outra']), /precisa de um valor/);
});
