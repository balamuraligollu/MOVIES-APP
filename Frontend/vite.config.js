import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    https: false, // Try disabling HTTPS for now to test.
    proxy: {
      "/api": {
        target: "http://localhost:3057",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
