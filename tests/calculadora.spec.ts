import { test, expect } from '@playwright/test';

// A calculadora do curso: a conta tem de bater com a fórmula escrita na página.
const BASE = '/curso-claude-code';

test('calculadora de preço aplica a fórmula escrita na página', async ({ page }) => {
  await page.goto(`${BASE}/v1/`);
  const f = page.locator('[data-calculadora]');
  await f.locator('input[name=horas]').fill('46');
  await f.locator('input[name=hora]').fill('50');
  await f.locator('input[name=custos]').fill('150');
  await f.locator('input[name=folga]').fill('20');
  await f.locator('input[name=manut]').fill('2');
  const norm = (s: string | null) => (s ?? '').replace(/ /g, ' ').trim();
  await expect.poll(async () => norm(await f.locator('[data-sai=minimo]').textContent())).toBe('R$ 2.450,00');
  expect(norm(await f.locator('[data-sai=recomendado]').textContent())).toBe('R$ 2.940,00');
  expect(norm(await f.locator('[data-sai=manut]').textContent())).toBe('R$ 100,00');
});

test('calculadora não quebra com campo vazio ou negativo', async ({ page }) => {
  await page.goto(`${BASE}/v1/`);
  const f = page.locator('[data-calculadora]');
  await f.locator('input[name=horas]').fill('');
  await f.locator('input[name=hora]').fill('-5');
  const txt = await f.locator('[data-sai=minimo]').textContent();
  expect(txt).not.toContain('NaN');
  expect(txt).not.toContain('Infinity');
});
