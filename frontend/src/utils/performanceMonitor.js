/**
 * Sistema de monitoreo de performance para la aplicación
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.observers = new Map()
    this.isEnabled = process.env.NODE_ENV === 'development'
    this.thresholds = {
      LCP: 2500, // Largest Contentful Paint
      FID: 100,  // First Input Delay
      CLS: 0.1,  // Cumulative Layout Shift
      FCP: 1800, // First Contentful Paint
      TTFB: 800  // Time to First Byte
    }
    
    if (this.isEnabled) {
      this.initializeObservers()
    }
  }

  /**
   * Inicializar observadores de performance
   */
  initializeObservers() {
    // Observer para LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          this.recordMetric('LCP', lastEntry.startTime)
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        this.observers.set('lcp', lcpObserver)
      } catch (e) {
        console.warn('LCP observer not supported')
      }

      // Observer para FID (First Input Delay)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            this.recordMetric('FID', entry.processingStart - entry.startTime)
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
        this.observers.set('fid', fidObserver)
      } catch (e) {
        console.warn('FID observer not supported')
      }

      // Observer para CLS (Cumulative Layout Shift)
      try {
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
              this.recordMetric('CLS', clsValue)
            }
          })
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
        this.observers.set('cls', clsObserver)
      } catch (e) {
        console.warn('CLS observer not supported')
      }

      // Observer para navegación
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            this.recordMetric('FCP', entry.firstContentfulPaint)
            this.recordMetric('TTFB', entry.responseStart - entry.requestStart)
            this.recordMetric('DOM_LOAD', entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart)
            this.recordMetric('LOAD_COMPLETE', entry.loadEventEnd - entry.loadEventStart)
          })
        })
        navigationObserver.observe({ entryTypes: ['navigation'] })
        this.observers.set('navigation', navigationObserver)
      } catch (e) {
        console.warn('Navigation observer not supported')
      }
    }

    // Monitorear memoria si está disponible
    if ('memory' in performance) {
      this.startMemoryMonitoring()
    }

    // Monitorear FPS
    this.startFPSMonitoring()
  }

  /**
   * Registrar métrica
   */
  recordMetric(name, value, metadata = {}) {
    const timestamp = Date.now()
    const metric = {
      name,
      value,
      timestamp,
      metadata,
      isGood: this.isGoodMetric(name, value)
    }

    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    this.metrics.get(name).push(metric)

    // DESHABILITADO: Log solo si la métrica es mala Y es importante
    // Solo logear métricas críticas que estén mal
    if (!metric.isGood && ['LCP', 'FID', 'CLS'].includes(name)) {
      console.warn(`⚠️ Poor ${name}: ${value}ms (threshold: ${this.thresholds[name]}ms)`)
    }
    // NO logear las métricas buenas (FPS, MEMORY, etc.) para limpiar la consola

    // Mantener solo las últimas 50 métricas por tipo
    const metrics = this.metrics.get(name)
    if (metrics.length > 50) {
      metrics.shift()
    }
  }

  /**
   * Verificar si una métrica es buena
   */
  isGoodMetric(name, value) {
    const threshold = this.thresholds[name]
    if (!threshold) return true
    
    return value <= threshold
  }

  /**
   * Monitorear memoria
   */
  startMemoryMonitoring() {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = performance.memory
        const usage = {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
        }

        this.recordMetric('MEMORY_USED', usage.used, usage)

        // Advertir si el uso es alto
        if (usage.used / usage.limit > 0.8) {
          console.warn('🚨 High memory usage:', usage)
        }
      }
    }

    // Verificar cada 30 segundos
    setInterval(checkMemory, 30000)
    checkMemory() // Verificación inicial
  }

  /**
   * Monitorear FPS
   */
  startFPSMonitoring() {
    let lastTime = performance.now()
    let frames = 0
    
    const measureFPS = (currentTime) => {
      frames++
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime))
        this.recordMetric('FPS', fps)
        
        // Solo advertir si FPS es muy bajo (< 20)
        if (fps < 20) {
          console.warn(`🐌 Low FPS: ${fps}`)
        }
        
        frames = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(measureFPS)
    }
    
    requestAnimationFrame(measureFPS)
  }

  /**
   * Medir tiempo de ejecución de una función
   */
  measureFunction(name, fn) {
    return (...args) => {
      const start = performance.now()
      const result = fn(...args)
      const end = performance.now()
      
      this.recordMetric(`FUNCTION_${name.toUpperCase()}`, end - start)
      
      return result
    }
  }

  /**
   * Medir tiempo de ejecución de una función async
   */
  measureAsyncFunction(name, fn) {
    return async (...args) => {
      const start = performance.now()
      const result = await fn(...args)
      const end = performance.now()
      
      this.recordMetric(`ASYNC_${name.toUpperCase()}`, end - start)
      
      return result
    }
  }

  /**
   * Marcar inicio de una operación
   */
  markStart(name) {
    performance.mark(`${name}-start`)
  }

  /**
   * Marcar fin de una operación y medir duración
   */
  markEnd(name) {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
    
    const measure = performance.getEntriesByName(name, 'measure')[0]
    if (measure) {
      this.recordMetric(`OPERATION_${name.toUpperCase()}`, measure.duration)
    }
  }

  /**
   * Obtener resumen de métricas
   */
  getMetricsSummary() {
    const summary = {}
    
    this.metrics.forEach((values, name) => {
      if (values.length === 0) return
      
      const latest = values[values.length - 1]
      const average = values.reduce((sum, m) => sum + m.value, 0) / values.length
      const min = Math.min(...values.map(m => m.value))
      const max = Math.max(...values.map(m => m.value))
      
      summary[name] = {
        latest: latest.value,
        average: Math.round(average * 100) / 100,
        min,
        max,
        count: values.length,
        isGood: latest.isGood,
        threshold: this.thresholds[name]
      }
    })
    
    return summary
  }

  /**
   * Obtener reporte de performance
   */
  getPerformanceReport() {
    const summary = this.getMetricsSummary()
    const report = {
      timestamp: new Date().toISOString(),
      metrics: summary,
      score: this.calculatePerformanceScore(summary),
      recommendations: this.getRecommendations(summary)
    }
    
    return report
  }

  /**
   * Calcular score de performance (0-100)
   */
  calculatePerformanceScore(summary) {
    const weights = {
      LCP: 0.25,
      FID: 0.25,
      CLS: 0.25,
      FCP: 0.15,
      TTFB: 0.1
    }
    
    let totalScore = 0
    let totalWeight = 0
    
    Object.entries(weights).forEach(([metric, weight]) => {
      if (summary[metric]) {
        const score = summary[metric].isGood ? 100 : 50
        totalScore += score * weight
        totalWeight += weight
      }
    })
    
    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0
  }

  /**
   * Obtener recomendaciones de optimización
   */
  getRecommendations(summary) {
    const recommendations = []
    
    if (summary.LCP && !summary.LCP.isGood) {
      recommendations.push('Optimizar Largest Contentful Paint: comprimir imágenes, usar CDN, optimizar CSS crítico')
    }
    
    if (summary.FID && !summary.FID.isGood) {
      recommendations.push('Reducir First Input Delay: minimizar JavaScript, usar Web Workers, optimizar event handlers')
    }
    
    if (summary.CLS && !summary.CLS.isGood) {
      recommendations.push('Mejorar Cumulative Layout Shift: definir dimensiones de imágenes, evitar inserción dinámica de contenido')
    }
    
    if (summary.MEMORY_USED && summary.MEMORY_USED.latest > 100) {
      recommendations.push('Optimizar uso de memoria: limpiar event listeners, usar lazy loading, implementar garbage collection manual')
    }
    
    if (summary.FPS && summary.FPS.latest < 30) {
      recommendations.push('Mejorar FPS: reducir animaciones complejas, optimizar re-renders, usar CSS transforms')
    }
    
    return recommendations
  }

  /**
   * Limpiar observadores
   */
  cleanup() {
    this.observers.forEach(observer => {
      observer.disconnect()
    })
    this.observers.clear()
    this.metrics.clear()
  }

  /**
   * Habilitar/deshabilitar monitoreo
   */
  setEnabled(enabled) {
    this.isEnabled = enabled
    if (enabled) {
      this.initializeObservers()
    } else {
      this.cleanup()
    }
  }
}

// Instancia global
const performanceMonitor = new PerformanceMonitor()

// Hook para usar en componentes React
export const usePerformanceMonitor = () => {
  return {
    recordMetric: (name, value, metadata) => performanceMonitor.recordMetric(name, value, metadata),
    markStart: (name) => performanceMonitor.markStart(name),
    markEnd: (name) => performanceMonitor.markEnd(name),
    measureFunction: (name, fn) => performanceMonitor.measureFunction(name, fn),
    measureAsyncFunction: (name, fn) => performanceMonitor.measureAsyncFunction(name, fn),
    getReport: () => performanceMonitor.getPerformanceReport(),
    getSummary: () => performanceMonitor.getMetricsSummary()
  }
}

// Funciones de utilidad
export const measureRender = (componentName) => {
  return (WrappedComponent) => {
    return (props) => {
      performanceMonitor.markStart(`render-${componentName}`)
      const result = WrappedComponent(props)
      performanceMonitor.markEnd(`render-${componentName}`)
      return result
    }
  }
}

export const logPerformanceReport = () => {
  const report = performanceMonitor.getPerformanceReport()
  console.group('📊 Performance Report')
  console.log('Score:', report.score + '/100')
  console.table(report.metrics)
  if (report.recommendations.length > 0) {
    console.group('💡 Recommendations')
    report.recommendations.forEach(rec => console.log('•', rec))
    console.groupEnd()
  }
  console.groupEnd()
}

export default performanceMonitor