// Diagnóstico de layout: custo de um relayout completo da página, removendo uma parte por vez.
// Uso: node scripts/perfil.mjs [rota]   (com `npm run preview` no ar)
import { chromium } from '@playwright/test';
const url = `http://localhost:4321${process.env.SITE_BASE ?? '/curso-claude-code'}/${process.argv[2] ?? 'm3/'}`;
const navegador = await chromium.launch();
const pagina = await (await navegador.newContext({ viewport: { width: 412, height: 823 } })).newPage();
await pagina.goto(url, { waitUntil: 'networkidle' });
const medir = (css) =>
  pagina.evaluate((css) => {
    const estilo = document.createElement('style');
    estilo.textContent = css;
    document.head.append(estilo);
    const tempos = [];
    for (let i = 0; i < 5; i++) {
      document.body.style.display = 'none';
      document.body.offsetHeight;
      const t = performance.now();
      document.body.style.display = '';
      document.body.offsetHeight;
      tempos.push(performance.now() - t);
    }
    estilo.remove();
    return Math.round(tempos.sort((a, b) => a - b)[2]);
  }, css);
const casos = {
  'página inteira': '',
  'sem .prosa': '.prosa{display:none}',
  'sem fichas': '.ficha{display:none}',
  'sem camadas': '.camada{display:none}',
  'sem tabelas': 'table{display:none}',
  'sem pre': 'pre{display:none}',
  'sem replay/figura': '.replay,.figura{display:none}',
  'sem hifenização': '*{hyphens:manual!important}',
  'sem balance': '*{text-wrap:wrap!important}',
  'sem placa/resumo': '.placa,.resumo{display:none}',
  'sem cabeça/rodapé': '.cabeca,.rodape{display:none}',
};
for (const [nome, css] of Object.entries(casos)) console.log(nome.padEnd(20), String(await medir(css)).padStart(5), 'ms');
await navegador.close();
