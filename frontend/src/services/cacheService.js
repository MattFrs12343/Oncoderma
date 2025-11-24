/**
 * Servicio de caché optimizado para mejorar el rendimiento
 */
class CacheService {
  constructor() {
    this.cache = new Map()
    this.maxSize = 100 // Máximo número de entradas
    this.ttl = 5 * 60 * 1000 // 5 minutos por defecto
  }

  /**
   * Obtener valor del caché
   */
  get(key) {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Verificar si ha expirado
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    // Actualizar último acceso para LRU
    item.lastAccess = Date.now()
    return item.value
  }

  /**
   * Guardar valor en caché
   */
  set(key, value, customTtl = null) {
    const ttl = customTtl || this.ttl
    const expiry = Date.now() + ttl

    // Si el caché está lleno, eliminar el elemento menos usado recientemente
    if (this.cache.size >= this.maxSize) {
      this._evictLRU()
    }

    this.cache.set(key, {
      value,
      expiry,
      lastAccess: Date.now()
    })
  }

  /**
   * Verificar si existe una clave
   */
  has(key) {
    return this.get(key) !== null
  }

  /**
   * Eliminar entrada del caché
   */
  delete(key) {
    return this.cache.delete(key)
  }

  /**
   * Limpiar todo el caché
   */
  clear() {
    this.cache.clear()
  }

  /**
   * Obtener estadísticas del caché
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys())
    }
  }

  /**
   * Eliminar elemento menos usado recientemente (LRU)
   */
  _evictLRU() {
    let oldestKey = null
    let oldestTime = Date.now()

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccess < oldestTime) {
        oldestTime = item.lastAccess
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }

  /**
   * Limpiar entradas expiradas
   */
  cleanup() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key)
      }
    }
  }
}

// Instancia singleton
const cacheService = new CacheService()

// Limpiar caché expirado cada 5 minutos
setInterval(() => {
  cacheService.cleanup()
}, 5 * 60 * 1000)

export default cacheService

/**
 * Hook para usar caché en componentes React
 */
export const useCache = (key, fetcher, options = {}) => {
  const { ttl, enabled = true } = options
  
  const getCachedData = () => {
    if (!enabled) return null
    return cacheService.get(key)
  }

  const setCachedData = (data) => {
    if (!enabled) return
    cacheService.set(key, data, ttl)
  }

  return {
    getCachedData,
    setCachedData,
    clearCache: () => cacheService.delete(key),
    hasCache: () => cacheService.has(key)
  }
}

/**
 * Decorador para funciones con caché automático
 */
export const withCache = (fn, keyGenerator, ttl = 5 * 60 * 1000) => {
  return async (...args) => {
    const key = keyGenerator(...args)
    
    // Intentar obtener del caché
    const cached = cacheService.get(key)
    if (cached) {
      return cached
    }

    // Ejecutar función y guardar resultado
    const result = await fn(...args)
    cacheService.set(key, result, ttl)
    
    return result
  }
}

/**
 * Caché específico para imágenes
 */
export class ImageCache {
  constructor() {
    this.cache = new Map()
    this.maxSize = 50 // Máximo 50 imágenes
  }

  async get(url) {
    if (this.cache.has(url)) {
      return this.cache.get(url)
    }

    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      
      // Evitar que el caché crezca demasiado
      if (this.cache.size >= this.maxSize) {
        const firstKey = this.cache.keys().next().value
        const oldUrl = this.cache.get(firstKey)
        URL.revokeObjectURL(oldUrl)
        this.cache.delete(firstKey)
      }

      this.cache.set(url, objectUrl)
      return objectUrl
    } catch (error) {
      console.error('Error caching image:', error)
      return url
    }
  }

  clear() {
    // Limpiar URLs de objeto para evitar memory leaks
    for (const objectUrl of this.cache.values()) {
      URL.revokeObjectURL(objectUrl)
    }
    this.cache.clear()
  }
}

export const imageCache = new ImageCache()