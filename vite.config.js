import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Meng-inline file CSS hasil build ke <style> di index.html
// sehingga tidak ada request CSS yang memblokir render awal (render-blocking).
function inlineCssPlugin() {
  return {
    name: 'inline-critical-css',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        return html.replace(
          /<link rel="stylesheet"[^>]*?href="([^"]+\.css)"[^>]*>/g,
          (tag, href) => {
            const key = href.replace(/^\//, '');
            const asset = ctx.bundle[key];
            if (!asset || asset.type !== 'asset') return tag;
            const css = String(asset.source);
            delete ctx.bundle[key];
            return `<style>${css}</style>`;
          }
        );
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), inlineCssPlugin()],
  build: {
    cssCodeSplit: false,
  },
});