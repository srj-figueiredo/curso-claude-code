// Baixa a documentação oficial (índice llms.txt + páginas .md) para .docs-cache/ (fora do git).
// Uso: node scripts/baixar-docs.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const INDICE = 'https://code.claude.com/docs/llms.txt';
const cabecalho = { 'user-agent': 'docs-reader' };
mkdirSync('.docs-cache/en', { recursive: true });

const indice = await (await fetch(INDICE, { headers: cabecalho })).text();
writeFileSync('.docs-cache/llms.txt', indice);
const urls = [...new Set(indice.match(/https:\/\/code\.claude\.com\/docs\/en\/[^)\s]+\.md/g) ?? [])];

let falhas = 0;
for (let i = 0; i < urls.length; i += 8) {
  await Promise.all(
    urls.slice(i, i + 8).map(async (url) => {
      const resposta = await fetch(url, { headers: cabecalho });
      if (!resposta.ok) return void falhas++;
      const nome = url.replace('https://code.claude.com/docs/en/', '').replaceAll('/', '__');
      writeFileSync(`.docs-cache/en/${nome}`, await resposta.text());
    }),
  );
}
console.log(`${urls.length - falhas} de ${urls.length} páginas em .docs-cache/en/`);
process.exitCode = falhas ? 1 : 0;
