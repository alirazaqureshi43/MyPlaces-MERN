import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://my-place-backend-168epwqz4-alirazaqureshi43s-projects.vercel.app',
        changeOrigin: true,
      },
    },
  },
})
