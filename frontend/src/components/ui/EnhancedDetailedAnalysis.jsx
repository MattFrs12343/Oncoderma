import { memo, useState, useEffect } from 'react'
import { SKIN_LESION_TYPES } from '../../utils/constants'
import AnimatedProgressBar from './AnimatedProgressBar'

const EnhancedDetailedAnalysis = memo(({ analysisResult }) => {
  const [selectedLesion, setSelectedLesion] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid', 'list', 'comparison'
  const [sortBy, setSortBy] = useState('probability') // 'probability', 'risk', 'name'
  const [filterBy, setFilterBy] = useState('all') // 'all', 'malignant', 'benign', 'potential'
  const [animatedProbabilities, setAnimatedProbabilities] = useState({})

  const { detailed_analysis } = analysisResult.result || analysisResult

  if (!detailed_analysis) {
    return (
      <div className="metric-card text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Análisis Detallado No Disponible
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          El análisis detallado no está disponible para este resultado.
        </p>
      </div>
    )
  }

  const { lesion_probabilities, most_likely, risk_assessment } = detailed_analysis

  // Animación de probabilidades
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProbabilities(lesion_probabilities)
    }, 500)
    return () => clearTimeout(timer)
  }, [lesion_probabilities])

  // Procesar y ordenar lesiones
  const processLesions = () => {
    let lesions = Object.entries(lesion_probabilities)
      .map(([code, probability]) => ({
        code,
        probability,
        ...SKIN_LESION_TYPES[code],
        isMainDiagnosis: code === most_likely?.type
      }))
      .filter(lesion => lesion.fullName) // Solo lesiones conocidas

    // Filtrar
    if (filterBy !== 'all') {
      lesions = lesions.filter(lesion => {
        switch (filterBy) {
          case 'malignant':
            return lesion.isCancer === true
          case 'benign':
            return lesion.isCancer === false
          case 'potential':
            return lesion.isCancer === 'potential'
          default:
            return true
        }
      })
    }

    // Ordenar
    lesions.sort((a, b) => {
      switch (sortBy) {
        case 'probability':
          return b.probability - a.probability
        case 'risk':
          const riskOrder = { true: 3, 'potential': 2, false: 1 }
          return riskOrder[b.isCancer] - riskOrder[a.isCancer]
        case 'name':
          return a.fullName.localeCompare(b.fullName)
        default:
          return b.probability - a.probability
      }
    })

    return lesions
  }

  const processedLesions = processLesions()

  const getCancerIcon = (isCancer) => {
    if (isCancer === true) return { icon: '⚠️', text: 'Maligna', color: 'red' }
    if (isCancer === 'potential') return { icon: '🟡', text: 'Potencial', color: 'yellow' }
    return { icon: '✅', text: 'Benigna', color: 'green' }
  }

  const getRiskLevel = (probability, isCancer) => {
    if (isCancer === true || probability > 70) return 'high'
    if (isCancer === 'potential' || probability > 40) return 'medium'
    return 'low'
  }

  const ViewModeSelector = () => (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {[
        { mode: 'grid', icon: '⊞', label: 'Grid' },
        { mode: 'comparison', icon: '⚖', label: 'Comparar' }
      ].map(({ mode, icon, label }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            viewMode === mode
              ? 'bg-white dark:bg-gray-700 text-primary dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white'
          }`}
        >
          <span className="mr-2">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  )

  const FilterControls = () => (
    <div className="flex flex-wrap items-center gap-4">
      {/* Ordenar por */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Ordenar:
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-field text-sm py-1 px-2 min-w-0"
        >
          <option value="probability">Probabilidad</option>
          <option value="risk">Riesgo</option>
          <option value="name">Nombre</option>
        </select>
      </div>

      {/* Filtrar por */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Filtrar:
        </label>
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="input-field text-sm py-1 px-2 min-w-0"
        >
          <option value="all">Todas</option>
          <option value="malignant">Malignas</option>
          <option value="benign">Benignas</option>
          <option value="potential">Potenciales</option>
        </select>
      </div>

      {/* Contador */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {processedLesions.length} de {Object.keys(lesion_probabilities).length} lesiones
      </div>
    </div>
  )

  const LesionCard = ({ lesion, index, isExpanded = false }) => {
    const cancerInfo = getCancerIcon(lesion.isCancer)
    const riskLevel = getRiskLevel(lesion.probability, lesion.isCancer)
    
    return (
      <div 
        className={`metric-card hover-lift cursor-pointer transition-all duration-300 ${
          lesion.isMainDiagnosis ? 'ring-2 ring-blue-400 dark:ring-blue-500' : ''
        } ${selectedLesion === lesion.code ? 'ring-2 ring-purple-400 dark:ring-purple-500' : ''}`}
        onClick={() => setSelectedLesion(selectedLesion === lesion.code ? null : lesion.code)}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Header de la Card */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{lesion.icon}</div>
            <div className="flex-1">
              <h4 className="font-bold text-primary dark:text-white text-sm">
                {lesion.fullName}
                {lesion.isMainDiagnosis && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                    Principal
                  </span>
                )}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {lesion.description}
              </p>
            </div>
          </div>

          {/* Ranking Badge */}
          {index < 3 && (
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
            }`}>
              {index + 1}
            </div>
          )}
        </div>

        {/* Probabilidad y Tipo */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <AnimatedProgressBar
              percentage={animatedProbabilities[lesion.code] || 0}
              color={cancerInfo.color}
              height={8}
              showPercentage={true}
              animated={true}
              delay={index * 100}
              className="mb-2"
            />
          </div>
          
          <div className="ml-4 text-right">
            <div className="text-2xl font-bold text-primary dark:text-white">
              {Math.round(lesion.probability)}%
            </div>
          </div>
        </div>

        {/* Tipo de Lesión */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            cancerInfo.color === 'red' ? 'bg-red-500 text-white' :
            cancerInfo.color === 'yellow' ? 'bg-yellow-500 text-white' :
            'bg-green-500 text-white'
          }`}>
            {cancerInfo.icon} {cancerInfo.text}
          </span>
          
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {lesion.code?.toUpperCase()}
          </span>
        </div>

        {/* Información Expandida */}
        {(selectedLesion === lesion.code || isExpanded) && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4 animate-fade-in-up">
            {/* Descripción Detallada */}
            <div>
              <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                DESCRIPCIÓN DETALLADA
              </h5>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {lesion.detailedDescription || lesion.description}
              </p>
            </div>

            {/* Características */}
            {lesion.characteristics && (
              <div>
                <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  CARACTERÍSTICAS TÍPICAS
                </h5>
                <div className="flex flex-wrap gap-2">
                  {lesion.characteristics.map((char, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recomendaciones */}
            {lesion.recommendations && (
              <div>
                <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  RECOMENDACIONES
                </h5>
                <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                  {lesion.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2 text-blue-500">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Urgencia */}
            {lesion.urgency && (
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  URGENCIA:
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  lesion.urgency === 'urgent' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                  lesion.urgency === 'priority' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                  'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                }`}>
                  {lesion.urgency.toUpperCase()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const GridView = () => (
    <div className={`grid gap-4 ${
      viewMode === 'comparison' ? 'grid-cols-1 lg:grid-cols-2' : 
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }`}>
      {processedLesions.map((lesion, index) => (
        <LesionCard 
          key={lesion.code} 
          lesion={lesion} 
          index={index}
          isExpanded={viewMode === 'comparison'}
        />
      ))}
    </div>
  )



  return (
    <div className="space-y-6">
      {/* Header con Controles */}
      <div className="metric-card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-section-title flex items-center">
              <span className="mr-3 text-2xl">🔬</span>
              Análisis Detallado por Tipo de Lesión
            </h3>
            <p className="text-metric-label">
              Comparación completa de probabilidades para cada tipo de lesión detectada
            </p>
          </div>
          
          <ViewModeSelector />
        </div>

        <FilterControls />
      </div>

      {/* Vista de Lesiones */}
      <div className="animate-fade-in-up">
        <GridView />
      </div>

      {/* Información Adicional */}
      {processedLesions.length === 0 && (
        <div className="metric-card text-center py-8">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No se encontraron lesiones
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            No hay lesiones que coincidan con los filtros seleccionados.
          </p>
        </div>
      )}
    </div>
  )
})

EnhancedDetailedAnalysis.displayName = 'EnhancedDetailedAnalysis'

export default EnhancedDetailedAnalysis