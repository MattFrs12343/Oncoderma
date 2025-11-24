import { APP_CONFIG, ERROR_CODES } from './constants'

// Validar credenciales de login
export const validateCredentials = (username, password) => {
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

// Validar archivo de imagen
export const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No se ha seleccionado ningún archivo' }
  }

  // Validar tipo de archivo
  if (!APP_CONFIG.upload.allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: ERROR_CODES.FILE_INVALID_TYPE 
    }
  }

  // Validar tamaño de archivo
  if (file.size > APP_CONFIG.upload.maxFileSize) {
    return { 
      isValid: false, 
      error: ERROR_CODES.FILE_TOO_LARGE 
    }
  }

  return { isValid: true, error: null }
}

// Validar campos requeridos
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} es requerido` }
  }
  return { isValid: true, error: null }
}

// Formatear tamaño de archivo
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}