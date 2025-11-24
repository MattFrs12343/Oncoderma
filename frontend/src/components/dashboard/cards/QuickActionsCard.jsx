import { useState } from 'react'
import { motion } from 'framer-motion'

const QuickActionsCard = ({ onNewAnalysis, onSaveResult, onShareResult }) => {
  const [isLoading, setIsLoading] = useState({
    save: false,
    share: false
  })

  const handleSave = async () => {
    setIsLoading(prev => ({ ...prev, save: true }))
    try {
      await onSaveResult()
    } finally {
      setIsLoading(prev => ({ ...prev, save: false }))
    }
  }

  const handleShare = async () => {
    setIsLoading(prev => ({ ...prev, share: true }))
    try {
      await onShareResult()
    } finally {
      setIsLoading(prev => ({ ...prev, share: false }))
    }
  }

  const actions = [
    {
      id: 'new',
      label: 'Nuevo Análisis',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      onClick: onNewAnalysis,
      color: 'from-blue-500 to-cyan-500',
      loading: false
    },
    {
      id: 'save',
      label: 'Guardar',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      onClick: handleSave,
      color: 'from-green-500 to-emerald-500',
      loading: isLoading.save
    },
    {
      id: 'share',
      label: 'Compartir',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      ),
      onClick: handleShare,
      color: 'from-purple-500 to-violet-500',
      loading: isLoading.share
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
    >
      <h3 className="text-white font-semibold mb-4 flex items-center">
        <span className="mr-2">⚡</span>
        Acciones Rápidas
      </h3>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
            onClick={action.onClick}
            disabled={action.loading}
            className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              action.loading 
                ? 'opacity-50 cursor-not-allowed bg-slate-700' 
                : `bg-gradient-to-r ${action.color} hover:shadow-lg text-white`
            }`}
          >
            {action.loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              action.icon
            )}
            <span className="text-sm">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export default QuickActionsCard