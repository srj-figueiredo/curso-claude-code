// Gate visual: captura as páginas pedidas em 4 larguras × 2 temas.
// Uso: node scripts/screenshots.mjs [rota ...]   (com `npm run preview` no ar)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = `http://localhost:4321${process.env.SITE_BASE ?? '/curso-claude-code'}/`;
const rotas = process.argv.slice(2).length ? process.argv.slice(2) : ['', 'm3/', 'baralho/'];
const larguras = (process.env.LARGURAS ?? '390,768,1280,1920').split(',').map(Number);
const temas = (process.env.TEMAS ?? 'papel,console').split(',');
const inteira = process.env.INTEIRA !== '0';

mkdirSync('screenshots', { recursive: true });
const navegador = await chromium.launch();
for (const tema of temas) {
  for (const largura of larguras) {
    const contexto = await navegador.newContext({
      viewport: { width: largura, height: largura < 800 ? 844 : 900 },
      deviceScaleFactor: largura < 800 ? 2 : 1,
      reducedMotion: 'reduce',
    });
    await contexto.addInitScript((t) => localStorage.setItem('mdb:v1', JSON.stringify({ tema: t })), tema);
    const pagina = await contexto.newPage();
    for (const rota of rotas) {
      await pagina.goto(BASE + rota, { waitUntil: 'networkidle' });
      await pagina.evaluate(() => document.fonts.ready);
      const nome = `screenshots/${(rota || 'home').replace(/\W+/g, '-').replace(/-$/, '')}-${largura}-${tema}.png`;
      await pagina.screenshot({ path: nome, fullPage: inteira });
      console.log(nome);
    }
    await contexto.close();
  }
}
await navegador.close();
