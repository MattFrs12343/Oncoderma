import { APP_CONFIG, ERROR_CODES, ERROR_MESSAGES, ANALYSIS_ALGORITHMS, SKIN_LESION_TYPES } from '../utils/constants'
import { authService } from './authService'
import cacheService, { withCache } from './cacheService'

class AnalysisService {
  constructor() {
    this.baseUrl = APP_CONFIG.api.baseUrl
    this.timeout = APP_CONFIG.api.timeout
    this.requestCache = new Map()
    this.lastHealthCheck = null
    this.healthCheckInterval = 30000 // 30 segundos
  }

  // Crear headers con autenticación
  getAuthHeaders() {
    const token = authService.getToken()
    const headers = {}
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }

  // Realizar request con timeout, caché y manejo de errores optimizado
  async makeRequest(url, options = {}) {
    const { signal: externalSignal, ...restOptions } = options
    const controller = new AbortController()
    
    // Combinar señales de abort si existe una externa
    if (externalSignal) {
      externalSignal.addEventListener('abort', () => controller.abort())
    }
    
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    // Generar clave de caché para requests GET
    const cacheKey = options.method === 'GET' ? `request_${url}` : null
    
    // Verificar caché para requests GET
    if (cacheKey && cacheService.has(cacheKey)) {
      clearTimeout(timeoutId)
      return { 
        ok: true, 
        json: () => Promise.resolve(cacheService.get(cacheKey))
      }
    }

    try {
      const response = await fetch(url, {
        ...restOptions,
        signal: controller.signal,
        headers: {
          ...this.getAuthHeaders(),
          ...restOptions.headers
        }
      })

      clearTimeout(timeoutId)
      
      // Guardar en caché si es exitoso y es GET
      if (response.ok && cacheKey) {
        const data = await response.clone().json()
        cacheService.set(cacheKey, data, 60000) // 1 minuto de caché
      }
      
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('Timeout: El análisis tardó demasiado tiempo')
      }
      throw error
    }
  }

  // Generar hash de archivo para caché
  async generateFileHash(file) {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  // Analizar imagen
  async analyzeImage(file, options = {}) {
    try {
      console.log('Iniciando análisis de imagen:', file.name)
      
      // Validar archivo antes de enviar
      const validation = this.validateFile(file)
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errorCode,
          message: validation.message
        }
      }

      // Crear FormData para enviar la imagen y datos del paciente
      const formData = new FormData()
      formData.append('file', file)
      
      // Agregar datos del paciente si están disponibles
      if (options.patientData) {
        formData.append('age', options.patientData.age)
        formData.append('sex', options.patientData.sex)
        formData.append('lesion_location', options.patientData.lesionLocation)
        console.log('Datos del paciente incluidos en el análisis:', options.patientData)
      }

      console.log('Enviando imagen al servidor...')
      const response = await this.makeRequest(`${this.baseUrl}/api/analysis/upload`, {
        method: 'POST',
        body: formData,
        signal: options.signal,
        // No establecer Content-Type, el navegador lo hará automáticamente con boundary
      })

      const data = await response.json()
      console.log('Respuesta del servidor:', data)

      if (response.ok && data.success) {
        return {
          success: true,
          result: data.result,
          message: data.message || 'Análisis completado exitosamente'
        }
      } else {
        return {
          success: false,
          error: data.error || ERROR_CODES.PROCESSING_FAILED,
          message: data.message || ERROR_MESSAGES[ERROR_CODES.PROCESSING_FAILED]
        }
      }
    } catch (error) {
      console.error('Error en análisis:', error)
      
      // Retornar error sin fallback a simulación
      return {
        success: false,
        error: ERROR_CODES.NETWORK_ERROR,
        message: 'Error de conexión con el servidor. Verifica que el backend esté corriendo.'
      }
    }
  }

  // Validar archivo antes del análisis
  validateFile(file) {
    if (!file) {
      return {
        isValid: false,
        errorCode: 'NO_FILE',
        message: 'No se ha seleccionado ningún archivo'
      }
    }

    // Validar tipo de archivo
    if (!APP_CONFIG.upload.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        errorCode: ERROR_CODES.FILE_INVALID_TYPE,
        message: ERROR_MESSAGES[ERROR_CODES.FILE_INVALID_TYPE]
      }
    }

    // Validar tamaño de archivo
    if (file.size > APP_CONFIG.upload.maxFileSize) {
      return {
        isValid: false,
        errorCode: ERROR_CODES.FILE_TOO_LARGE,
        message: ERROR_MESSAGES[ERROR_CODES.FILE_TOO_LARGE]
      }
    }

    // Validar que no esté vacío
    if (file.size === 0) {
      return {
        isValid: false,
        errorCode: 'EMPTY_FILE',
        message: 'El archivo está vacío'
      }
    }

    return { isValid: true }
  }

  // ELIMINADO: Análisis simulado - Solo se usa modelo real
  // simulateAnalysis(file) {
    return new Promise((resolve) => {
      console.log('Ejecutando análisis simulado local...')
      
      // Simular tiempo de procesamiento realista
      const processingTime = Math.random() * 3 + 2 // 2-5 segundos
      
      setTimeout(() => {
        // Algoritmo inteligente avanzado para generar probabilidades realistas
        const generateIntelligentAnalysis = () => {
          // Simular características de la imagen
          const imageFeatures = this.simulateImageFeatures(file)
          
          // Seleccionar patrón de distribución base
          const ageGroup = this.getRandomAgeGroup()
          let baseProbabilities = { ...ANALYSIS_ALGORITHMS.DISTRIBUTION_PATTERNS.age_based[ageGroup] }
          
          // Aplicar modificadores según características de imagen
          baseProbabilities = this.applyImageFeatureModifiers(baseProbabilities, imageFeatures)
          
          // Aplicar factores de riesgo
          baseProbabilities = this.applyRiskFactors(baseProbabilities, imageFeatures)
          
          // Convertir a porcentajes y normalizar
          const probabilities = this.normalizeProbabilities(baseProbabilities)
          
          // Calcular confianza del análisis
          const confidence = this.calculateConfidence(imageFeatures)
          
          return {
            probabilities,
            confidence,
            imageFeatures,
            ageGroup
          }
        }
        
        const analysisResult = generateIntelligentAnalysis()
        const lesionProbabilities = analysisResult.probabilities
        
        // Determinar el tipo más probable
        const mostLikelyType = Object.keys(lesionProbabilities).reduce((a, b) => 
          lesionProbabilities[a] > lesionProbabilities[b] ? a : b
        )
        
        const highestProbability = lesionProbabilities[mostLikelyType]
        const confidence = analysisResult.confidence
        
        // Simular metadatos de imagen
        const imageMetadata = {
          size: file.size,
          type: file.type,
          dimensions: {
            width: Math.floor(Math.random() * 1000) + 500,
            height: Math.floor(Math.random() * 1000) + 500,
            format: file.type.split('/')[1].toUpperCase(),
            mode: 'RGB'
          }
        }
        
        const result = {
          // Mantener compatibilidad con el formato anterior
          probability: highestProbability,
          most_likely_type: mostLikelyType,
          
          // Nuevos datos detallados
          detailed_analysis: {
            lesion_probabilities: lesionProbabilities,
            most_likely: {
              type: mostLikelyType,
              probability: highestProbability
            },
            risk_assessment: {
              overall_risk: highestProbability > 60 ? 'high' : highestProbability > 30 ? 'medium' : 'low',
              cancer_probability: lesionProbabilities.mel + lesionProbabilities.bcc + (lesionProbabilities.akiec * 0.3),
              benign_probability: lesionProbabilities.nv + lesionProbabilities.bkl + lesionProbabilities.vasc + lesionProbabilities.df
            }
          },
          
          processing_time: Math.round(processingTime * 100) / 100,
          confidence: Math.round(confidence * 100) / 100,
          timestamp: new Date().toISOString(),
          image_metadata: imageMetadata
        }

        console.log('Análisis simulado completado:', result)

        resolve({
          success: true,
          result,
          message: 'Análisis completado (modo simulado - sin conexión)',
          isSimulated: true
        })
      }, processingTime * 1000)
    })
  }

  // Obtener información del modelo de IA con caché
  getModelInfo = withCache(
    async () => {
      const response = await this.makeRequest(`${this.baseUrl}/api/analysis/model-info`, {
        method: 'GET'
      })
      
      if (response.ok) {
        const data = await response.json()
        return { success: true, data }
      } else {
        return { success: false, message: 'Error obteniendo información del modelo' }
      }
    },
    () => 'model_info',
    300000 // 5 minutos de caché
  )

  // Obtener estadísticas del servicio
  async getStats() {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/api/analysis/stats`)
      
      if (response.ok) {
        const data = await response.json()
        return { success: true, data }
      } else {
        return { success: false, message: 'Error obteniendo estadísticas' }
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      return { success: false, message: 'Error de conexión' }
    }
  }

  // Validar estado del servicio con caché inteligente
  async checkHealth() {
    const now = Date.now()
    
    // Usar caché si el último check fue reciente
    if (this.lastHealthCheck && (now - this.lastHealthCheck.timestamp) < this.healthCheckInterval) {
      return this.lastHealthCheck.result
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`${this.baseUrl}/api/analysis/health`, {
        method: 'GET',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      let result
      if (response.ok) {
        const data = await response.json()
        result = { 
          healthy: true, 
          data,
          message: 'Servicio disponible'
        }
      } else {
        result = { 
          healthy: false, 
          message: 'Servicio no disponible'
        }
      }

      // Guardar en caché
      this.lastHealthCheck = {
        timestamp: now,
        result
      }

      return result
    } catch (error) {
      console.warn('Servicio de análisis no disponible:', error.message)
      
      const result = { 
        healthy: false, 
        message: 'Servicio offline',
        error: error.message
      }

      // Guardar resultado negativo en caché por menos tiempo
      this.lastHealthCheck = {
        timestamp: now,
        result
      }

      return result
    }
  }

  // Verificar conectividad general con caché
  checkConnectivity = withCache(
    async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)
        
        const response = await fetch(`${this.baseUrl}/health`, {
          method: 'GET',
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        return response.ok
      } catch (error) {
        return false
      }
    },
    () => 'connectivity_check',
    10000 // 10 segundos de caché
  )

  // Métodos auxiliares para análisis inteligente
  simulateImageFeatures(file) {
    // Simular características basadas en el archivo
    const features = {
      quality: Math.random() > 0.3 ? 'high' : Math.random() > 0.6 ? 'medium' : 'low',
      size: file.size > 2 * 1024 * 1024 ? 'large' : file.size > 500 * 1024 ? 'medium' : 'small',
      clarity: Math.random() > 0.2 ? 'clear' : 'ambiguous',
      
      // Características dermatológicas simuladas
      asymmetry: Math.random() > 0.7,
      border_irregularity: Math.random() > 0.6,
      color_variation: Math.random() > 0.5,
      diameter_large: Math.random() > 0.8,
      evolution: Math.random() > 0.9,
      
      // Características adicionales
      surface_texture: Math.random() > 0.5 ? 'smooth' : 'rough',
      pigmentation: Math.random() > 0.3 ? 'uniform' : 'varied',
      vascularization: Math.random() > 0.8
    }
    
    return features
  }

  getRandomAgeGroup() {
    const random = Math.random()
    if (random < 0.3) return 'young'
    if (random < 0.7) return 'adult'
    return 'elderly'
  }

  applyImageFeatureModifiers(probabilities, features) {
    const modified = { ...probabilities }
    
    // Aplicar modificadores según características
    if (features.border_irregularity) {
      const pattern = ANALYSIS_ALGORITHMS.DISTRIBUTION_PATTERNS.image_features.irregular_borders
      Object.keys(pattern).forEach(key => {
        modified[key] = (modified[key] + pattern[key]) / 2
      })
    }
    
    if (features.color_variation) {
      const pattern = ANALYSIS_ALGORITHMS.DISTRIBUTION_PATTERNS.image_features.varied_color
      Object.keys(pattern).forEach(key => {
        modified[key] = (modified[key] + pattern[key]) / 2
      })
    }
    
    return modified
  }

  applyRiskFactors(probabilities, features) {
    const modified = { ...probabilities }
    
    // Aplicar factores de riesgo
    Object.keys(ANALYSIS_ALGORITHMS.RISK_FACTORS).forEach(factor => {
      if (features[factor.replace('_', '_')]) {
        const riskFactors = ANALYSIS_ALGORITHMS.RISK_FACTORS[factor]
        Object.keys(riskFactors).forEach(lesionType => {
          if (modified[lesionType]) {
            modified[lesionType] *= riskFactors[lesionType]
          }
        })
      }
    })
    
    return modified
  }

  normalizeProbabilities(probabilities) {
    // Convertir a porcentajes
    const total = Object.values(probabilities).reduce((sum, val) => sum + val, 0)
    const normalized = {}
    
    Object.keys(probabilities).forEach(key => {
      normalized[key] = Math.round((probabilities[key] / total) * 100)
    })
    
    // Ajuste final para que sume exactamente 100%
    const finalTotal = Object.values(normalized).reduce((sum, val) => sum + val, 0)
    if (finalTotal !== 100) {
      const diff = 100 - finalTotal
      const maxKey = Object.keys(normalized).reduce((a, b) => 
        normalized[a] > normalized[b] ? a : b
      )
      normalized[maxKey] += diff
    }
    
    return normalized
  }

  calculateConfidence(features) {
    let confidence = 0.8 // Base confidence
    
    // Ajustar según calidad de imagen
    if (features.quality === 'high') confidence += 0.1
    if (features.quality === 'low') confidence -= 0.15
    
    // Ajustar según claridad
    if (features.clarity === 'clear') confidence += 0.05
    if (features.clarity === 'ambiguous') confidence -= 0.1
    
    // Ajustar según características definidas
    const definedFeatures = [
      features.asymmetry,
      features.border_irregularity,
      features.color_variation
    ].filter(Boolean).length
    
    confidence += definedFeatures * 0.03
    
    return Math.max(0.6, Math.min(0.95, confidence))
  }

  // Limpiar caché manualmente
  clearCache() {
    this.requestCache.clear()
    this.lastHealthCheck = null
    cacheService.clear()
  }

  // Obtener estadísticas de rendimiento
  getPerformanceStats() {
    return {
      cacheStats: cacheService.getStats(),
      lastHealthCheck: this.lastHealthCheck?.timestamp,
      requestCacheSize: this.requestCache.size
    }
  }
}

// Exportar instancia singleton
export const analysisService = new AnalysisService()
export default analysisService