// Regras da lista de pendências. Funções puras: recebem a lista, devolvem uma lista nova.

export function adicionar(lista, texto) {
  const limpo = String(texto ?? '').trim();
  if (!limpo) throw new Error('A pendência precisa de um texto.');
  const id = lista.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;
  return [...lista, { id, texto: limpo, feita: false }];
}

export function concluir(lista, id) {
  if (!lista.some((item) => item.id === id)) throw new Error(`Não existe pendência ${id}.`);
  return lista.map((item) => (item.id === id ? { ...item, feita: true } : item));
}

export function remover(lista, id) {
  if (!lista.some((item) => item.id === id)) throw new Error(`Não existe pendência ${id}.`);
  return lista.filter((item) => item.id !== id);
}

export function abertas(lista) {
  return lista.filter((item) => !item.feita);
}

export function formatar(lista) {
  if (lista.length === 0) return 'Nada pendente. Aproveite.';
  return lista.map((item) => `${item.feita ? '[x]' : '[ ]'} ${item.id}. ${item.texto}`).join('\n');
}
