import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Configurar error boundary global
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})

// Remover loader inicial cuando React esté listo
const removeInitialLoader = () => {
  const loader = document.getElementById('initial-loader')
  if (loader) {
    loader.style.opacity = '0'
    loader.style.transition = 'opacity 0.2s ease'
    setTimeout(() => loader.remove(), 200)
  }
}

// Render sin StrictMode en producción para evitar doble render
const root = ReactDOM.createRoot(document.getElementById('root'))

if (import.meta.env.DEV) {
  // En desarrollo, usar StrictMode
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  // En producción, sin StrictMode para evitar doble render
  root.render(<App />)
}

// Remover loader después del primer render
setTimeout(removeInitialLoader, 100)