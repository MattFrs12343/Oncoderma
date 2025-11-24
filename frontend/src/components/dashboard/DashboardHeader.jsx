import { motion } from 'framer-motion'
import { formatProcessingTime } from '../../utils/dashboardUtils'

const DashboardHeader = ({ result, processingTime }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">Análisis Completado</h1>
            <p className="text-sm text-gray-600">
              Resultado procesado con inteligencia artificial médica
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Procesado en {formatProcessingTime(processingTime)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Confianza: {Math.round(result.confidence * 100)}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DashboardHeader