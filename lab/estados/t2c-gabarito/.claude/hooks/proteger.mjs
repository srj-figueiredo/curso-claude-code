// Hook PreToolUse (matcher Edit|Write).
// Impede que o Claude edite ou crie o arquivo .env e o banco dados/oficina.db.
// Recebe o JSON da ferramenta pela entrada padrão. Sai com 2 para bloquear.
import { readFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const PROJETO = resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd());
const WINDOWS = process.platform === 'win32';
const norm = (p) => (WINDOWS ? p.toLowerCase() : p);

function bloquear(mensagem) {
  process.stderr.write(`BLOQUEADO pelo hook proteger.mjs: ${mensagem}\n`);
  process.exit(2);
}

let entrada;
try {
  entrada = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  // Sem entrada legível não dá para saber o arquivo. Por segurança, recusa.
  bloquear('não consegui ler os dados da ferramenta, então a edição foi recusada por segurança.');
}

const caminho = entrada?.tool_input?.file_path;
if (!caminho) process.exit(0);

const base = resolve(entrada.cwd || PROJETO);
const alvo = norm(resolve(base, caminho));

if (basename(alvo) === '.env') {
  bloquear(
    `o arquivo .env guarda segredos (senhas e configurações) e não pode ser editado nem criado pelo Claude. ` +
      `Alvo: ${caminho}. Peça ao dono do projeto para alterar esse arquivo à mão.`,
  );
}

// O banco e os arquivos auxiliares do SQLite (-journal, -wal, -shm) ficam protegidos.
const bancos = ['oficina.db', 'oficina.db-journal', 'oficina.db-wal', 'oficina.db-shm']
  .map((nome) => norm(join(PROJETO, 'dados', nome)));

if (bancos.includes(alvo)) {
  bloquear(
    `dados/oficina.db é o banco de dados da oficina. Nenhuma edição ou criação por ferramenta é permitida. ` +
      `Alvo: ${caminho}.`,
  );
}

process.exit(0);
