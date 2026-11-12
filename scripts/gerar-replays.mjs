// Gera src/data/replays/<id>.json a partir de transcripts/<id>.jsonl (+ <id>.meta.json).
// A transcrição é a saída real de `claude -p --output-format stream-json --verbose`.
// Rode de novo quando a versão da CLI mudar e as sessões forem regravadas:
//   node scripts/gerar-replays.mjs
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const ORIGEM = 'transcripts';
const DESTINO = 'src/data/replays';

// O terminal mostra texto puro: tira a marcação Markdown de negrito e código.
const puro = (texto) => texto.replace(/\*\*(.+?)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1');
const curto = (texto, max) => (texto.length > max ? `${texto.slice(0, max).trimEnd()}…` : texto);
const linhasDe = (texto) => texto.split('\n').filter((l) => l.trim()).length;

function argumento(nome, entrada) {
  if (entrada.file_path) return entrada.file_path;
  if (entrada.pattern) return entrada.path ? `${entrada.pattern} em ${entrada.path}` : entrada.pattern;
  if (entrada.command) return curto(entrada.command, 110);
  if (entrada.query) return curto(entrada.query, 80);
  if (entrada.description) return curto(entrada.description, 80);
  return '';
}

// Resumo neutro do resultado. Não imita o texto da interface interativa: descreve o que voltou.
function resumo(nome, texto, erro) {
  if (erro) return `erro: ${curto(texto.split('\n')[0], 120)}`;
  if (nome === 'Read') return `${linhasDe(texto)} linhas lidas`;
  if (nome === 'Glob') return `${linhasDe(texto)} caminhos encontrados`;
  if (nome === 'Grep') return `${linhasDe(texto)} linhas de resultado`;
  if (nome === 'Write' || nome === 'Edit') return curto(texto.split('\n')[0].replace(/\s*\(file state.*$/, ''), 120);
  return curto(texto.split('\n').slice(0, 3).join('\n'), 240);
}

function converter(id) {
  const meta = JSON.parse(readFileSync(join(ORIGEM, `${id}.meta.json`), 'utf8'));
  const eventos = readFileSync(join(ORIGEM, `${id}.jsonl`), 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((l) => JSON.parse(l));

  const inicio = eventos.find((e) => e.type === 'system' && e.subtype === 'init');
  const linhas = [{ t: 'cmd', texto: meta.comando }];
  if (meta.prompt) linhas.push({ t: 'prompt', texto: meta.prompt });
  const pendentes = new Map();

  for (const e of eventos) {
    const conteudo = e.message?.content;
    if (!Array.isArray(conteudo)) continue;
    for (const bloco of conteudo) {
      if (e.type === 'assistant' && bloco.type === 'text' && bloco.text.trim()) {
        linhas.push({ t: 'texto', texto: curto(puro(bloco.text.trim()), meta.corta ?? 900) });
      }
      if (e.type === 'assistant' && bloco.type === 'tool_use') {
        if ((meta.ocultar ?? []).includes(bloco.name)) continue;
        const linha = { t: 'ferramenta', nome: bloco.name, arg: argumento(bloco.name, bloco.input) };
        pendentes.set(bloco.id, linha);
        linhas.push(linha);
      }
      if (e.type === 'user' && bloco.type === 'tool_result' && pendentes.has(bloco.tool_use_id)) {
        const texto = typeof bloco.content === 'string' ? bloco.content : (bloco.content ?? []).map((c) => c.text ?? '').join('\n');
        const linha = pendentes.get(bloco.tool_use_id);
        linha.saida = resumo(linha.nome, texto, bloco.is_error);
      }
    }
  }
  for (const nota of meta.notas ?? []) linhas.push({ t: 'nota', texto: nota });

  const saida = {
    titulo: meta.titulo,
    versao: inicio?.claude_code_version ?? meta.versao,
    data: meta.data,
    origem: `${ORIGEM}/${id}.jsonl`,
    reconstruido: 'Reconstruído da saída estruturada de uma sessão real (a tela interativa tem outro desenho)',
    linhas,
  };
  writeFileSync(join(DESTINO, `${id}.json`), JSON.stringify(saida, null, 2) + '\n');
  console.log(`${id}: ${linhas.length} linhas · v${saida.versao}`);
}

readdirSync(ORIGEM)
  .filter((f) => f.endsWith('.jsonl'))
  .forEach((f) => converter(basename(f, '.jsonl')));
