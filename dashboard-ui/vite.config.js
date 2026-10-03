import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// const target = process.env.API_URL || 'http://localhost:3070';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, 
    // proxy: { '/logs': target, '/ai': target } 
  },
});
