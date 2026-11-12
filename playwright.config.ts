import { defineConfig } from '@playwright/test';

const BASE = process.env.SITE_BASE ?? '/curso-claude-code';

export default defineConfig({
  testDir: './tests',
  reporter: 'list',
  use: { baseURL: `http://localhost:4321${BASE}/` },
  webServer: {
    command: 'npm run preview -- --port 4321',
    url: `http://localhost:4321${BASE}/`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
