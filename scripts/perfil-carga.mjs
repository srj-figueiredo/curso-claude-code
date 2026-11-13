// Diagnóstico de carga: tempos acumulados de layout, estilo e script (CPU 4x mais lenta),
// escondendo uma parte da página por vez, com o CSS alterado já na entrega.
// Uso: node scripts/perfil-carga.mjs [rota]   (com `npm run preview` no ar)
import { chromium } from '@playwright/test';
const url = `http://localhost:4321${process.env.SITE_BASE ?? '/curso-claude-code'}/${process.argv[2] ?? 'm3/'}`;
const navegador = await chromium.launch();
async function carga(css) {
  const contexto = await navegador.newContext({ viewport: { width: 412, height: 823 } });
  const pagina = await contexto.newPage();
  if (css)
    await pagina.route('**/*.css', async (rota) => {
      const resposta = await rota.fetch();
      await rota.fulfill({ response: resposta, body: (await resposta.text()) + css });
    });
  const cdp = await contexto.newCDPSession(pagina);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await cdp.send('Performance.enable');
  await pagina.goto(url, { waitUntil: 'load' });
  await pagina.waitForTimeout(2500);
  const m = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]));
  await contexto.close();
  return m;
}
const casos = {
  normal: '',
  'text-rendering auto': 'body{text-rendering:auto!important}',
  'sem hifenização': '*{hyphens:manual!important}',
  'auto + sem hífen': 'body{text-rendering:auto!important}*{hyphens:manual!important}',
  'sem ligaduras/kerning': '*{font-kerning:none!important;font-variant-ligatures:none!important}',
  'fonte do sistema': '*{font-family:Georgia!important}',
  'só mono do sistema': 'code,pre,kbd,.mono,.rotulo{font-family:Consolas!important}',
};
for (const [nome, css] of Object.entries(casos)) {
  const r = [];
  for (let i = 0; i < 3; i++) r.push(await carga(css));
  const med = (k) => Math.round(r.map((m) => m[k] * 1000).sort((a, b) => a - b)[1]);
  console.log(nome.padEnd(20), 'layout', String(med('LayoutDuration')).padStart(5), '· estilo', String(med('RecalcStyleDuration')).padStart(4), '· script', String(med('ScriptDuration')).padStart(4), '· tarefas', String(med('TaskDuration')).padStart(5), 'ms');
}
await navegador.close();
