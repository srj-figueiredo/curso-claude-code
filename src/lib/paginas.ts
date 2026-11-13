import { getCollection, type CollectionEntry } from 'astro:content';

export type Pagina = CollectionEntry<'modulos'> | CollectionEntry<'menu'> | CollectionEntry<'cases'>;

let cache: Map<string, Pagina> | undefined;

/** Todas as páginas de estação já escritas (módulos, seções do menu e cases), por id. */
export async function paginasEscritas(): Promise<Map<string, Pagina>> {
  if (cache) return cache;
  const grupos = await Promise.all([getCollection('modulos'), getCollection('menu'), getCollection('cases')]);
  cache = new Map(grupos.flat().map((p) => [p.data.id, p as Pagina]));
  return cache;
}

let cacheApendices: Set<string> | undefined;

/** Ids dos apêndices já escritos. */
export async function apendicesEscritos(): Promise<Set<string>> {
  if (cacheApendices) return cacheApendices;
  const itens = await getCollection('apendices');
  cacheApendices = new Set(itens.map((a) => a.data.id));
  return cacheApendices;
}

/** Id da página para qual um link relativo de conteúdo aponta (`../m7/` ou `../m7/#x`), ou undefined. */
export function idDoLink(href: string): string | undefined {
  return /^\.\.\/([a-z0-9]+)\/(?:#.*)?$/.exec(href)?.[1];
}
