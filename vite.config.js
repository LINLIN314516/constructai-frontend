import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 所有发到 /api 的请求，转发到 Lambda
      '/api': {
        target: 'https://qbtiolgmrdccwsb5wgbrtvyqvy0zojjb.lambda-url.ap-southeast-2.on.aws',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // /api?region=VIC -> /?region=VIC
      },
    },
  },
})


