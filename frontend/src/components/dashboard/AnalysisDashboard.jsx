import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardHeader from './DashboardHeader'
import ResultTabs from './ResultTabs'
import ActionButtons from './actions/ActionButtons'
import MetricCard from './cards/MetricCard'
import RiskAssessmentCard from './cards/RiskAssessmentCard'
import QuickActionsCard from './cards/QuickActionsCard'
import { transformAnalysisData } from '../../utils/dashboardUtils'
import { DASHBOARD_STATES } from '../../utils/dashboardConstants'

const AnalysisDashboard = ({ 
  analysisData, 
  onNewAnalysis, 
  onSaveResult, 
  onShareResult 
}) => {
  const [dashboardData, setDashboardData] = useState(null)
  const [state, setState] = useState(DASHBOARD_STATES.LOADING)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('resumen')

  useEffect(() => {
    if (!analysisData) {
      setState(DASHBOARD_STATES.EMPTY)
      return
    }

    console.log('AnalysisDashboard recibió datos:', analysisData)

    try {
      const transformedData = transformAnalysisData(analysisData)
      console.log('Datos transformados:', transformedData)
      setDashboardData(transformedData)
      setState(DASHBOARD_STATES.SUCCESS)
    } catch (err) {
      console.error('Error transforming analysis data:', err)
      setError(err.message)
      setState(DASHBOARD_STATES.ERROR)
    }
  }, [analysisData])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
  }

  const handleRetry = () => {
    setState(DASHBOARD_STATES.LOADING)
    // Trigger re-processing of analysis data
    if (analysisData) {
      try {
        const transformedData = transformAnalysisData(analysisData)
        setDashboardData(transformedData)
        setState(DASHBOARD_STATES.SUCCESS)
      } catch (err) {
        setError(err.message)
        setState(DASHBOARD_STATES.ERROR)
      }
    }
  }

  if (state === DASHBOARD_STATES.LOADING) {
    return <LoadingDashboard />
  }

  if (state === DASHBOARD_STATES.ERROR) {
    return <ErrorDashboard error={error} onRetry={handleRetry} />
  }

  if (state === DASHBOARD_STATES.EMPTY || !dashboardData) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">No hay datos de análisis disponibles</div>
        <div className="text-sm text-gray-400 mt-2">Estado: {state}</div>
        <div className="text-sm text-gray-400">Datos: {JSON.stringify(analysisData)}</div>
      </div>
    )
  }

  // Scroll automático a los resultados
  useEffect(() => {
    if (state === DASHBOARD_STATES.SUCCESS && dashboardData) {
      const timer = setTimeout(() => {
        const dashboardElement = document.getElementById('analysis-dashboard')
        if (dashboardElement) {
          dashboardElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          })
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [state, dashboardData])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Análisis Completado
        </h1>
        <p className="text-slate-300">
          Resultado procesado con inteligencia artificial médica avanzada
        </p>
      </div>

      {/* Debug info */}
      <div className="bg-slate-800 p-4 rounded mb-4 text-white text-sm">
        <div>Estado: {state}</div>
        <div>Datos disponibles: {dashboardData ? 'Sí' : 'No'}</div>
        <div>Resultado principal: {dashboardData?.mainResult?.simpleName || 'N/A'}</div>
      </div>

      {/* Resultado principal simple */}
      <div className="bg-slate-800 rounded-2xl p-8 mb-8 border border-slate-600">
        <div className="text-center">
          <div className="text-6xl mb-4">{dashboardData?.mainResult?.icon || '🔬'}</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {dashboardData?.mainResult?.simpleName || 'Análisis'}
          </h2>
          <p className="text-slate-300 mb-6">
            {dashboardData?.mainResult?.description || 'Procesando resultado...'}
          </p>
          <div className="text-4xl font-bold text-blue-400">
            {dashboardData?.mainResult?.probability || 0}%
          </div>
        </div>
      </div>

      {/* Botón de nuevo análisis */}
      <div className="text-center">
        <button
          onClick={onNewAnalysis}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Nuevo Análisis
        </button>
      </div>
    </div>
  )
}

// Loading component
const LoadingDashboard = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    ))}
  </div>
)

// Error component
const ErrorDashboard = ({ error, onRetry }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-red-200">
    <div className="text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-red-600 mb-2">
        Error al cargar resultados
      </h3>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Intentar de nuevo
      </button>
    </div>
  </div>
)

export default AnalysisDashboard