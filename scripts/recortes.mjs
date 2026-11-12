// Recortes de componentes para a crítica visual: node scripts/recortes.mjs <rota> <largura> <tema> <seletor...>
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
const [rota, largura, tema, ...seletores] = process.argv.slice(2);
const BASE = `http://localhost:4321${process.env.SITE_BASE ?? '/curso-claude-code'}/`;
mkdirSync('screenshots', { recursive: true });
const navegador = await chromium.launch();
const contexto = await navegador.newContext({ viewport: { width: Number(largura), height: 900 }, deviceScaleFactor: Number(largura) < 800 ? 2 : 1, reducedMotion: 'reduce' });
await contexto.addInitScript((t) => localStorage.setItem('mdb:v1', JSON.stringify({ tema: t })), tema);
const pagina = await contexto.newPage();
await pagina.goto(BASE + rota, { waitUntil: 'networkidle' });
await pagina.evaluate(() => document.fonts.ready);
await pagina.evaluate(() => document.querySelectorAll('details.camada').forEach((d) => (d.open = true)));
for (const [i, seletor] of seletores.entries()) {
  const nome = `screenshots/recorte-${rota.replace(/\W+/g, '')}-${largura}-${tema}-${i}.png`;
  if (seletor === 'topo') await pagina.screenshot({ path: nome });
  else await pagina.locator(seletor).first().screenshot({ path: nome });
  console.log(nome);
}
await navegador.close();
