import { useState, useEffect } from 'react'

const PerformanceMetrics = ({ className = '' }) => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    connectionType: 'unknown'
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Obtener métricas de rendimiento
    const getPerformanceMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0]
      const paint = performance.getEntriesByType('paint')
      
      const loadTime = navigation ? Math.round(navigation.loadEventEnd - navigation.fetchStart) : 0
      const renderTime = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
      
      // Memoria (si está disponible)
      const memoryUsage = performance.memory ? 
        Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : 0
      
      // Tipo de conexión (si está disponible)
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      const connectionType = connection ? connection.effectiveType || connection.type : 'unknown'
      
      setMetrics({
        loadTime,
        renderTime: Math.round(renderTime),
        memoryUsage,
        connectionType
      })
    }
    
    // Obtener métricas después de que la página se haya cargado
    if (document.readyState === 'complete') {
      getPerformanceMetrics()
    } else {
      window.addEventListener('load', getPerformanceMetrics)
      return () => window.removeEventListener('load', getPerformanceMetrics)
    }
  }, [])

  const getLoadTimeColor = (time) => {
    if (time < 1000) return 'text-green-600'
    if (time < 3000) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getMemoryColor = (memory) => {
    if (memory < 50) return 'text-green-600'
    if (memory < 100) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConnectionIcon = (type) => {
    switch (type) {
      case '4g': return '📶'
      case '3g': return '📱'
      case '2g': return '📞'
      case 'slow-2g': return '🐌'
      case 'wifi': return '📡'
      default: return '❓'
    }
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className={`text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200 ${className}`}
      >
        ⚡ Rendimiento
      </button>
    )
  }

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-3 ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-gray-700">Métricas de Rendimiento</h4>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        {/* Tiempo de carga */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tiempo de carga:</span>
          <span className={`font-mono font-medium ${getLoadTimeColor(metrics.loadTime)}`}>
            {metrics.loadTime}ms
          </span>
        </div>
        
        {/* Tiempo de renderizado */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Primer renderizado:</span>
          <span className={`font-mono font-medium ${getLoadTimeColor(metrics.renderTime)}`}>
            {metrics.renderTime}ms
          </span>
        </div>
        
        {/* Uso de memoria */}
        {metrics.memoryUsage > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Memoria JS:</span>
            <span className={`font-mono font-medium ${getMemoryColor(metrics.memoryUsage)}`}>
              {metrics.memoryUsage}MB
            </span>
          </div>
        )}
        
        {/* Tipo de conexión */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Conexión:</span>
          <span className="font-mono font-medium text-gray-700">
            {getConnectionIcon(metrics.connectionType)} {metrics.connectionType}
          </span>
        </div>
        
        {/* Indicadores de rendimiento */}
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Estado:</span>
            <span className={`font-medium ${
              metrics.loadTime < 3000 ? 'text-green-600' : 
              metrics.loadTime < 5000 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metrics.loadTime < 3000 ? '🟢 Excelente' : 
               metrics.loadTime < 5000 ? '🟡 Bueno' : '🔴 Lento'}
            </span>
          </div>
        </div>
        
        {/* Consejos de optimización */}
        {metrics.loadTime > 3000 && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <p className="text-yellow-700 font-medium">💡 Consejos:</p>
            <ul className="text-yellow-600 mt-1 space-y-1">
              <li>• Verifica tu conexión a internet</li>
              <li>• Cierra otras pestañas del navegador</li>
              <li>• Actualiza la página si es necesario</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default PerformanceMetrics