import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // JSON Server persiste cada evaluación en db.json. Ignorarlo evita que
      // Vite interprete el guardado como un cambio de código y recargue la app.
      watch: process.env.DISABLE_HMR === 'true'
        ? null
        : { ignored: ['**/db.json'] },
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3002',
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            charts: ['recharts'],
            feedback: ['howler', 'sonner'],
            motion: ['motion'],
            modernUi: ['cmdk', '@number-flow/react'],
          },
        },
      },
    },
  };
});
