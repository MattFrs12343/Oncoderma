import { APP_CONFIG, ERROR_CODES, ERROR_MESSAGES } from '../utils/constants'
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

  // Realizar request con timeout y manejo de errores
  async makeRequest(url, options = {}) {
    const { signal: externalSignal, ...restOptions } = options
    const controller = new AbortController()
    
    if (externalSignal) {
      externalSignal.addEventListener('abort', () => controller.abort())
    }
    
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    const cacheKey = options.method === 'GET' ? `request_${url}` : null
    
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
      
      if (response.ok && cacheKey) {
        const data = await response.clone().json()
        cacheService.set(cacheKey, data, 60000)
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

  // Analizar imagen con el modelo REAL
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

      // Validar datos del paciente (REQUERIDOS)
      if (!options.patientData) {
        return {
          success: false,
          error: 'MISSING_METADATA',
          message: 'Se requieren los datos del paciente: edad, sexo y ubicación de la lesión'
        }
      }

      console.log('Datos del paciente:', options.patientData)
      console.log('Enviando imagen al servidor...')
      
      // Crear FormData para el backend
      const backendFormData = new FormData()
      backendFormData.append('file', file)
      backendFormData.append('age', options.patientData.age)
      backendFormData.append('sex', options.patientData.sex)
      backendFormData.append('anatom_site_general', options.patientData.lesionLocation)
      
      // Construir URL: si baseUrl está vacío, usar ruta relativa (proxy de Vite)
      const url = this.baseUrl ? `${this.baseUrl}/predict` : '/predict'
      console.log('URL de análisis:', url)
      
      const response = await this.makeRequest(url, {
        method: 'POST',
        body: backendFormData,
        signal: options.signal,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })

      const data = await response.json()
      console.log('Respuesta del servidor:', data)

      // Adaptar la respuesta del backend al formato esperado por el frontend
      if (response.ok && data.top3) {
        // Convertir las clases a minúsculas para que coincidan con SKIN_LESION_TYPES
        const predictions = data.top3.map(pred => ({
          class: pred.class.toLowerCase(), // Convertir MEL -> mel, NV -> nv, etc.
          probability: pred.prob,
          confidence: pred.prob
        }))
        
        // El resultado más probable es el primero
        const mostLikely = predictions[0]
        
        // Crear objeto de probabilidades para todas las clases (solo las 4 que tenemos)
        const lesionProbabilities = {}
        predictions.forEach(pred => {
          lesionProbabilities[pred.class] = pred.probability
        })
        
        // Asegurarnos de que todas las 4 clases estén presentes (mel, nv, bcc, bkl)
        const allClasses = ['mel', 'nv', 'bcc', 'bkl']
        allClasses.forEach(classCode => {
          if (!lesionProbabilities[classCode]) {
            lesionProbabilities[classCode] = 0
          }
        })
        
        return {
          success: true,
          result: {
            predictions: predictions,
            top3: data.top3.map(pred => ({
              ...pred,
              class: pred.class.toLowerCase()
            })),
            detailed_analysis: {
              most_likely: {
                type: mostLikely.class,
                probability: mostLikely.probability,
                confidence: mostLikely.confidence
              },
              lesion_probabilities: lesionProbabilities,
              risk_assessment: {
                overall_risk: mostLikely.probability > 0.7 ? 'high' : mostLikely.probability > 0.4 ? 'medium' : 'low'
              }
            }
          },
          message: 'Análisis completado exitosamente'
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

    if (!APP_CONFIG.upload.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        errorCode: ERROR_CODES.FILE_INVALID_TYPE,
        message: ERROR_MESSAGES[ERROR_CODES.FILE_INVALID_TYPE]
      }
    }

    if (file.size > APP_CONFIG.upload.maxFileSize) {
      return {
        isValid: false,
        errorCode: ERROR_CODES.FILE_TOO_LARGE,
        message: ERROR_MESSAGES[ERROR_CODES.FILE_TOO_LARGE]
      }
    }

    if (file.size === 0) {
      return {
        isValid: false,
        errorCode: 'EMPTY_FILE',
        message: 'El archivo está vacío'
      }
    }

    return { isValid: true }
  }

  // Obtener información del modelo
  getModelInfo = withCache(
    async () => {
      // El backend actual no tiene este endpoint, retornar info estática
      return { 
        success: true, 
        data: {
          modelName: 'Skin Cancer Multimodal Model',
          version: '1.0',
          classes: ['MEL', 'NV', 'BCC', 'BKL'],
          accuracy: 0.95
        }
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

  // Validar estado del servicio
  async checkHealth() {
    const now = Date.now()
    
    if (this.lastHealthCheck && (now - this.lastHealthCheck.timestamp) < this.healthCheckInterval) {
      return this.lastHealthCheck.result
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      // Construir URL: si baseUrl está vacío, usar ruta relativa (proxy de Vite)
      const url = this.baseUrl ? `${this.baseUrl}/health` : '/health'
      
      const response = await fetch(url, {
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

      this.lastHealthCheck = {
        timestamp: now,
        result
      }

      return result
    }
  }

  // Verificar conectividad
  checkConnectivity = withCache(
    async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)
        
        // Construir URL: si baseUrl está vacío, usar ruta relativa (proxy de Vite)
        const url = this.baseUrl ? `${this.baseUrl}/health` : '/health'
        
        const response = await fetch(url, {
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

  // Limpiar caché
  clearCache() {
    this.requestCache.clear()
    this.lastHealthCheck = null
    cacheService.clear()
  }

  // Obtener estadísticas de rendimiento
  getPerformanceStats() {
    return {
      cacheSize: cacheService.size(),
      requestCacheSize: this.requestCache.size
    }
  }
}

// Instancia única del servicio
export const analysisService = new AnalysisService()
