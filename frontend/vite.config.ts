import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3000'
const backendUrl = process.env.BACKEND_URL ?? 'http://host.docker.internal:3000'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
      },
      '/rails': {
        target: backendUrl,
        changeOrigin: true,
      },
    },
  },
})
