/**
 * Utilidades para optimizar animaciones y mejorar la experiencia de usuario
 */

/**
 * Detectar si el usuario prefiere movimiento reducido
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Detectar si el dispositivo es de gama baja
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
 * Obtener configuración optimizada de animaciones
 */
export const getOptimizedAnimationConfig = () => {
  const reducedMotion = prefersReducedMotion()
  const lowEndDevice = isLowEndDevice()
  
  if (reducedMotion || lowEndDevice) {
    return {
      duration: 0, // Sin animaciones
      delay: 0,
      easing: 'linear',
      enableAnimations: false
    }
  }
  
  return {
    duration: lowEndDevice ? 200 : 300, // Más rápido en dispositivos lentos
    delay: lowEndDevice ? 0 : 50, // Sin delay en dispositivos lentos
    easing: 'ease-out',
    enableAnimations: true
  }
}

/**
 * Aplicar optimizaciones de animación globalmente
 */
export const applyAnimationOptimizations = () => {
  const config = getOptimizedAnimationConfig()
  
  if (!config.enableAnimations) {
    // Deshabilitar todas las animaciones CSS
    const style = document.createElement('style')
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `
    document.head.appendChild(style)
    // console.log('🚀 Animations disabled for better performance') // DESHABILITADO
  }
  // else {
  //   console.log('✨ Animations enabled with optimized settings:', config) // DESHABILITADO
  // }
  
  return config
}

/**
 * Hook para usar configuración optimizada de animaciones
 */
export const useOptimizedAnimations = () => {
  const config = getOptimizedAnimationConfig()
  
  return {
    ...config,
    shouldAnimate: config.enableAnimations,
    getDelayedConfig: (baseDelay = 0) => ({
      ...config,
      delay: config.enableAnimations ? baseDelay + config.delay : 0
    })
  }
}

/**
 * Optimizar animaciones para resultados de análisis
 */
export const optimizeResultsAnimations = () => {
  const config = getOptimizedAnimationConfig()
  
  // Si las animaciones están deshabilitadas, mostrar todo inmediatamente
  if (!config.enableAnimations) {
    return {
      headerDelay: 0,
      primaryDelay: 0,
      detailsDelay: 0,
      duration: 0
    }
  }
  
  // Configuración optimizada para resultados
  return {
    headerDelay: 0, // Header aparece inmediatamente
    primaryDelay: 50, // Resultado principal con delay mínimo
    detailsDelay: 100, // Detalles con delay corto
    duration: config.duration
  }
}

/**
 * Forzar que el contenido aparezca inmediatamente (para debugging)
 */
export const forceImmediateDisplay = () => {
  const style = document.createElement('style')
  style.id = 'force-immediate-display'
  style.textContent = `
    .opacity-0 {
      opacity: 1 !important;
    }
    .translate-y-4,
    .translate-y-8,
    .-translate-y-4,
    .-translate-y-8 {
      transform: translateY(0) !important;
    }
    .translate-x-4,
    .translate-x-8,
    .-translate-x-4,
    .-translate-x-8 {
      transform: translateX(0) !important;
    }
    .scale-95,
    .scale-98 {
      transform: scale(1) !important;
    }
  `
  document.head.appendChild(style)
  console.log('🔧 Forced immediate display enabled')
}

/**
 * Remover forzado de display inmediato
 */
export const removeForcedDisplay = () => {
  const style = document.getElementById('force-immediate-display')
  if (style) {
    style.remove()
    console.log('🔧 Forced immediate display disabled')
  }
}

/**
 * Monitorear performance de animaciones
 */
export const monitorAnimationPerformance = () => {
  let animationCount = 0
  let totalDuration = 0
  
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach((entry) => {
      if (entry.entryType === 'measure' && entry.name.includes('animation')) {
        animationCount++
        totalDuration += entry.duration
        
        if (entry.duration > 100) {
          console.warn(`⚠️ Slow animation detected: ${entry.name} took ${entry.duration}ms`)
        }
      }
    })
  })
  
  try {
    observer.observe({ entryTypes: ['measure'] })
  } catch (e) {
    console.warn('Performance monitoring not supported')
  }
  
  return {
    getStats: () => ({
      count: animationCount,
      averageDuration: animationCount > 0 ? totalDuration / animationCount : 0,
      totalDuration
    }),
    disconnect: () => observer.disconnect()
  }
}

export default {
  prefersReducedMotion,
  isLowEndDevice,
  getOptimizedAnimationConfig,
  applyAnimationOptimizations,
  useOptimizedAnimations,
  optimizeResultsAnimations,
  forceImmediateDisplay,
  removeForcedDisplay,
  monitorAnimationPerformance
}