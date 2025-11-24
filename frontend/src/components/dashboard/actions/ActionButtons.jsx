import { useState } from 'react'
import { motion } from 'framer-motion'

const ActionButtons = ({ 
  onNewAnalysis, 
  onSaveResult, 
  onShareResult, 
  dashboardData 
}) => {
  const [isLoading, setIsLoading] = useState({
    save: false,
    share: false
  })

  const handleSave = async () => {
    setIsLoading(prev => ({ ...prev, save: true }))
    try {
      await onSaveResult(dashboardData)
    } catch (error) {
      console.error('Error saving result:', error)
    } finally {
      setIsLoading(prev => ({ ...prev, save: false }))
    }
  }

  const handleShare = async () => {
    setIsLoading(prev => ({ ...prev, share: true }))
    try {
      await onShareResult(dashboardData)
    } catch (error) {
      console.error('Error sharing result:', error)
    } finally {
      setIsLoading(prev => ({ ...prev, share: false }))
    }
  }

  const buttons = [
    {
      id: 'new',
      label: 'Nuevo Análisis',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      onClick: onNewAnalysis,
      variant: 'primary',
      loading: false
    },
    {
      id: 'save',
      label: 'Guardar Resultado',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      onClick: handleSave,
      variant: 'secondary',
      loading: isLoading.save
    },
    {
      id: 'share',
      label: 'Compartir con Médico',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      ),
      onClick: handleShare,
      variant: 'secondary',
      loading: isLoading.share
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-fit"
    >
      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
        <span className="mr-2">⚡</span>
        Acciones Rápidas
      </h3>
      
      <div className="space-y-3">
        {buttons.map((button, index) => (
          <motion.button
            key={button.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            onClick={button.onClick}
            disabled={button.loading}
            className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              button.variant === 'primary'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300'
            } ${button.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {button.loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
            ) : (
              button.icon
            )}
            <span>{button.label}</span>
          </motion.button>
        ))}
      </div>
      
      {/* Info adicional */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">
              Información Importante
            </p>
            <p className="text-xs text-blue-700">
              Este análisis es una herramienta de apoyo. Siempre consulta con un profesional médico para diagnóstico definitivo.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ActionButtons