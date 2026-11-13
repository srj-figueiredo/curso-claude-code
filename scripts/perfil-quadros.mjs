// Diagnóstico: soma dos quadros longos (LoAF) na carga, com CPU 4x mais lenta.
// Cada caso acrescenta CSS ao fim da folha de estilo já na entrega (vale desde o primeiro layout).
// Uso: node scripts/perfil-quadros.mjs [rota]   (com `npm run preview` no ar)
import { chromium } from '@playwright/test';
const url = `http://localhost:4321${process.env.SITE_BASE ?? '/curso-claude-code'}/${process.argv[2] ?? 'm3/'}`;
const navegador = await chromium.launch();
async function carga({ css = '', semFontes = false }) {
  const contexto = await navegador.newContext({ viewport: { width: 412, height: 823 } });
  const pagina = await contexto.newPage();
  if (semFontes) await pagina.route('**/*.woff2', (r) => r.abort());
  if (css)
    await pagina.route('**/*.css', async (rota) => {
      const resposta = await rota.fetch();
      await rota.fulfill({ response: resposta, body: (await resposta.text()) + css });
    });
  await pagina.addInitScript(() => {
    window.__q = [];
    new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__q.push(Math.round(e.duration)))).observe({ type: 'long-animation-frame', buffered: true });
  });
  const cdp = await contexto.newCDPSession(pagina);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await pagina.goto(url, { waitUntil: 'load' });
  await pagina.waitForTimeout(3000);
  const quadros = await pagina.evaluate(() => window.__q);
  await contexto.close();
  return quadros;
}
const casos = {
  normal: {},
  'sem hifenização': { css: '*{hyphens:manual!important}' },
  'sem balance': { css: '*{text-wrap:wrap!important}' },
  'sem fontes web': { semFontes: true },
  'sem grão': { css: 'body::before{display:none!important}' },
  'sem :has': { css: '.diff pre .line{background:none!important}' },
  'sem eixo óptico': { css: '*{font-optical-sizing:none!important;font-variation-settings:normal!important}' },
};
for (const [nome, opcoes] of Object.entries(casos)) {
  const rodadas = [];
  for (let i = 0; i < 3; i++) rodadas.push(await carga(opcoes));
  const ordenadas = rodadas.map((r) => [r.reduce((a, b) => a + b, 0), r]).sort((a, b) => a[0] - b[0]);
  console.log(nome.padEnd(18), 'mediana', String(ordenadas[1][0]).padStart(5), 'ms ·', JSON.stringify(ordenadas[1][1]));
}
await navegador.close();
