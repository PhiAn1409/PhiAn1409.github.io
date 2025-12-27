// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://PhiAn1409.github.io',
  base: '/blog_phian',
  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});