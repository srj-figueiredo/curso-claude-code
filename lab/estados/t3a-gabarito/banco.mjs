// Registro das conversas em SQLite (node:sqlite, sem pacotes).
//
// ATENÇÃO: telefone e nome são dados pessoais. Nesta fase ficam SEM criptografia e
// SEM prazo para apagar (decisão da Rita, registrada no plano). Não copie este banco
// para fora do computador sem combinar antes.
import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const agora = () => new Date().toISOString();

export function abrirBanco(caminho) {
  mkdirSync(dirname(caminho), { recursive: true });
  const db = new DatabaseSync(caminho);

  db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
      telefone TEXT PRIMARY KEY,
      nome TEXT,
      parou INTEGER NOT NULL DEFAULT 0,
      criado_em TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS conversas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telefone TEXT NOT NULL UNIQUE REFERENCES clientes(telefone),
      status TEXT NOT NULL DEFAULT 'bot',       -- bot | com_pessoa
      motivo_repasse TEXT,
      criado_em TEXT NOT NULL,
      atualizado_em TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS mensagens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wa_id TEXT NOT NULL UNIQUE,               -- id da mensagem (evita duplicar reenvios)
      conversa_id INTEGER NOT NULL REFERENCES conversas(id),
      direcao TEXT NOT NULL,                    -- entrada | saida
      autor TEXT NOT NULL,                      -- cliente | bot | pessoa
      tipo TEXT NOT NULL,
      texto TEXT,
      criado_em TEXT NOT NULL
    );
  `);

  return {
    garantirCliente(telefone, nome) {
      const ts = agora();
      db.prepare(`
        INSERT INTO clientes (telefone, nome, criado_em) VALUES (?, ?, ?)
        ON CONFLICT(telefone) DO UPDATE SET nome = COALESCE(excluded.nome, clientes.nome)
      `).run(telefone, nome ?? null, ts);
      db.prepare(`
        INSERT OR IGNORE INTO conversas (telefone, status, criado_em, atualizado_em)
        VALUES (?, 'bot', ?, ?)
      `).run(telefone, ts, ts);
    },

    // Devolve true se a mensagem é nova; false se o wa_id já existia.
    registrarMensagem({ wa_id, telefone, direcao, autor, tipo, texto }) {
      const conversa = db.prepare('SELECT id FROM conversas WHERE telefone = ?').get(telefone);
      const r = db.prepare(`
        INSERT OR IGNORE INTO mensagens (wa_id, conversa_id, direcao, autor, tipo, texto, criado_em)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(wa_id, conversa.id, direcao, autor, tipo, texto ?? null, agora());
      if (r.changes === 1) {
        db.prepare('UPDATE conversas SET atualizado_em = ? WHERE id = ?').run(agora(), conversa.id);
        return true;
      }
      return false;
    },

    obterCliente(telefone) {
      return db.prepare('SELECT * FROM clientes WHERE telefone = ?').get(telefone);
    },

    obterConversa(telefone) {
      return db.prepare('SELECT * FROM conversas WHERE telefone = ?').get(telefone);
    },

    marcarParou(telefone) {
      db.prepare('UPDATE clientes SET parou = 1 WHERE telefone = ?').run(telefone);
    },

    // Uso da equipe (ver reativar.mjs). Não há rota para o cliente.
    reativarCliente(telefone) {
      db.prepare('UPDATE clientes SET parou = 0 WHERE telefone = ?').run(telefone);
    },

    definirStatus(telefone, status, motivo) {
      db.prepare(`
        UPDATE conversas SET status = ?, motivo_repasse = ?, atualizado_em = ? WHERE telefone = ?
      `).run(status, motivo ?? null, agora(), telefone);
    },

    historico(telefone, limite = 20) {
      return db.prepare(`
        SELECT m.wa_id, m.direcao, m.autor, m.tipo, m.texto, m.criado_em
        FROM mensagens m JOIN conversas c ON c.id = m.conversa_id
        WHERE c.telefone = ?
        ORDER BY m.id DESC LIMIT ?
      `).all(telefone, limite).reverse();
    },

    fechar() {
      db.close();
    },
  };
}

export const novoIdDeSaida = () => `bot-${randomUUID()}`;
