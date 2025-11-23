import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  server: {
    host: '0.0.0.0',        // Permite acceso desde cualquier IP (necesario para Docker)
    port: 5173,              // Puerto de desarrollo
    strictPort: false,       // Intenta otro puerto si 5173 está ocupado
    open: false,             // No abre navegador automáticamente (útil en Docker)
    cors: true,              // Habilita CORS
    
    // Proxy para conectar con backend
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // Backend en desarrollo local
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    },
    
    // Configuración para hot-reload en Docker
    watch: {
      usePolling: true
    },
    
    hmr: {
      host: 'localhost'
    }
  },
  
  // Configuración de preview (build de producción local)
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: false,
    open: false
  }
})
