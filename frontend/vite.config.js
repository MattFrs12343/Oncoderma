import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    strictPort: false,
    // Permitir todos los hosts (Cloudflare, localhost, IPs locales)
    allowedHosts: [
      '.trycloudflare.com',
      'localhost',
      '127.0.0.1'
    ],
    // Configuración de HMR para Cloudflare
    hmr: {
      clientPort: 3000
    },
    // ✅ PROXY para evitar CORS en desarrollo local
    proxy: {
      // Redirigir todas las peticiones a /api, /health, /predict al backend
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/health': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/predict': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2015',
    minify: 'esbuild',
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true, // Split CSS para mejor caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom']
        },
        // Nombres con hash para cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  // Optimizaciones para desarrollo
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
