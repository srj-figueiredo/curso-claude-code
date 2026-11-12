import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// SITE_URL e SITE_BASE permitem trocar de hospedagem sem tocar no código.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://srj-figueiredo.github.io',
  base: process.env.SITE_BASE ?? '/curso-claude-code',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: { theme: 'css-variables', wrap: false },
  },
});
