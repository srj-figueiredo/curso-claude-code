// Acessibilidade (WCAG 2.2 AA) em todas as páginas do site construído, nos dois temas.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function paginas(dir: string, base = ''): string[] {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) return nome === 'pagefind' ? [] : paginas(caminho, `${base}${nome}/`);
    return nome === 'index.html' ? [base] : [];
  });
}

const rotas = paginas('dist');

for (const tema of ['papel', 'console'] as const) {
  for (const rota of rotas) {
    test(`axe · ${tema} · /${rota}`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('mdb:v1', JSON.stringify({ tema: t })), tema);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(rota);
      const resultado = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      const serias = resultado.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      // Mensagem curta: regra, quantos nós e o primeiro alvo.
      expect(serias.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes[0].target.join(' ').slice(-90)}`)).toEqual([]);
    });
  }
}
