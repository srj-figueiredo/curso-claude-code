import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adicionar, concluir, remover, abertas, formatar } from '../src/pendencias.js';

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
