// Cria um backup do banco em backups/oficina-AAAA-MM-DD-HHMM.db (VACUUM INTO do próprio SQLite)
// e mantém só os 7 mais recentes. Uso: node backup.mjs   (BANCO e BACKUPS são opcionais)
import { existsSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { caminhoBanco, pastaBackups, carimbo, verificarBancoSqlite, podarBackups, QUANTOS_BACKUPS } from './copias.mjs';

const banco = caminhoBanco();
const pasta = pastaBackups();

if (!existsSync(banco)) {
  console.log(`Banco não encontrado: ${banco}`);
  process.exitCode = 1;
} else {
  await mkdir(pasta, { recursive: true });
  const destino = join(pasta, `oficina-${carimbo()}.db`);

  if (existsSync(destino)) {
    console.log(`Já existe um backup deste minuto: ${destino}. Tente de novo daqui a um minuto.`);
    process.exitCode = 1;
  } else {
    let db;
    try {
      db = new DatabaseSync(banco);
      db.prepare('VACUUM INTO ?').run(destino);
    } catch (err) {
      console.log(`Não consegui fazer o backup: ${err.message}`);
      process.exitCode = 1;
    } finally {
      db?.close();
    }

    if (process.exitCode !== 1) {
      const conferido = await verificarBancoSqlite(destino);
      if (!conferido.ok) {
        await rm(destino, { force: true });
        console.log(`O backup saiu inválido e foi apagado: ${conferido.motivo}`);
        process.exitCode = 1;
      } else {
        const apagados = await podarBackups(pasta, QUANTOS_BACKUPS);
        console.log(`Backup criado: ${destino}`);
        if (apagados.length) console.log(`Backups antigos apagados: ${apagados.join(', ')}`);
        console.log(`Mantendo os ${QUANTOS_BACKUPS} mais recentes.`);
      }
    }
  }
}
