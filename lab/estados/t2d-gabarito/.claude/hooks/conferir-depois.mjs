// Hook PostToolUse (matcher Edit|Write).
// Depois de editar um arquivo .mjs (em qualquer lugar) ou um arquivo dentro de publico/,
// roda `node conferir.mjs` na raiz do projeto. Se a conferência falhar, sai com 2 e
// manda o resultado completo de volta ao Claude pela saída de erro.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { extname, isAbsolute, relative, resolve, sep } from 'node:path';

const PROJETO = resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd());

let entrada;
try {
  entrada = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0); // sem entrada legível não há arquivo para checar
}

const caminho = entrada?.tool_input?.file_path;
if (!caminho) process.exit(0);

const abs = resolve(entrada.cwd || PROJETO, caminho);
const rel = relative(PROJETO, abs);
const dentroDoProjeto = rel !== '' && !isAbsolute(rel) && rel.split(sep)[0] !== '..';

const eMjs = extname(abs).toLowerCase() === '.mjs';
const eDePublico =
  dentroDoProjeto && rel.split(/[\\/]/)[0].toLowerCase() === 'publico';

if (!eMjs && !eDePublico) process.exit(0);

const r = spawnSync(process.execPath, ['conferir.mjs'], {
  cwd: PROJETO,
  encoding: 'utf8',
  timeout: 150_000,
});

if (r.status === 0) {
  process.stdout.write(`conferir.mjs passou depois da edição em ${caminho}.\n`);
  process.exit(0);
}

const saida = `${r.stdout || ''}${r.stderr || ''}`.trimEnd();
let aviso = `A conferência FALHOU depois da edição em ${caminho}. Veja o resultado abaixo e corrija antes de seguir.\n\n`;
if (r.error) aviso += `Erro ao rodar node conferir.mjs: ${r.error.message}\n`;
if (r.signal) aviso += `A conferência foi interrompida (sinal ${r.signal}, provavelmente tempo esgotado).\n`;
process.stderr.write(`${aviso}\n${saida}\n`);
process.exit(2);
