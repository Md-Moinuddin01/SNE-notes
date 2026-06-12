import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        app: 'app.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
