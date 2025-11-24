import { motion } from 'framer-motion'
import MainResultCard from '../cards/MainResultCard'
import RiskIndicator from '../cards/RiskIndicator'
import NextStepsCard from '../cards/NextStepsCard'
import { ANIMATION_VARIANTS } from '../../../utils/dashboardConstants'

const ResumenTab = ({ dashboardData }) => {
  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No hay datos de análisis disponibles</div>
      </div>
    )
  }

  const { mainResult, riskAssessment, recommendations } = dashboardData

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.container}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Título de la pestaña */}
      <motion.div
        variants={ANIMATION_VARIANTS.card}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          Resumen del Análisis
        </h2>
        <p className="text-slate-300">
          Vista general de los resultados más importantes
        </p>
      </motion.div>

      {/* Grid responsivo para las tarjetas principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resultado principal simplificado */}
        <motion.div
          variants={ANIMATION_VARIANTS.card}
          className="lg:col-span-2 bg-slate-700/50 rounded-xl p-6 border border-slate-600"
        >
          <div className="flex items-center space-x-6">
            <div className="text-5xl">{mainResult?.icon}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                {mainResult?.simpleName}
              </h3>
              <p className="text-slate-300 text-sm mb-4">
                {mainResult?.description}
              </p>
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold text-blue-400">
                  {mainResult?.probability}%
                </div>
                <div className="text-sm text-slate-400">
                  Probabilidad detectada
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Evaluación de riesgo */}
        <motion.div
          variants={ANIMATION_VARIANTS.card}
          className="bg-slate-700/50 rounded-xl p-6 border border-slate-600"
        >
          <h4 className="text-white font-semibold mb-4 flex items-center">
            <span className="mr-2">{riskAssessment?.icon}</span>
            Evaluación de Riesgo
          </h4>
          <div className="space-y-3">
            <div className="text-lg font-bold text-white capitalize">
              {riskAssessment?.level}
            </div>
            <p className="text-slate-300 text-sm">
              {riskAssessment?.message}
            </p>
            {riskAssessment?.timeframe && (
              <div className="text-xs text-slate-400">
                {riskAssessment.timeframe}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Información adicional resumida */}
      <motion.div
        variants={ANIMATION_VARIANTS.card}
        className="bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl p-6 border border-slate-500"
      >
        <div className="flex items-start space-x-4">
          <div className="text-3xl">💡</div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-white mb-2">
              ¿Qué significa este resultado?
            </h4>
            <div className="text-sm text-slate-300 space-y-2">
              <p>
                <strong className="text-white">Diagnóstico principal:</strong> {mainResult?.simpleName} con {mainResult?.probability}% de probabilidad.
              </p>
              <p>
                <strong className="text-white">Nivel de riesgo:</strong> {riskAssessment?.level} - {riskAssessment?.message}
              </p>
              <p>
                <strong className="text-white">Confianza del análisis:</strong> {Math.round((mainResult?.confidence || 0.85) * 100)}% - 
                El modelo de IA tiene {mainResult?.confidence > 0.9 ? 'alta' : mainResult?.confidence > 0.75 ? 'buena' : 'moderada'} certeza en este resultado.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Estadísticas rápidas */}
      <motion.div
        variants={ANIMATION_VARIANTS.card}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {mainResult?.probability}%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Probabilidad principal
          </div>
        </div>
        
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-center">
          <div className="text-2xl font-bold text-green-400">
            {Math.round((mainResult?.confidence || 0.85) * 100)}%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Confianza IA
          </div>
        </div>
        
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {dashboardData?.metadata?.processingTime || 0}s
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Tiempo análisis
          </div>
        </div>
        
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-center">
          <div className="text-2xl font-bold text-orange-400">
            {mainResult?.type?.toUpperCase() || 'N/A'}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Tipo detectado
          </div>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        variants={ANIMATION_VARIANTS.card}
        className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4"
      >
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-yellow-400 mb-1">
              Importante: Este es un análisis de apoyo
            </p>
            <p className="text-xs text-slate-300">
              Los resultados de este análisis son únicamente informativos y no reemplazan el diagnóstico médico profesional. 
              Siempre consulta con un dermatólogo certificado para evaluación y diagnóstico definitivo.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ResumenTab