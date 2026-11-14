// Lê conhecimento.md e separa por seção (cada "## Título"). É a única fonte dos fatos do atendente.
import { readFileSync } from 'node:fs';

const TEXTO = readFileSync(new URL('./conhecimento.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

const SECOES = new Map();
for (const bloco of TEXTO.split(/^## /m).slice(1)) {
  const quebra = bloco.indexOf('\n');
  SECOES.set(bloco.slice(0, quebra).trim(), bloco.slice(quebra + 1).trim());
}

export function secao(titulo) {
  if (!SECOES.has(titulo)) {
    throw new Error(`Seção "${titulo}" não existe em conhecimento.md`);
  }
  return SECOES.get(titulo);
}

export function titulosDeSecoes() {
  return [...SECOES.keys()];
}
