// Banco de dados e regras das ordens de serviço (node:sqlite, sem pacotes).
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export const STATUS = ['aberta', 'em_andamento', 'pronta', 'entregue'];

export function abrirBanco(caminho) {
  mkdirSync(dirname(caminho), { recursive: true });
  const db = new DatabaseSync(caminho);
  db.exec(`
    CREATE TABLE IF NOT EXISTS ordens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente TEXT NOT NULL,
      telefone TEXT NOT NULL,
      placa TEXT NOT NULL,
      modelo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      valor_centavos INTEGER NOT NULL CHECK (valor_centavos >= 0),
      status TEXT NOT NULL CHECK (status IN ('aberta', 'em_andamento', 'pronta', 'entregue')),
      exemplo INTEGER NOT NULL DEFAULT 0,
      criada_em TEXT NOT NULL,
      entregue_em TEXT
    )
  `);
  return db;
}

// Três ordens de exemplo, marcadas EXEMPLO. Só entram se o banco estiver vazio.
export function semearExemplos(db) {
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM ordens').get();
  if (Number(n) > 0) return false;
  const agora = new Date().toISOString();
  const exemplos = [
    ['EXEMPLO - Cliente Fictício 1', '11900000001', 'EXE1A23', 'EXEMPLO - Modelo A', 'EXEMPLO - troca de óleo e filtro', 18000, 'aberta', null],
    ['EXEMPLO - Cliente Fictício 2', '11900000002', 'EXE2B34', 'EXEMPLO - Modelo B', 'EXEMPLO - troca de pastilhas de freio', 43000, 'pronta', null],
    ['EXEMPLO - Cliente Fictício 3', '11900000003', 'EXE3C45', 'EXEMPLO - Modelo C', 'EXEMPLO - alinhamento e balanceamento', 9000, 'entregue', agora],
  ];
  const ins = db.prepare(`
    INSERT INTO ordens (cliente, telefone, placa, modelo, descricao, valor_centavos, status, exemplo, criada_em, entregue_em)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `);
  for (const e of exemplos) {
    ins.run(e[0], e[1], e[2], e[3], e[4], e[5], e[6], agora, e[7]);
  }
  return true;
}

// ---------- validação ----------

const PLACA = /^([A-Z]{3}\d{4}|[A-Z]{3}\d[A-Z]\d{2})$/; // antiga ABC1234 ou Mercosul ABC1D23

function texto(v) {
  return typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '';
}

// Aceita "350", "350,00" ou "1.250,50". Devolve centavos ou null.
function parseValor(v) {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  if (!/^(\d{1,3}(\.\d{3})+|\d+)(,\d{1,2})?$/.test(s)) return null;
  return Math.round(Number(s.replace(/\./g, '').replace(',', '.')) * 100);
}

export function validarOrdem(entrada) {
  const e = entrada && typeof entrada === 'object' ? entrada : {};
  const erros = [];

  const cliente = texto(e.cliente);
  if (cliente.length < 2 || cliente.length > 100) erros.push('Nome do cliente: entre 2 e 100 caracteres.');

  const telefone = texto(e.telefone).replace(/\D/g, '');
  if (telefone.length < 10 || telefone.length > 11) erros.push('Telefone: informe DDD e número (10 ou 11 dígitos).');

  const placa = texto(e.placa).toUpperCase().replace(/[\s-]/g, '');
  if (!PLACA.test(placa)) erros.push('Placa: use o formato ABC1234 ou ABC1D23.');

  const modelo = texto(e.modelo);
  if (modelo.length < 1 || modelo.length > 60) erros.push('Modelo do carro: entre 1 e 60 caracteres.');

  const descricao = texto(e.descricao);
  if (descricao.length < 1 || descricao.length > 500) erros.push('Descrição do serviço: entre 1 e 500 caracteres.');

  const valor = parseValor(e.valor);
  if (valor === null) erros.push('Valor: use o formato 350,00 ou 1.250,50.');

  if (erros.length) return { ok: false, erros };
  return { ok: true, dados: { cliente, telefone, placa, modelo, descricao, valor } };
}

// ---------- operações ----------

export function inserirOrdem(db, d) {
  const r = db.prepare(`
    INSERT INTO ordens (cliente, telefone, placa, modelo, descricao, valor_centavos, status, exemplo, criada_em)
    VALUES (?, ?, ?, ?, ?, ?, 'aberta', 0, ?)
  `).run(d.cliente, d.telefone, d.placa, d.modelo, d.descricao, d.valor, new Date().toISOString());
  return Number(r.lastInsertRowid);
}

// status null = todas
export function listarOrdens(db, status) {
  const linhas = db.prepare(`
    SELECT id, cliente, telefone, placa, modelo, descricao, valor_centavos, status, exemplo, criada_em
    FROM ordens
    WHERE (? IS NULL OR status = ?)
    ORDER BY id DESC
  `).all(status, status);
  return linhas.map((l) => ({ ...l, exemplo: l.exemplo === 1 }));
}

// Troca livre de status. Ao entrar em "entregue" grava a data de entrega (usada no faturamento depois do login).
export function mudarStatus(db, id, status) {
  const agora = new Date().toISOString();
  const r = db.prepare(`
    UPDATE ordens
    SET status = ?,
        entregue_em = CASE WHEN ? = 'entregue' THEN COALESCE(entregue_em, ?) ELSE NULL END
    WHERE id = ?
  `).run(status, status, agora, id);
  return r.changes > 0;
}

// Sem faturamento nesta fase: só abertas e prontas (decisão 1).
export function painel(db) {
  const linhas = db.prepare('SELECT status, COUNT(*) AS n FROM ordens GROUP BY status').all();
  const cont = Object.fromEntries(linhas.map((l) => [l.status, Number(l.n)]));
  return { abertas: cont.aberta ?? 0, prontas: cont.pronta ?? 0 };
}
