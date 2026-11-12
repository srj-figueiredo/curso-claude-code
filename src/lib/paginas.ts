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
