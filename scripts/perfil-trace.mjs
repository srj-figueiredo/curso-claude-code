// Diagnóstico definitivo: grava um trace do Chromium na carga (CPU 4x mais lenta) e soma o tempo por tipo de evento.
// Uso: node scripts/perfil-trace.mjs [rota]   (com `npm run preview` no ar)
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
const url = `http://localhost:4321${process.env.SITE_BASE ?? '/curso-claude-code'}/${process.argv[2] ?? 'm3/'}`;
const navegador = await chromium.launch();
const contexto = await navegador.newContext({ viewport: { width: 412, height: 823 } });
const pagina = await contexto.newPage();
const cdp = await contexto.newCDPSession(pagina);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await navegador.startTracing(pagina, { path: 'screenshots/trace.json', categories: ['devtools.timeline', 'blink', 'blink.user_timing', 'loading', 'disabled-by-default-devtools.timeline'] });
await pagina.goto(url, { waitUntil: 'load' });
await pagina.waitForTimeout(3000);
await navegador.stopTracing();
await navegador.close();

const { traceEvents } = JSON.parse(readFileSync('screenshots/trace.json', 'utf8'));
const completos = traceEvents.filter((e) => e.ph === 'X' && e.dur > 0);
const porNome = new Map();
for (const e of completos) {
  const x = porNome.get(e.name) ?? { total: 0, n: 0, max: 0 };
  x.total += e.dur / 1000;
  x.n++;
  x.max = Math.max(x.max, e.dur / 1000);
  porNome.set(e.name, x);
}
console.log('evento'.padEnd(34), 'total ms'.padStart(9), 'n'.padStart(6), 'maior'.padStart(8));
[...porNome].sort((a, b) => b[1].total - a[1].total).slice(0, 22).forEach(([nome, x]) => console.log(nome.padEnd(34), x.total.toFixed(0).padStart(9), String(x.n).padStart(6), x.max.toFixed(0).padStart(8)));
console.log('\nMaiores eventos de Layout:');
completos.filter((e) => e.name === 'Layout').sort((a, b) => b.dur - a.dur).slice(0, 5).forEach((e) => console.log(' ', (e.dur / 1000).toFixed(0), 'ms', JSON.stringify(e.args?.beginData ?? {}).slice(0, 160)));
