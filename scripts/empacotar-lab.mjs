// Monta os ZIPs do projeto-laboratório em public/lab/.
// Cada pasta de lab/estados/ é um estado: lab/base + as camadas de _camadas.json (se houver) + a própria pasta.
// Arquivos da camada de cima vencem.
// Sem dependências: escreve o formato ZIP direto, com deflate do próprio Node.
import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { deflateRawSync, crc32 } from 'node:zlib';

const RAIZ = 'lab';
const DESTINO = 'public/lab';
const PASTA_NO_ZIP = 'pendencias';
const MANIFESTO = '_camadas.json';
// Um manifesto pode ser uma lista de camadas (estado do Pendências) ou um objeto
// { "projeto": "doce-esquina", "camadas": [...] }: projeto próprio, sem a base do Pendências.
const estados = {};
const pastas = {};
for (const nome of readdirSync(join(RAIZ, 'estados'))) {
  const manifesto = join(RAIZ, 'estados', nome, MANIFESTO);
  const lido = existsSync(manifesto) ? JSON.parse(readFileSync(manifesto, 'utf8')) : [];
  if (Array.isArray(lido)) {
    estados[nome] = ['base', ...lido, nome];
    pastas[nome] = PASTA_NO_ZIP;
  } else {
    estados[nome] = [...(lido.camadas ?? []), nome];
    pastas[nome] = lido.projeto;
  }
}

function arquivosDe(pasta) {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    return statSync(caminho).isDirectory() ? arquivosDe(caminho) : [caminho];
  });
}

/** Junta as camadas num mapa caminho-relativo → conteúdo. */
export function compor(camadas) {
  const arvore = new Map();
  for (const camada of camadas) {
    const pasta = camada === 'base' ? join(RAIZ, 'base') : join(RAIZ, 'estados', camada);
    for (const arquivo of arquivosDe(pasta)) {
      const nome = relative(pasta, arquivo).replaceAll('\\', '/');
      if (nome !== MANIFESTO) arvore.set(nome, readFileSync(arquivo));
    }
  }
  return arvore;
}

function zip(arvore, pasta = PASTA_NO_ZIP) {
  const locais = [];
  const centrais = [];
  let deslocamento = 0;
  // Data fixa: o mesmo conteúdo gera sempre o mesmo ZIP.
  const hora = 0;
  const dia = ((2026 - 1980) << 9) | (11 << 5) | 12;

  for (const [nome, dados] of [...arvore].sort(([a], [b]) => a.localeCompare(b))) {
    const caminho = Buffer.from(`${pasta}/${nome}`, 'utf8');
    const comprimido = deflateRawSync(dados);
    const soma = crc32(dados);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // nomes em UTF-8
    local.writeUInt16LE(8, 8);
    local.writeUInt16LE(hora, 10);
    local.writeUInt16LE(dia, 12);
    local.writeUInt32LE(soma, 14);
    local.writeUInt32LE(comprimido.length, 18);
    local.writeUInt32LE(dados.length, 22);
    local.writeUInt16LE(caminho.length, 26);
    locais.push(local, caminho, comprimido);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(hora, 12);
    central.writeUInt16LE(dia, 14);
    central.writeUInt32LE(soma, 16);
    central.writeUInt32LE(comprimido.length, 20);
    central.writeUInt32LE(dados.length, 24);
    central.writeUInt16LE(caminho.length, 28);
    central.writeUInt32LE(deslocamento, 42);
    centrais.push(central, caminho);

    deslocamento += local.length + caminho.length + comprimido.length;
  }

  const diretorio = Buffer.concat(centrais);
  const fim = Buffer.alloc(22);
  fim.writeUInt32LE(0x06054b50, 0);
  fim.writeUInt16LE(arvore.size, 8);
  fim.writeUInt16LE(arvore.size, 10);
  fim.writeUInt32LE(diretorio.length, 12);
  fim.writeUInt32LE(deslocamento, 16);
  return Buffer.concat([...locais, diretorio, fim]);
}

// `node scripts/empacotar-lab.mjs --extrair <estado> <pasta>` monta um estado em disco (para verificação).
const [, , opcao, estado, pasta] = process.argv;
if (opcao === '--extrair') {
  if (!estados[estado]) throw new Error(`Estado desconhecido: ${estado}`);
  rmSync(pasta, { recursive: true, force: true });
  for (const [nome, dados] of compor(estados[estado])) {
    mkdirSync(join(pasta, nome, '..'), { recursive: true });
    writeFileSync(join(pasta, nome), dados);
  }
  console.log(`${estado} → ${pasta}`);
} else {
  mkdirSync(DESTINO, { recursive: true });
  for (const [nome, camadas] of Object.entries(estados)) {
    const arvore = compor(camadas);
    writeFileSync(join(DESTINO, `${nome}.zip`), zip(arvore, pastas[nome]));
    console.log(`${nome}.zip · ${arvore.size} arquivos · ${camadas.join(' + ')}`);
  }
}
