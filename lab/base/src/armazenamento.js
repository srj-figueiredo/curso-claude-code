// Guarda a lista num arquivo JSON. O caminho pode ser trocado por variável de ambiente.
import { readFile, writeFile } from 'node:fs/promises';

export const ARQUIVO = process.env.PENDENCIAS_ARQUIVO ?? 'pendencias.json';

export async function carregar(arquivo = ARQUIVO) {
  try {
    return JSON.parse(await readFile(arquivo, 'utf8'));
  } catch (erro) {
    if (erro.code === 'ENOENT') return [];
    throw erro;
  }
}

export async function salvar(lista, arquivo = ARQUIVO) {
  await writeFile(arquivo, JSON.stringify(lista, null, 2) + '\n', 'utf8');
}
