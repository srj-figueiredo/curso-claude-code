// Regras da lista de pendências. Funções puras: recebem a lista, devolvem uma lista nova.

export const PRIORIDADES = ['normal', 'alta'];

export function adicionar(lista, texto, prioridade = 'normal') {
  const limpo = String(texto ?? '').trim();
  if (!limpo) throw new Error('A pendência precisa de um texto.');
  if (!PRIORIDADES.includes(prioridade)) {
    throw new Error(`Prioridade inválida: ${prioridade}. Use alta ou normal.`);
  }
  const id = lista.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;
  return [...lista, { id, texto: limpo, feita: false, prioridade }];
}

// Separa --prioridade <valor> do resto dos argumentos, em qualquer posição.
export function extrairPrioridade(args) {
  const i = args.indexOf('--prioridade');
  if (i === -1) return { prioridade: 'normal', resto: [...args] };
  const valor = args[i + 1];
  if (valor === undefined || valor.startsWith('--')) {
    throw new Error('--prioridade precisa de um valor: alta ou normal.');
  }
  const resto = [...args.slice(0, i), ...args.slice(i + 2)];
  return { prioridade: valor, resto };
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
  return lista
    .map((item) => `${item.prioridade === 'alta' ? '! ' : ''}${item.feita ? '[x]' : '[ ]'} ${item.id}. ${item.texto}`)
    .join('\n');
}
