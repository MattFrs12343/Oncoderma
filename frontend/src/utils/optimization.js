/**
 * Utilidades de optimización para mejorar el rendimiento
 */

/**
 * Debounce function para limitar la frecuencia de ejecución
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

/**
 * Throttle function para limitar la frecuencia de ejecución
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Lazy loading de imágenes con Intersection Observer
 */
export const lazyLoadImages = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove('lazy')
          imageObserver.unobserve(img)
        }
      })
    })

    const images = document.querySelectorAll('img[data-src]')
    images.forEach(img => imageObserver.observe(img))
  }
}

/**
 * Preload de recursos críticos
 */
export const preloadCriticalResources = () => {
  const criticalResources = [
    '/api/analysis/model-info',
    '/api/analysis/health'
  ]

  criticalResources.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)
  })
}

/**
 * Optimización de Web Vitals
 */
export const optimizeWebVitals = () => {
  // Preconnect a dominios externos
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

  // Optimizar LCP (Largest Contentful Paint)
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1]
    
    // Solo reportar LCP si es muy lento (> 4000ms)
    if (lastEntry.startTime > 4000) {
      console.warn('⚠️ Slow LCP:', lastEntry.startTime + 'ms')
    }
  })

  try {
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  } catch (e) {
    // Fallback para navegadores que no soportan LCP
    console.warn('LCP observation not supported')
  }
}

/**
 * Compresión de imágenes en el cliente
 */
export const compressImage = (file, maxWidth = 1024, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calcular nuevas dimensiones
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Convertir a blob
      canvas.toBlob(resolve, 'image/jpeg', quality)
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Memoización simple para funciones
 */
export const memoize = (fn) => {
  const cache = new Map()
  
  return (...args) => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn(...args)
    cache.set(key, result)
    
    return result
  }
}

/**
 * Batch de actualizaciones DOM
 */
export const batchDOMUpdates = (updates) => {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      updates.forEach(update => update())
      resolve()
    })
  })
}

/**
 * Detectar si el dispositivo tiene recursos limitados
 */
export const isLowEndDevice = () => {
  // Verificar memoria disponible
  if ('memory' in navigator && navigator.memory.jsHeapSizeLimit < 1073741824) { // < 1GB
    return true
  }

  // Verificar número de núcleos de CPU
  if ('hardwareConcurrency' in navigator && navigator.hardwareConcurrency < 4) {
    return true
  }

  // Verificar conexión lenta
  if ('connection' in navigator) {
    const connection = navigator.connection
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return true
    }
  }

  return false
}

/**
 * Configuración adaptativa basada en el dispositivo
 */
export const getAdaptiveConfig = () => {
  const isLowEnd = isLowEndDevice()
  
  return {
    // Reducir calidad de imágenes en dispositivos de gama baja
    imageQuality: isLowEnd ? 0.6 : 0.8,
    
    // Reducir animaciones en dispositivos lentos
    enableAnimations: !isLowEnd,
    
    // Ajustar tamaño de caché
    cacheSize: isLowEnd ? 50 : 100,
    
    // Ajustar frecuencia de actualizaciones
    updateInterval: isLowEnd ? 10000 : 5000,
    
    // Habilitar lazy loading más agresivo
    aggressiveLazyLoading: isLowEnd
  }
}

/**
 * Cleanup de recursos no utilizados
 */
export const cleanupResources = () => {
  // Limpiar URLs de objeto no utilizadas
  const objectUrls = window.__objectUrls || []
  objectUrls.forEach(url => {
    URL.revokeObjectURL(url)
  })
  window.__objectUrls = []

  // Limpiar event listeners huérfanos
  const elements = document.querySelectorAll('[data-cleanup]')
  elements.forEach(element => {
    const events = element.dataset.cleanup.split(',')
    events.forEach(event => {
      element.removeEventListener(event.trim(), null)
    })
  })

  // Forzar garbage collection si está disponible
  if (window.gc) {
    window.gc()
  }
}

/**
 * Monitor de memoria
 */
export const monitorMemoryUsage = (callback) => {
  if (!('memory' in performance)) {
    console.warn('Memory API not supported')
    return
  }

  const checkMemory = () => {
    const memory = performance.memory
    const usage = {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
    }

    callback(usage)

    // Advertir si el uso de memoria es alto
    if (usage.used / usage.limit > 0.8) {
      console.warn('High memory usage detected:', usage)
      cleanupResources()
    }
  }

  // Verificar cada 30 segundos
  const interval = setInterval(checkMemory, 30000)
  
  // Verificación inicial
  checkMemory()

  return () => clearInterval(interval)
}

/**
 * Inicializar todas las optimizaciones
 */
export const initializeOptimizations = () => {
  // LOGS DESHABILITADOS para limpiar la consola
  // console.log('🚀 Initializing performance optimizations...')
  
  // Aplicar configuración adaptativa
  const config = getAdaptiveConfig()
  window.__adaptiveConfig = config
  
  // Inicializar optimizaciones básicas
  preloadCriticalResources()
  optimizeWebVitals()
  lazyLoadImages()
  
  // Inicializar optimizaciones de animación
  import('./animationOptimizer.js').then(({ applyAnimationOptimizations }) => {
    applyAnimationOptimizations()
  })
  
  // Configurar monitor de memoria (sin logs)
  const stopMemoryMonitor = monitorMemoryUsage((usage) => {
    // Solo logear si el uso es crítico (> 90%)
    if (usage.used / usage.limit > 0.9) {
      console.warn('💾 Critical memory usage:', usage)
    }
  })
  
  // Inicializar monitor de performance si está en desarrollo
  if (process.env.NODE_ENV === 'development') {
    import('./performanceMonitor.js').then(({ default: performanceMonitor }) => {
      performanceMonitor.setEnabled(true)
      // console.log('📊 Performance monitoring enabled') // DESHABILITADO
      
      // Log reporte solo si el score es muy bajo (< 60)
      setInterval(() => {
        const report = performanceMonitor.getPerformanceReport()
        if (report.score < 60) {
          console.warn('⚠️ Performance score critically low:', report.score)
        }
      }, 30000)
    })
  }
  
  // Optimizaciones específicas para dispositivos de gama baja
  if (config.aggressiveLazyLoading) {
    // console.log('📱 Low-end device detected, applying aggressive optimizations') // DESHABILITADO
    
    // Reducir calidad de imágenes
    document.documentElement.style.setProperty('--image-quality', '0.6')
    
    // Deshabilitar animaciones complejas
    document.documentElement.style.setProperty('--animation-duration', '0.1s')
  }
  
  // Cleanup al descargar la página
  window.addEventListener('beforeunload', () => {
    stopMemoryMonitor()
    cleanupResources()
  })
  
  // Configurar service worker si está disponible
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    navigator.serviceWorker.register('/sw.js')
      .catch(() => {}) // Silenciar errores de SW
  }
  
  // console.log('✅ Performance optimizations initialized with config:', config) // DESHABILITADO
}