// Mede o Lighthouse das rotas pedidas no site em prévia: node scripts/lighthouse.mjs [rota ...]
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const BASE = `http://localhost:4321${process.env.SITE_BASE ?? '/curso-claude-code'}/`;
const rotas = process.argv.slice(2).length ? process.argv.slice(2) : ['', 'm3/'];
mkdirSync('screenshots', { recursive: true });
let reprovou = false;
for (const rota of rotas) {
  execFileSync(
    'npx',
    ['--yes', 'lighthouse', BASE + rota, '--quiet', '--chrome-flags=--headless=new', '--output=json', '--output-path=screenshots/lh.json'],
    { env: { ...process.env, CHROME_PATH: chromium.executablePath() }, stdio: 'ignore', shell: true },
  );
  const r = JSON.parse(readFileSync('screenshots/lh.json', 'utf8'));
  const notas = ['performance', 'accessibility', 'best-practices', 'seo'].map((c) => [c, Math.round(r.categories[c].score * 100)]);
  console.log(`/${rota}`, notas.map(([c, n]) => `${c}=${n}`).join(' '), `CLS=${r.audits['cumulative-layout-shift'].displayValue}`, `TBT=${r.audits['total-blocking-time'].displayValue}`);
  for (const [c, n] of notas) {
    if (n >= 95) continue;
    reprovou = true;
    for (const a of r.categories[c].auditRefs) {
      const x = r.audits[a.id];
      if (x.score !== null && x.score < 0.9 && a.weight > 0) console.log(`   - ${c}: ${a.id} ${x.displayValue ?? ''}`);
    }
  }
}
process.exitCode = reprovou ? 1 : 0;
