import { SKIN_LESION_TYPES } from './constants'
import { SIMPLE_NAMES, RISK_MAPPING } from './dashboardConstants'

/**
 * Transforma los datos técnicos del análisis a formato dashboard
 * @param {Object} rawAnalysis - Datos del análisis desde el backend
 * @returns {Object} Datos transformados para el dashboard
 */
export const transformAnalysisData = (rawAnalysis) => {
  if (!rawAnalysis) {
    throw new Error('No se proporcionaron datos de análisis')
  }

  console.log('Transformando datos de análisis:', rawAnalysis)

  const result = rawAnalysis.result || rawAnalysis
  
  // Verificar si tenemos análisis detallado
  if (result.detailed_analysis) {
    console.log('Usando análisis detallado')
    return transformDetailedAnalysis(result, rawAnalysis)
  } else {
    console.log('Usando análisis simple')
    // Fallback para análisis simple
    return transformSimpleAnalysis(result, rawAnalysis)
  }
}

/**
 * Transforma análisis detallado con múltiples clases
 */
const transformDetailedAnalysis = (result, rawAnalysis) => {
  const { detailed_analysis, confidence, processing_time } = result
  const { most_likely, risk_assessment, lesion_probabilities } = detailed_analysis

  // Obtener información del tipo más probable
  const lesionInfo = SKIN_LESION_TYPES[most_likely.type]
  if (!lesionInfo) {
    throw new Error(`Tipo de lesión desconocido: ${most_likely.type}`)
  }

  // Determinar nivel de riesgo basado en el tipo y probabilidad
  const riskLevel = determineRiskLevel(most_likely.type, most_likely.probability, risk_assessment)
  
  return {
    mainResult: {
      type: most_likely.type,
      name: lesionInfo.fullName,
      simpleName: SIMPLE_NAMES[most_likely.type] || lesionInfo.fullName,
      probability: Math.round(most_likely.probability),
      confidence: confidence || 0.85,
      icon: lesionInfo.icon,
      description: generateSimpleDescription(most_likely.type, most_likely.probability),
      riskLevel: riskLevel
    },
    riskAssessment: RISK_MAPPING[riskLevel],
    allResults: transformAllResults(lesion_probabilities),
    recommendations: generateRecommendations(most_likely.type, riskLevel, lesionInfo),
    metadata: {
      processingTime: processing_time || 0,
      timestamp: new Date().toISOString(),
      imageId: generateImageId(),
      analysisType: 'detailed'
    }
  }
}

/**
 * Transforma análisis simple (fallback)
 */
const transformSimpleAnalysis = (result, rawAnalysis) => {
  // Extraer probabilidad de diferentes posibles ubicaciones
  const probability = result.probability || 
                     result.result?.probability || 
                     rawAnalysis.probability || 
                     75 // valor por defecto

  const confidence = result.confidence || 
                    result.result?.confidence || 
                    rawAnalysis.confidence || 
                    0.85

  const processing_time = result.processing_time || 
                         result.result?.processing_time || 
                         rawAnalysis.processingTime || 
                         2.5

  console.log('Datos extraídos:', { probability, confidence, processing_time })

  // Determinar tipo más probable basado en probabilidad
  const estimatedType = estimateTypeFromProbability(probability)
  const lesionInfo = SKIN_LESION_TYPES[estimatedType] || SKIN_LESION_TYPES['nv']
  const riskLevel = determineRiskLevelFromProbability(probability)

  return {
    mainResult: {
      type: estimatedType,
      name: lesionInfo.fullName,
      simpleName: SIMPLE_NAMES[estimatedType] || lesionInfo.fullName,
      probability: Math.round(probability),
      confidence: confidence,
      icon: lesionInfo.icon,
      description: generateSimpleDescription(estimatedType, probability),
      riskLevel: riskLevel
    },
    riskAssessment: RISK_MAPPING[riskLevel],
    allResults: generateEstimatedResults(estimatedType, probability),
    recommendations: generateRecommendations(estimatedType, riskLevel, lesionInfo),
    metadata: {
      processingTime: processing_time,
      timestamp: new Date().toISOString(),
      imageId: generateImageId(),
      analysisType: 'simple'
    }
  }
}

/**
 * Transforma todos los resultados de probabilidades
 */
const transformAllResults = (lesionProbabilities) => {
  return Object.entries(lesionProbabilities)
    .map(([type, prob]) => ({
      type,
      name: SIMPLE_NAMES[type] || SKIN_LESION_TYPES[type]?.fullName || type,
      fullName: SKIN_LESION_TYPES[type]?.fullName || type,
      probability: Math.round(prob),
      isRelevant: prob > 5, // Solo mostrar si > 5%
      icon: SKIN_LESION_TYPES[type]?.icon || '❓',
      isCancer: SKIN_LESION_TYPES[type]?.isCancer || false,
      severity: SKIN_LESION_TYPES[type]?.severity || 'low'
    }))
    .sort((a, b) => b.probability - a.probability)
}

/**
 * Determina el nivel de riesgo basado en el tipo y otros factores
 */
const determineRiskLevel = (type, probability, riskAssessment) => {
  // Si tenemos evaluación de riesgo del backend, usarla
  if (riskAssessment && riskAssessment.overall_risk) {
    return riskAssessment.overall_risk
  }

  // Determinar basado en el tipo de lesión
  const lesionInfo = SKIN_LESION_TYPES[type]
  if (!lesionInfo) return 'medium'

  if (lesionInfo.isCancer === true) {
    return probability > 70 ? 'high' : 'medium'
  } else if (lesionInfo.isCancer === 'potential') {
    return probability > 60 ? 'medium' : 'low'
  } else {
    return 'low'
  }
}

/**
 * Determina nivel de riesgo solo basado en probabilidad (fallback)
 */
const determineRiskLevelFromProbability = (probability) => {
  if (probability > 70) return 'high'
  if (probability > 40) return 'medium'
  return 'low'
}

/**
 * Estima el tipo más probable basado en probabilidad (fallback)
 */
const estimateTypeFromProbability = (probability) => {
  if (probability > 80) return 'mel' // Alta probabilidad = melanoma
  if (probability > 60) return 'bcc' // Media-alta = carcinoma basal
  if (probability > 40) return 'akiec' // Media = queratosis actínica
  return 'nv' // Baja = nevus común
}

/**
 * Genera resultados estimados cuando no hay análisis detallado
 */
const generateEstimatedResults = (mainType, mainProbability) => {
  const results = []
  const remaining = 100 - mainProbability
  
  // Agregar resultado principal
  results.push({
    type: mainType,
    name: SIMPLE_NAMES[mainType],
    fullName: SKIN_LESION_TYPES[mainType]?.fullName,
    probability: Math.round(mainProbability),
    isRelevant: true,
    icon: SKIN_LESION_TYPES[mainType]?.icon,
    isCancer: SKIN_LESION_TYPES[mainType]?.isCancer,
    severity: SKIN_LESION_TYPES[mainType]?.severity
  })

  // Distribuir probabilidad restante entre otros tipos
  const otherTypes = Object.keys(SKIN_LESION_TYPES).filter(t => t !== mainType)
  otherTypes.forEach((type, index) => {
    const prob = Math.max(1, Math.round(remaining / otherTypes.length * (1 - index * 0.1)))
    if (prob > 5) {
      results.push({
        type,
        name: SIMPLE_NAMES[type],
        fullName: SKIN_LESION_TYPES[type]?.fullName,
        probability: prob,
        isRelevant: prob > 5,
        icon: SKIN_LESION_TYPES[type]?.icon,
        isCancer: SKIN_LESION_TYPES[type]?.isCancer,
        severity: SKIN_LESION_TYPES[type]?.severity
      })
    }
  })

  return results.sort((a, b) => b.probability - a.probability)
}

/**
 * Genera descripción simple del resultado
 */
const generateSimpleDescription = (type, probability) => {
  const lesionInfo = SKIN_LESION_TYPES[type]
  if (!lesionInfo) return 'Resultado del análisis de imagen'

  const confidence = probability > 80 ? 'alta' : probability > 60 ? 'moderada' : 'baja'
  
  if (lesionInfo.isCancer === true) {
    return `Se detectó ${lesionInfo.fullName} con probabilidad ${confidence}. Se recomienda evaluación médica.`
  } else if (lesionInfo.isCancer === 'potential') {
    return `Se detectó ${lesionInfo.fullName} con probabilidad ${confidence}. Requiere seguimiento médico.`
  } else {
    return `Se detectó ${lesionInfo.fullName} con probabilidad ${confidence}. Generalmente benigno.`
  }
}

/**
 * Genera recomendaciones personalizadas
 */
const generateRecommendations = (type, riskLevel, lesionInfo) => {
  const immediate = []
  const general = [
    'Protección solar diaria con SPF 30+',
    'Autoexamen mensual de la piel',
    'Evitar exposición solar entre 10-16h',
    'Mantener registro fotográfico de lesiones'
  ]
  const specific = lesionInfo?.recommendations || []

  // Recomendaciones inmediatas según riesgo
  switch (riskLevel) {
    case 'high':
      immediate.push(
        'Consulta dermatológica URGENTE en 1-2 semanas',
        'No retrasar la evaluación médica',
        'Preparar historial de cambios en la lesión'
      )
      break
    case 'medium':
      immediate.push(
        'Consulta dermatológica en 2-4 semanas',
        'Monitorear cambios en la lesión',
        'Documentar evolución con fotografías'
      )
      break
    case 'low':
      immediate.push(
        'Observación regular de la lesión',
        'Chequeo dermatológico de rutina',
        'Consultar si hay cambios significativos'
      )
      break
  }

  return {
    immediate,
    general,
    specific
  }
}

/**
 * Genera ID único para la imagen
 */
const generateImageId = () => {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Obtiene color de progreso según nivel de riesgo
 */
export const getRiskColor = (riskLevel) => {
  const colors = {
    low: '#10B981',
    medium: '#F59E0B', 
    high: '#EF4444'
  }
  return colors[riskLevel] || colors.medium
}

/**
 * Formatea tiempo de procesamiento
 */
export const formatProcessingTime = (seconds) => {
  if (seconds < 1) return '< 1s'
  if (seconds < 60) return `${Math.round(seconds)}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  return `${minutes}m ${remainingSeconds}s`
}

/**
 * Valida datos de análisis
 */
export const validateAnalysisData = (data) => {
  if (!data) return false
  
  // Verificar estructura mínima
  const result = data.result || data
  if (!result) return false
  
  // Para análisis detallado
  if (result.detailed_analysis) {
    const { most_likely, lesion_probabilities } = result.detailed_analysis
    return most_likely && most_likely.type && lesion_probabilities
  }
  
  // Para análisis simple
  return typeof result.probability === 'number'
}