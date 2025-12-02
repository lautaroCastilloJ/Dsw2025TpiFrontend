import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default ({ mode }) => {
  /* eslint-disable no-undef */
  const env = loadEnv(mode, process.cwd(), '');
  /* eslint-enable no-undef */
  const target = env.VITE_BACKEND_URL || 'http://localhost:7138/';

  return defineConfig({
    server: {
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
  });
};
