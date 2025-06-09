import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  // 是否为开发环境
  const isDev = command === 'serve'

  return {
    plugins: [vue()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      host: '127.0.0.1', // 监听所有网络接口
      port: 5173,      // 可选：指定端口
      strictPort: true, // 可选：端口被占用时直接退出
      open: true, // 自动打开浏览器
      proxy: {
        '/api': {
          target: 'http://taoyity.cn:6000/v1',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // 将 HTTP_TOKEN 添加到 headers
              const token = req.headers['token']; // 使用小写
              if (token) {
                proxyReq.setHeader('Token', token);
              }
            });
          }
        },
        '/oss-proxy': {
          target: 'https://taoyuebucket.s3.cn-south-1.jdcloud-oss.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/oss-proxy/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // 移除可能引起冲突的 headers
              proxyReq.removeHeader('Origin');
            });
            proxy.on('proxyRes', (proxyRes) => {
              // 添加 CORS 头
              proxyRes.headers['Access-Control-Allow-Origin'] = '*';
              proxyRes.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS';
              proxyRes.headers['Access-Control-Allow-Headers'] = '*';
            });
          }
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: !isDev, // 生产环境移除console
          drop_debugger: !isDev
        }
      }
    }
  }
})