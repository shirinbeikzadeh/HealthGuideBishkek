import { defineConfig } from 'vite';

// Pages serves the checked-in production HTML; Vite uses the source entry.
function useSourceEntry() {
  return {
    name: 'use-source-entry',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replace(/\s*<script type="module" crossorigin src="[^"]*\/assets\/index-[^"]+\.js"><\/script>/, '\n<script type="module" src="/src/main.js"></script>')
          .replace(/\s*<link rel="stylesheet" crossorigin href="[^"]*\/assets\/index-[^"]+\.css">/, '');
      }
    }
  };
}

export default defineConfig({ base: '/HealthGuideBishkek/', plugins: [useSourceEntry()] });
