/**
 * Configuración dinámica de API con soporte para Cloudflare y desarrollo local
 * Usa variables de entorno y proxy de Vite para evitar problemas de CORS
 */

/**
 * Obtener la URL base del API
 * - En desarrollo local: usa proxy de Vite (/api)
 * - En Cloudflare/producción: usa variable de entorno o URL completa
 */
export const getApiBaseUrl = () => {
  // 1. Prioridad: Variable de entorno explícita
  const envUrl = import.meta.env.VITE_API_BASE_URL
  
  if (envUrl) {
    console.log('🔧 API URL desde .env:', envUrl)
    return envUrl
  }
  
  // 2. En desarrollo local: usar proxy de Vite
  if (import.meta.env.DEV) {
    // Si estamos en localhost, usar el proxy /api
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('🔧 Modo desarrollo local: usando proxy /api')
      return '' // Usar rutas relativas que Vite redirigirá al backend
    }
    
    // Si estamos en una IP local (192.168.x.x), también usar proxy
    if (window.location.hostname.startsWith('192.168.') || window.location.hostname.startsWith('10.')) {
      console.log('🔧 Modo desarrollo red local: usando proxy /api')
      return ''
    }
    
    // Si estamos en Cloudflare en desarrollo
    if (window.location.hostname.includes('trycloudflare.com')) {
      console.log('🔧 Modo Cloudflare desarrollo: usando URL del entorno')
      return envUrl || window.location.origin
    }
  }
  
  // 3. En producción: usar URL del entorno o mismo origen
  if (import.meta.env.PROD) {
    console.log('🔧 Modo producción: usando mismo origen')
    return '' // Rutas relativas al mismo servidor
  }
  
  // 4. Fallback: localhost
  console.warn('⚠️ Usando fallback: http://localhost:5000')
  return 'http://localhost:5000'
}

/**
 * Verificar si hay problemas de Mixed Content
 */
export const checkMixedContentIssues = () => {
  const pageProtocol = window.location.protocol
  const apiUrl = getApiBaseUrl()
  const apiProtocol = apiUrl.startsWith('https') ? 'https:' : 'http:'
  
  if (pageProtocol === 'https:' && apiProtocol === 'http:') {
    return {
      hasProblem: true,
      message: 'Mixed Content: La página está en HTTPS pero el API está en HTTP',
      solution: 'Necesitas un túnel HTTPS para el backend o acceder desde HTTP'
    }
  }
  
  return {
    hasProblem: false,
    message: 'No hay problemas de Mixed Content'
  }
}

/**
 * Obtener configuración completa del API
 */
export const getApiConfig = () => {
  const baseUrl = getApiBaseUrl()
  const mixedContentCheck = checkMixedContentIssues()
  
  return {
    baseUrl,
    timeout: 30000,
    mixedContentIssue: mixedContentCheck.hasProblem,
    mixedContentMessage: mixedContentCheck.message,
    mixedContentSolution: mixedContentCheck.solution
  }
}

// Exportar la URL base por defecto
export const API_BASE_URL = getApiBaseUrl()

// Log de configuración en desarrollo (DESHABILITADO - ya se muestra en getApiBaseUrl)
// if (import.meta.env.DEV) {
//   const config = getApiConfig()
//   console.log('🔧 API Configuration:', {
//     baseUrl: config.baseUrl,
//     pageProtocol: window.location.protocol,
//     pageHost: window.location.host
//   })
//   
//   if (config.mixedContentIssue) {
//     console.error('❌ Mixed Content Issue Detected!')
//     console.error('📝 Message:', config.mixedContentMessage)
//     console.error('💡 Solution:', config.mixedContentSolution)
//   }
// }
