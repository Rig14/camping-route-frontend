import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === "production" ? 'http://localhost:8080' : "http://matkarajad.zapto.org/",
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
