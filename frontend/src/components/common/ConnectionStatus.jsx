import { useState, useEffect } from 'react'
import { analysisService } from '../../services/analysisService'
import { authService } from '../../services/authService'

const ConnectionStatus = ({ className = '' }) => {
  const [status, setStatus] = useState('checking') // 'online', 'offline', 'checking'
  const [lastCheck, setLastCheck] = useState(null)

  const checkConnection = async () => {
    setStatus('checking')
    
    try {
      // Verificar tanto auth como analysis service
      const [authConnected, analysisConnected] = await Promise.all([
        authService.checkServerConnection(),
        analysisService.checkConnectivity()
      ])
      
      const isOnline = authConnected && analysisConnected
      setStatus(isOnline ? 'online' : 'offline')
      setLastCheck(new Date())
    } catch (error) {
      setStatus('offline')
      setLastCheck(new Date())
    }
  }

  useEffect(() => {
    // Verificar conexión al montar
    checkConnection()
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkConnection, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-300',
          icon: '🟢',
          text: 'Conectado',
          description: 'Servidor disponible'
        }
      case 'offline':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-300',
          icon: '🔴',
          text: 'Sin conexión',
          description: 'Modo offline - funcionalidad limitada'
        }
      case 'checking':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-300',
          icon: '🟡',
          text: 'Verificando...',
          description: 'Comprobando conexión'
        }
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-300',
          icon: '⚪',
          text: 'Desconocido',
          description: 'Estado desconocido'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{config.icon}</span>
          <div>
            <span className={`font-medium ${config.color}`}>
              {config.text}
            </span>
            <p className="text-xs text-gray-600 mt-1">
              {config.description}
            </p>
          </div>
        </div>
        
        <button
          onClick={checkConnection}
          disabled={status === 'checking'}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50"
        >
          {status === 'checking' ? 'Verificando...' : 'Actualizar'}
        </button>
      </div>
      
      {lastCheck && (
        <div className="mt-2 text-xs text-gray-500">
          Última verificación: {lastCheck.toLocaleTimeString()}
        </div>
      )}
      
      {status === 'offline' && (
        <div className="mt-2 text-xs text-red-600">
          ℹ️ El análisis funcionará en modo simulado
        </div>
      )}
    </div>
  )
}

export default ConnectionStatus