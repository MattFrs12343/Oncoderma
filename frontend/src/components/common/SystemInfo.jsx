import { useState, useEffect } from 'react'
import { analysisService } from '../../services/analysisService'
import { authService } from '../../services/authService'

const SystemInfo = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [systemData, setSystemData] = useState({
    modelInfo: null,
    stats: null,
    authStatus: null,
    loading: false
  })

  const loadSystemInfo = async () => {
    setSystemData(prev => ({ ...prev, loading: true }))
    
    try {
      const [modelInfo, stats, authStatus] = await Promise.all([
        analysisService.getModelInfo(),
        analysisService.getStats(),
        authService.validateToken()
      ])
      
      setSystemData({
        modelInfo,
        stats,
        authStatus,
        loading: false
      })
    } catch (error) {
      console.error('Error cargando información del sistema:', error)
      setSystemData(prev => ({ ...prev, loading: false }))
    }
  }

  useEffect(() => {
    if (isOpen && !systemData.modelInfo) {
      loadSystemInfo()
    }
  }, [isOpen])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200 ${className}`}
      >
        ℹ️ Info del Sistema
      </button>
    )
  }

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Información del Sistema</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          ✕
        </button>
      </div>
      
      {systemData.loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary mx-auto mb-2"></div>
          <p className="text-xs text-gray-600">Cargando información...</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          {/* Información del modelo */}
          {systemData.modelInfo?.success && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Modelo de IA</h4>
              <div className="bg-white rounded p-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre:</span>
                  <span className="font-mono">{systemData.modelInfo.data?.model_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Versión:</span>
                  <span className="font-mono">{systemData.modelInfo.data?.version || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precisión:</span>
                  <span className="font-mono">{((systemData.modelInfo.data?.accuracy || 0) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Estadísticas */}
          {systemData.stats?.success && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Estadísticas</h4>
              <div className="bg-white rounded p-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Análisis totales:</span>
                  <span className="font-mono">{systemData.stats.data?.total_analyses || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Análisis hoy:</span>
                  <span className="font-mono">{systemData.stats.data?.analyses_today || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tiempo promedio:</span>
                  <span className="font-mono">{systemData.stats.data?.average_processing_time || 'N/A'}s</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Estado de autenticación */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Autenticación</h4>
            <div className="bg-white rounded p-2 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className={`font-mono ${systemData.authStatus?.valid ? 'text-green-600' : 'text-red-600'}`}>
                  {systemData.authStatus?.valid ? 'Válido' : 'Inválido'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Usuario:</span>
                <span className="font-mono">{systemData.authStatus?.user?.username || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          {/* Botón de actualizar */}
          <button
            onClick={loadSystemInfo}
            disabled={systemData.loading}
            className="w-full bg-secondary text-white py-2 px-3 rounded text-xs hover:bg-primary transition-colors duration-200 disabled:opacity-50"
          >
            {systemData.loading ? 'Actualizando...' : 'Actualizar Información'}
          </button>
        </div>
      )}
    </div>
  )
}

export default SystemInfo