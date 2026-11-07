import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://www.curiomas.zone.id',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        research: resolve(import.meta.dirname, 'research.html'),
        team: resolve(import.meta.dirname, 'team.html'),
        interns: resolve(import.meta.dirname, 'interns.html'),
        blog: resolve(import.meta.dirname, 'blog.html'),
        contact: resolve(import.meta.dirname, 'contact.html'),
        portal: resolve(import.meta.dirname, 'portal.html'),
        login: resolve(import.meta.dirname, 'login.html'),
        article: resolve(import.meta.dirname, 'article.html')
      }
    }
  }
});
