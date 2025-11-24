import { useState, useEffect, useCallback, memo } from 'react'
import { analysisService } from '../../services/analysisService'
import cacheService from '../../services/cacheService'

/**
 * Componente para monitorear el rendimiento de la aplicación
 */
const PerformanceMonitor = memo(({ enabled = false, onStatsUpdate }) => {
  const [stats, setStats] = useState({
    memory: null,
    cache: null,
    network: null,
    rendering: null
  })

  // Obtener estadísticas de memoria
  const getMemoryStats = useCallback(() => {
    if ('memory' in performance) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      }
    }
    return null
  }, [])

  // Obtener estadísticas de caché
  const getCacheStats = useCallback(() => {
    return cacheService.getStats()
  }, [])

  // Obtener estadísticas de red
  const getNetworkStats = useCallback(() => {
    if ('connection' in navigator) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      }
    }
    return null
  }, [])

  // Obtener estadísticas de renderizado
  const getRenderingStats = useCallback(() => {
    const navigation = performance.getEntriesByType('navigation')[0]
    if (navigation) {
      return {
        domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
        loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
        firstPaint: Math.round(performance.getEntriesByName('first-paint')[0]?.startTime || 0),
        firstContentfulPaint: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0)
      }
    }
    return null
  }, [])

  // Actualizar estadísticas
  const updateStats = useCallback(() => {
    const newStats = {
      memory: getMemoryStats(),
      cache: getCacheStats(),
      network: getNetworkStats(),
      rendering: getRenderingStats(),
      timestamp: Date.now()
    }

    setStats(newStats)
    onStatsUpdate?.(newStats)
  }, [getMemoryStats, getCacheStats, getNetworkStats, getRenderingStats, onStatsUpdate])

  // Configurar intervalo de actualización
  useEffect(() => {
    if (!enabled) return

    updateStats() // Actualización inicial

    const interval = setInterval(updateStats, 5000) // Cada 5 segundos

    return () => clearInterval(interval)
  }, [enabled, updateStats])

  // Observador de rendimiento
  useEffect(() => {
    if (!enabled || !('PerformanceObserver' in window)) return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          console.log(`Performance measure: ${entry.name} - ${entry.duration}ms`)
        }
        
        if (entry.entryType === 'navigation') {
          console.log('Navigation timing:', {
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            loadComplete: entry.loadEventEnd - entry.loadEventStart
          })
        }
      })
    })

    try {
      observer.observe({ entryTypes: ['measure', 'navigation'] })
    } catch (error) {
      console.warn('PerformanceObserver not supported:', error)
    }

    return () => observer.disconnect()
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg text-xs max-w-sm z-50">
      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Performance Monitor
      </h4>
      
      {/* Memoria */}
      {stats.memory && (
        <div className="mb-2">
          <div className="text-gray-600 dark:text-gray-400">Memory:</div>
          <div className="text-gray-800 dark:text-gray-200">
            {stats.memory.used}MB / {stats.memory.total}MB
          </div>
        </div>
      )}

      {/* Caché */}
      {stats.cache && (
        <div className="mb-2">
          <div className="text-gray-600 dark:text-gray-400">Cache:</div>
          <div className="text-gray-800 dark:text-gray-200">
            {stats.cache.size} / {stats.cache.maxSize} entries
          </div>
        </div>
      )}

      {/* Red */}
      {stats.network && (
        <div className="mb-2">
          <div className="text-gray-600 dark:text-gray-400">Network:</div>
          <div className="text-gray-800 dark:text-gray-200">
            {stats.network.effectiveType} - {stats.network.downlink}Mbps
          </div>
        </div>
      )}

      {/* Renderizado */}
      {stats.rendering && (
        <div>
          <div className="text-gray-600 dark:text-gray-400">Rendering:</div>
          <div className="text-gray-800 dark:text-gray-200">
            FCP: {stats.rendering.firstContentfulPaint}ms
          </div>
        </div>
      )}
    </div>
  )
})

PerformanceMonitor.displayName = 'PerformanceMonitor'

export default PerformanceMonitor

/**
 * Hook para métricas de rendimiento
 */
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({})

  const startMeasure = useCallback((name) => {
    performance.mark(`${name}-start`)
  }, [])

  const endMeasure = useCallback((name) => {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
    
    const measure = performance.getEntriesByName(name, 'measure')[0]
    if (measure) {
      setMetrics(prev => ({
        ...prev,
        [name]: measure.duration
      }))
      
      // Limpiar marcas
      performance.clearMarks(`${name}-start`)
      performance.clearMarks(`${name}-end`)
      performance.clearMeasures(name)
    }
  }, [])

  const measureAsync = useCallback(async (name, asyncFn) => {
    startMeasure(name)
    try {
      const result = await asyncFn()
      endMeasure(name)
      return result
    } catch (error) {
      endMeasure(name)
      throw error
    }
  }, [startMeasure, endMeasure])

  return {
    metrics,
    startMeasure,
    endMeasure,
    measureAsync
  }
}