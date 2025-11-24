import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CompactResultCard from '../cards/CompactResultCard'
import { DetailedConfidenceIndicator } from '../indicators/ConfidenceIndicator'
import { ANIMATION_VARIANTS } from '../../../utils/dashboardConstants'

const DetallesTab = ({ dashboardData }) => {
  const [showAllResults, setShowAllResults] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No hay datos detallados disponibles</div>
      </div>
    )
  }

  const { allResults, mainResult, metadata } = dashboardData
  
  // Filtrar resultados relevantes (>5%) y ordenar por probabilidad
  const relevantResults = allResults.filter(result => result.isRelevant)
  const topResults = relevantResults.slice(0, 3)
  const remainingResults = relevantResults.slice(3)

  const handleResultClick = (result) => {
    setSelectedResult(selectedResult?.type === result.type ? null : result)
  }

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
        <h2 className="text-2xl font-bold text-primary mb-2">
          Análisis Detallado
        </h2>
        <p className="text-gray-600">
          Probabilidades de todos los tipos de lesiones analizados
        </p>
      </motion.div>

      {/* Información del análisis */}
      <motion.div
        variants={ANIMATION_VARIANTS.card}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Confianza detallada */}
        <DetailedConfidenceIndicator 
          confidence={mainResult?.confidence || 0.85}
          analysisType="IA médica avanzada"
          modelVersion="v2.1"
          animated={true}
        />

        {/* Estadísticas del análisis */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Estadísticas del Análisis
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total de clases analizadas:</span>
              <span className="font-medium">{allResults.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Resultados relevantes (&gt;5%):</span>
              <span className="font-medium">{relevantResults.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tiempo de procesamiento:</span>
              <span className="font-medium">{metadata?.processingTime || 0}s</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tipo de análisis:</span>
              <span className="font-medium">{metadata?.analysisType || 'detailed'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Resultados principales (Top 3) */}
      <motion.div
        variants={ANIMATION_VARIANTS.card}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary flex items-center">
            <span className="mr-2">🏆</span>
            Resultados Principales
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">
              {topResults.length} tipos más probables
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topResults.map((result, index) => (
            <CompactResultCard
              key={result.type}
              result={result}
              index={index}
              isHighlighted={selectedResult?.type === result.type}
              onClick={() => handleResultClick(result)}
              animated={true}
            />
          ))}
        </div>
      </motion.div>

      {/* Botón para mostrar análisis completo */}
      {remainingResults.length > 0 && (
        <motion.div
          variants={ANIMATION_VARIANTS.card}
          className="text-center"
        >
          <button
            onClick={() => setShowAllResults(!showAllResults)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${showAllResults ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span>
                {showAllResults ? 'Ocultar análisis completo' : 'Ver análisis completo'}
              </span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                +{remainingResults.length}
              </span>
            </div>
          </button>
        </motion.div>
      )}

      {/* Análisis completo expandible */}
      <AnimatePresence>
        {showAllResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary flex items-center">
                  <span className="mr-2">🔬</span>
                  Análisis Completo - Todas las Clases
                </h3>
                <div className="text-sm text-gray-600">
                  {remainingResults.length} tipos adicionales
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {remainingResults.map((result, index) => (
                  <CompactResultCard
                    key={result.type}
                    result={result}
                    index={index + 3}
                    isHighlighted={selectedResult?.type === result.type}
                    onClick={() => handleResultClick(result)}
                    animated={true}
                  />
                ))}
              </div>

              {/* Información adicional sobre resultados de baja probabilidad */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-blue-800 mb-1">
                      Sobre los resultados de baja probabilidad
                    </p>
                    <p className="text-xs text-blue-700">
                      Los tipos con probabilidades menores al 5% se consideran poco probables para esta imagen específica. 
                      El modelo analiza todas las posibilidades para proporcionar un diagnóstico diferencial completo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resumen estadístico */}
      <motion.div
        variants={ANIMATION_VARIANTS.card}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
          <span className="mr-2">📊</span>
          Distribución de Probabilidades
        </h3>
        
        <div className="space-y-3">
          {topResults.map((result, index) => (
            <div key={result.type} className="flex items-center space-x-3">
              <div className="w-8 text-center">
                <span className="text-lg">{result.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {result.name}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {result.probability}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      result.isCancer === true ? 'bg-gradient-to-r from-red-400 to-red-600' :
                      result.isCancer === 'potential' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      'bg-gradient-to-r from-green-400 to-green-600'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${result.probability}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DetallesTab