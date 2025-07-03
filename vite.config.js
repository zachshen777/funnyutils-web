import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[Proxy] 转发请求: ${req.method} ${req.url}`);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log(`[Proxy] 收到响应: ${proxyRes.statusCode} ${req.url}`);
          });
        }
      }
    }
  }
})