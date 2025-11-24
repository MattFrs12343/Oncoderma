import { APP_CONFIG, ERROR_CODES } from '../utils/constants'

class AuthService {
  constructor() {
    this.baseUrl = APP_CONFIG.api.baseUrl
    this.timeout = APP_CONFIG.api.timeout
  }

  // Crear headers con autenticación
  getAuthHeaders() {
    const token = this.getToken()
    const headers = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }

  // Realizar request con timeout y manejo de errores
  async makeRequest(url, options = {}) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        }
      })

      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('Timeout: La solicitud tardó demasiado')
      }
      throw error
    }
  }

  // Método para login con credenciales estáticas
  async login(username, password) {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          username: username.trim(),
          password
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Guardar token en localStorage si el login es exitoso
        if (data.token) {
          localStorage.setItem('oncoderma_token', data.token)
          localStorage.setItem('oncoderma_user', JSON.stringify(data.user))
          localStorage.setItem('oncoderma_login_time', Date.now().toString())
        }
        return data
      } else {
        return {
          success: false,
          message: data.message || 'Error de autenticación'
        }
      }
    } catch (error) {
      console.error('Error en login:', error)
      
      // Fallback a validación local si hay error de conexión
      if (error.message.includes('fetch') || error.message.includes('Timeout')) {
        console.log('Intentando validación local como fallback...')
        return this.loginLocal(username, password)
      }
      
      return {
        success: false,
        message: 'Error de conexión. Verifica tu internet.'
      }
    }
  }

  // Login local como fallback
  loginLocal(username, password) {
    const isValid = this.validateCredentialsLocal(username, password)
    
    if (isValid) {
      const userInfo = this.getUserInfo(username)
      const localUser = {
        ...userInfo,
        login_time: Date.now(),
        source: 'local'
      }
      
      const localToken = `local-token-${Date.now()}`
      
      localStorage.setItem('oncoderma_token', localToken)
      localStorage.setItem('oncoderma_user', JSON.stringify(localUser))
      localStorage.setItem('oncoderma_login_time', Date.now().toString())
      
      return {
        success: true,
        message: `¡Bienvenido/a ${userInfo.displayName}! (modo local)`,
        user: localUser,
        token: localToken
      }
    } else {
      return {
        success: false,
        message: 'Usuario o contraseña incorrectos'
      }
    }
  }

  // Método para logout
  async logout() {
    const token = this.getToken()
    
    if (token && !token.startsWith('local-token')) {
      try {
        // Intentar logout en el servidor
        await this.makeRequest(`${this.baseUrl}/api/auth/logout`, {
          method: 'POST'
        })
      } catch (error) {
        console.warn('Error en logout del servidor:', error)
        // Continuar con logout local aunque falle el servidor
      }
    }
    
    // Limpiar localStorage
    localStorage.removeItem('oncoderma_token')
    localStorage.removeItem('oncoderma_user')
    localStorage.removeItem('oncoderma_login_time')
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('oncoderma_token')
    const user = localStorage.getItem('oncoderma_user')
    const loginTime = localStorage.getItem('oncoderma_login_time')
    
    if (!token || !user || !loginTime) {
      return false
    }
    
    // Verificar si el token no ha expirado (24 horas)
    const now = Date.now()
    const loginTimestamp = parseInt(loginTime)
    const twentyFourHours = 24 * 60 * 60 * 1000
    
    if (now - loginTimestamp > twentyFourHours) {
      console.log('Token expirado, limpiando sesión...')
      this.logout()
      return false
    }
    
    return true
  }

  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('oncoderma_user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (error) {
        console.error('Error parsing user data:', error)
        return null
      }
    }
    return null
  }

  // Obtener token actual
  getToken() {
    return localStorage.getItem('oncoderma_token')
  }

  // Validar token con el servidor
  async validateToken() {
    const token = this.getToken()
    
    if (!token) {
      return { valid: false, message: 'No hay token' }
    }
    
    if (token.startsWith('local-token')) {
      return { valid: true, message: 'Token local válido' }
    }
    
    try {
      const response = await this.makeRequest(`${this.baseUrl}/api/auth/validate`)
      const data = await response.json()
      
      if (response.ok && data.success) {
        return { valid: data.valid, user: data.user }
      } else {
        return { valid: false, message: data.message || 'Token inválido' }
      }
    } catch (error) {
      console.error('Error validando token:', error)
      // Si hay error de conexión, asumir que el token local es válido
      return { valid: true, message: 'Validación offline' }
    }
  }

  // Obtener información del usuario actual del servidor
  async getCurrentUserInfo() {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/api/auth/me`)
      const data = await response.json()
      
      if (response.ok && data.success) {
        return { success: true, user: data.user }
      } else {
        return { success: false, message: data.message || 'Error obteniendo información del usuario' }
      }
    } catch (error) {
      console.error('Error obteniendo info del usuario:', error)
      return { success: false, message: 'Error de conexión' }
    }
  }

  // Validación local de credenciales (fallback)
  validateCredentialsLocal(username, password) {
    const { validUsers, staticPassword, credentials } = APP_CONFIG.auth
    const trimmedUsername = username.trim()
    
    // Verificar contraseña estática
    if (password !== staticPassword) {
      return false
    }
    
    // Buscar usuario en la lista de usuarios válidos
    const user = validUsers.find(u => 
      u.username.toLowerCase() === trimmedUsername.toLowerCase()
    )
    
    if (user) {
      return true
    }
    
    // Mantener compatibilidad con credenciales legacy
    return trimmedUsername === credentials.username && password === credentials.password
  }

  // Obtener información del usuario
  getUserInfo(username) {
    const { validUsers } = APP_CONFIG.auth
    const trimmedUsername = username.trim()
    
    // Buscar en usuarios válidos
    const user = validUsers.find(u => 
      u.username.toLowerCase() === trimmedUsername.toLowerCase()
    )
    
    if (user) {
      return {
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        email: user.email
      }
    }
    
    // Usuario legacy o no encontrado
    return {
      username: trimmedUsername,
      displayName: trimmedUsername,
      role: 'Usuario',
      email: `${trimmedUsername.toLowerCase()}@oncoderma.com`
    }
  }

  // Verificar estado de conexión con el servidor
  async checkServerConnection() {
    try {
      // Construir URL: si baseUrl está vacío, usar ruta relativa (proxy de Vite)
      const url = this.baseUrl ? `${this.baseUrl}/health` : '/health'
      
      const response = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 segundos timeout
      })
      return response.ok
    } catch (error) {
      console.warn('Servidor no disponible:', error.message)
      return false
    }
  }
}

// Exportar instancia singleton
export const authService = new AuthService()
export default authService