import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
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
