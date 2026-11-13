// Confere o index.html contra o briefing.md.
// Uso: node conferir.mjs  (lê os dois arquivos da mesma pasta deste script)

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const pasta = dirname(fileURLToPath(import.meta.url));
const html = await readFile(join(pasta, "index.html"), "utf8");
const briefing = await readFile(join(pasta, "briefing.md"), "utf8");

// Preços: "R$ 9,00", "R$ 68,00", "R$ 1.250,00"...
function extraiPrecos(texto) {
  const normalizado = texto.replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
  const achados = normalizado.match(/R\$\s?\d{1,3}(?:\.\d{3})*(?:,\d{2})?/g) ?? [];
  return [...new Set(achados.map((p) => p.replace(/^R\$\s?/, "R$ ")))];
}

// Item 1: todo preço do HTML aparece no briefing.
const precosHtml = extraiPrecos(html);
const precosBriefing = new Set(extraiPrecos(briefing));
const precosSemBriefing = precosHtml.filter((p) => !precosBriefing.has(p));
const item1Detalhes = [`${precosHtml.length} preços distintos no HTML`];
if (precosHtml.length === 0) item1Detalhes.push("nenhum preço em R$ encontrado no HTML");
for (const p of precosSemBriefing) item1Detalhes.push(`não está no briefing: ${p}`);
const item1 = precosHtml.length > 0 && precosSemBriefing.length === 0;

// Item 2: as três cores da seção "Marca" do briefing aparecem no HTML.
const linhas = briefing.split(/\r?\n/);
const inicio = linhas.findIndex((l) => l.trim() === "## Marca");
let secaoMarca = "";
if (inicio >= 0) {
  const fim = linhas.findIndex((l, i) => i > inicio && l.startsWith("## "));
  secaoMarca = linhas.slice(inicio + 1, fim < 0 ? undefined : fim).join("\n");
}
const cores = [...new Set(secaoMarca.match(/#[0-9a-fA-F]{6}\b/g) ?? [])].map((c) => c.toUpperCase());
const htmlMinusc = html.toLowerCase();
const coresAusentes = cores.filter((c) => !htmlMinusc.includes(c.toLowerCase()));
const item2Detalhes = [`cores no briefing: ${cores.join(", ") || "nenhuma"}`];
if (cores.length !== 3) item2Detalhes.push(`o briefing tem ${cores.length} cores; esperadas 3`);
for (const c of coresAusentes) item2Detalhes.push(`não está no HTML: ${c}`);
const item2 = cores.length === 3 && coresAusentes.length === 0;

// Item 3: existe um link para o WhatsApp (wa.me, api.whatsapp.com ou whatsapp://).
const regexWhatsapp = /href\s*=\s*["'](?:https?:\/\/(?:wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\/|whatsapp:\/\/)[^"']*["']/gi;
const linksWhatsapp = html.match(regexWhatsapp) ?? [];
const item3Detalhes = [`${linksWhatsapp.length} link(s) de WhatsApp no HTML`];
const item3 = linksWhatsapp.length > 0;

// Item 4: existe um <form> com campos name="nome", "produto", "quantidade" e "data".
const form = html.match(/<form\b[^>]*>([\s\S]*?)<\/form>/i);
const camposObrigatorios = ["nome", "produto", "quantidade", "data"];
const item4Detalhes = [];
let item4 = false;
if (!form) {
  item4Detalhes.push("nenhum <form> encontrado");
} else {
  const faltando = camposObrigatorios.filter(
    (campo) => !new RegExp(`\\sname\\s*=\\s*["']${campo}["']`, "i").test(form[1]),
  );
  for (const campo of faltando) item4Detalhes.push(`campo ausente no formulário: ${campo}`);
  item4 = faltando.length === 0;
}

const itens = [
  ["(1) Todo preço em R$ do HTML aparece no briefing", item1, item1Detalhes],
  ["(2) As três cores do briefing estão no HTML", item2, item2Detalhes],
  ["(3) Existe um link do WhatsApp", item3, item3Detalhes],
  ["(4) Existe um formulário com nome, produto, quantidade e data", item4, item4Detalhes],
];

let ok = 0;
for (const [titulo, passou, detalhes] of itens) {
  console.log(`${titulo}: ${passou ? "OK" : "FALHOU"}`);
  for (const d of detalhes) console.log(`    - ${d}`);
  if (passou) ok++;
}
console.log(`\n${ok} de ${itens.length} itens OK`);
process.exitCode = ok === itens.length ? 0 : 1;
