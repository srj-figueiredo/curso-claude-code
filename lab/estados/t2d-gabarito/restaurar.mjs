// Restaura um backup no banco. Uso: node restaurar.mjs backups/oficina-AAAA-MM-DD-HHMM.db
// Antes de trocar, guarda o banco atual em backups/antes-da-restauracao-AAAA-MM-DD-HHMM.db.
// Recusa arquivo que não seja um banco SQLite válido, sem tocar em nada.
// Feche o servidor antes (node servidor.mjs), senão o Windows não deixa trocar o arquivo.
import { existsSync } from 'node:fs';
import { copyFile, mkdir, rename, rm } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { caminhoBanco, pastaBackups, carimbo, verificarBancoSqlite } from './copias.mjs';

const argumento = process.argv[2];
if (!argumento) {
  console.log('Uso: node restaurar.mjs <arquivo de backup>   ex.: node restaurar.mjs backups/oficina-2026-11-13-2210.db');
  process.exit(1);
}

const origem = resolve(argumento);
const banco = caminhoBanco();
const pasta = pastaBackups();

function sair(mensagem) {
  console.log(mensagem);
  process.exitCode = 1;
}

if (!existsSync(origem)) {
  sair(`Arquivo não encontrado: ${origem}`);
} else if (origem === banco) {
  sair('O arquivo escolhido é o próprio banco atual. Escolha um backup.');
} else {
  const conferido = await verificarBancoSqlite(origem);
  if (!conferido.ok) {
    sair(`Recusado: ${basename(origem)} ${conferido.motivo}. Nada foi alterado.`);
  } else {
    await mkdir(pasta, { recursive: true });
    let guardada = null;

    if (existsSync(banco)) {
      let nome = `antes-da-restauracao-${carimbo()}.db`;
      let n = 2;
      while (existsSync(join(pasta, nome))) nome = `antes-da-restauracao-${carimbo()}-${n++}.db`;
      guardada = join(pasta, nome);
      let db;
      try {
        db = new DatabaseSync(banco);
        db.prepare('VACUUM INTO ?').run(guardada);
      } catch (err) {
        sair(`Não consegui guardar o banco atual, então a restauração foi cancelada: ${err.message}`);
      } finally {
        db?.close();
      }
      if (process.exitCode === 1) guardada = undefined;
    }

    if (process.exitCode !== 1) {
      await mkdir(dirname(banco), { recursive: true });
      const temporario = `${banco}.restaurando`;
      try {
        await copyFile(origem, temporario);
        // Sobras de um fechamento interrompido não podem voltar por cima do banco restaurado.
        for (const sufixo of ['-journal', '-wal', '-shm']) await rm(banco + sufixo, { force: true });
        await rename(temporario, banco);
        console.log(`Banco restaurado a partir de: ${origem}`);
        if (guardada) console.log(`Banco anterior guardado em: ${guardada}`);
      } catch (err) {
        await rm(temporario, { force: true });
        sair(`Não consegui trocar o banco (${err.code || err.message}). Feche o servidor e tente de novo.` +
          (guardada ? `\nA cópia do banco atual está em: ${guardada}` : ''));
      }
    }
  }
}
