const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefixa um caminho interno com a base do site (troca de hospedagem sem reescrever links). */
export const u = (caminho: string) => `${base}${caminho.startsWith('/') ? caminho : `/${caminho}`}`;

/** Caminho da página de uma estação ou apêndice. */
export const pagina = (id: string) => u(`/${id}/`);
