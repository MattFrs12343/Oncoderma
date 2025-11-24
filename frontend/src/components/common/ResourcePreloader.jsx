import { useEffect } from 'react'

const ResourcePreloader = () => {
  useEffect(() => {
    // Precargar imágenes críticas
    const criticalImages = [
      '/img/OncoDerma-Logo.png'
    ]
    
    criticalImages.forEach(src => {
      const img = new Image()
      img.src = src
    })
    
    // Precargar fuentes críticas si no están ya cargadas
    if (document.fonts && document.fonts.load) {
      document.fonts.load('400 16px Inter')
      document.fonts.load('500 16px Inter')
      document.fonts.load('600 16px Inter')
    }
    
    // Preconectar a dominios externos
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ]
    
    preconnectDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
    
  }, [])
  
  return null // Este componente no renderiza nada
}

export default ResourcePreloader