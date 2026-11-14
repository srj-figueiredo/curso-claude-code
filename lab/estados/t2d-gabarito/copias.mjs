// Funções compartilhadas por backup.mjs e restaurar.mjs (node:fs e node:sqlite, sem pacotes).
// BANCO e BACKUPS são opcionais: o padrão é dados/oficina.db e backups/ na pasta do sistema.
import { open, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const RAIZ = fileURLToPath(new URL('.', import.meta.url));
const CABECALHO_SQLITE = 'SQLite format 3\0';
export const QUANTOS_BACKUPS = 7;

export function caminhoBanco() {
  return resolve(process.env.BANCO || join(RAIZ, 'dados', 'oficina.db'));
}

export function pastaBackups() {
  return resolve(process.env.BACKUPS || join(RAIZ, 'backups'));
}

// Carimbo no horário do computador da oficina: AAAA-MM-DD-HHMM
export function carimbo(agora = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${agora.getFullYear()}-${p(agora.getMonth() + 1)}-${p(agora.getDate())}-${p(agora.getHours())}${p(agora.getMinutes())}`;
}

// Diz se o arquivo é um banco SQLite com a tabela de ordens. Devolve { ok, motivo }.
// Não cria nada: abre só para leitura e só depois de conferir o cabeçalho.
export async function verificarBancoSqlite(caminho) {
  let arquivo;
  try {
    arquivo = await open(caminho, 'r');
    const inicio = Buffer.alloc(CABECALHO_SQLITE.length);
    const { bytesRead } = await arquivo.read(inicio, 0, inicio.length, 0);
    if (bytesRead < inicio.length || inicio.toString('latin1') !== CABECALHO_SQLITE) {
      return { ok: false, motivo: 'o arquivo não começa com o cabeçalho de um banco SQLite' };
    }
  } catch (err) {
    return { ok: false, motivo: `não consegui ler o arquivo (${err.code || err.message})` };
  } finally {
    await arquivo?.close();
  }

  let db;
  try {
    db = new DatabaseSync(caminho, { readOnly: true });
    const [{ quick_check: integridade }] = db.prepare('PRAGMA quick_check').all();
    if (integridade !== 'ok') return { ok: false, motivo: `banco com defeito (${integridade})` };
    const tabela = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'ordens'").get();
    if (!tabela) return { ok: false, motivo: 'é um banco SQLite, mas não tem a tabela de ordens' };
    return { ok: true };
  } catch (err) {
    return { ok: false, motivo: `não é um banco SQLite válido (${err.message})` };
  } finally {
    db?.close();
  }
}

// Apaga os backups automáticos mais antigos, deixando só os `manter` mais recentes.
// Mexe só em nomes oficina-AAAA-MM-DD-HHMM.db; as cópias de antes da restauração ficam.
export async function podarBackups(pasta, manter = QUANTOS_BACKUPS) {
  const padrao = /^oficina-\d{4}-\d{2}-\d{2}-\d{4}\.db$/;
  const nomes = (await readdir(pasta)).filter((n) => padrao.test(n)).sort();
  const apagar = nomes.slice(0, Math.max(0, nomes.length - manter));
  for (const nome of apagar) await rm(join(pasta, nome));
  return apagar;
}
