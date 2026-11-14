// Lê conhecimento.md e separa por seção (cada "## Título"). É a única fonte dos fatos do atendente.
import { readFileSync } from 'node:fs';

const TEXTO = readFileSync(new URL('./conhecimento.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

const SECOES = new Map();
for (const bloco of TEXTO.split(/^## /m).slice(1)) {
  const quebra = bloco.indexOf('\n');
  SECOES.set(bloco.slice(0, quebra).trim(), bloco.slice(quebra + 1).trim());
}

// Texto inteiro (o provedor da IA usa no system prompt).
export const CONHECIMENTO_COMPLETO = TEXTO;

export function secao(titulo) {
  if (!SECOES.has(titulo)) {
    throw new Error(`Seção "${titulo}" não existe em conhecimento.md`);
  }
  return SECOES.get(titulo);
}

export function titulosDeSecoes() {
  return [...SECOES.keys()];
}

// Valor em R$ como número: "R$ 1.200,00" -> 1200. Não aceita texto sem R$.
export const PADRAO_VALOR = /R\$\s?\d{1,3}(\.\d{3})*(,\d{2})?/g;
export function numeroDoValor(trecho) {
  return Number(trecho.replace(/^R\$\s?/, '').replace(/\./g, '').replace(',', '.'));
}

// Todo valor em R$ que aparece em conhecimento.md, como número.
export const VALORES_CONHECIDOS = new Set(
  [...TEXTO.matchAll(PADRAO_VALOR)].map((m) => numeroDoValor(m[0])),
);
