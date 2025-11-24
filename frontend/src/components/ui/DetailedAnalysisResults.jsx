import { memo, useState, useEffect } from 'react'
import { SKIN_LESION_TYPES } from '../../utils/constants'
import EnhancedDetailedAnalysis from './EnhancedDetailedAnalysis'
import { EntranceAnimation } from './AnimationSystem'

const DetailedAnalysisResults = memo(({ analysisResult }) => {
  // Usar el nuevo componente mejorado como predeterminado
  const { detailed_analysis } = analysisResult.result || analysisResult

  if (!detailed_analysis) {
    return (
      <EntranceAnimation type="fadeInUp">
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
      </EntranceAnimation>
    )
  }

  // Usar el componente mejorado
  return <EnhancedDetailedAnalysis analysisResult={analysisResult} />
}

DetailedAnalysisResults.displayName = 'DetailedAnalysisResults'

export default DetailedAnalysisResults