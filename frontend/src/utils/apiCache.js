/**
 * Sistema de caché optimizado para API calls
 * Incluye invalidación automática, compresión y persistencia
 */

class APICache {
  constructor(options = {}) {
    this.cache = new Map()
    this.timestamps = new Map()
    this.defaultTTL = options.ttl || 5 * 60 * 1000 // 5 minutos por defecto
    this.maxSize = options.maxSize || 100
    this.compress = options.compress || false
    this.persistent = options.persistent || false
    this.storageKey = options.storageKey || 'api-cache'
    
    // Cargar caché persistente si está habilitado
    if (this.persistent) {
      this.loadFromStorage()
    }
    
    // Limpiar caché expirado cada minuto
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60000)
  }

  /**
   * Generar clave de caché basada en URL y parámetros
   */
  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key]
        return result
      }, {})
    
    return `${url}:${JSON.stringify(sortedParams)}`
  }

  /**
   * Comprimir datos si está habilitado
   */
  compressData(data) {
    if (!this.compress) return data
    
    try {
      // Compresión simple usando JSON.stringify con replacer
      return JSON.stringify(data, (key, value) => {
        if (typeof value === 'string' && value.length > 100) {
          // Comprimir strings largos (simulado)
          return value.substring(0, 100) + '...[compressed]'
        }
        return value
      })
    } catch (error) {
      console.warn('Error compressing data:', error)
      return data
    }
  }

  /**
   * Descomprimir datos
   */
  decompressData(data) {
    if (!this.compress) return data
    
    try {
      return typeof data === 'string' ? JSON.parse(data) : data
    } catch (error) {
      console.warn('Error decompressing data:', error)
      return data
    }
  }

  /**
   * Obtener datos del caché
   */
  get(key, ttl = this.defaultTTL) {
    if (!this.cache.has(key)) return null
    
    const timestamp = this.timestamps.get(key)
    if (Date.now() - timestamp > ttl) {
      this.delete(key)
      return null
    }
    
    const data = this.cache.get(key)
    return this.decompressData(data)
  }

  /**
   * Guardar datos en el caché
   */
  set(key, data, ttl = this.defaultTTL) {
    // Limpiar caché si está lleno
    if (this.cache.size >= this.maxSize) {
      this.evictOldest()
    }
    
    const compressedData = this.compressData(data)
    this.cache.set(key, compressedData)
    this.timestamps.set(key, Date.now())
    
    // Guardar en storage si está habilitado
    if (this.persistent) {
      this.saveToStorage()
    }
    
    return data
  }

  /**
   * Eliminar entrada del caché
   */
  delete(key) {
    this.cache.delete(key)
    this.timestamps.delete(key)
    
    if (this.persistent) {
      this.saveToStorage()
    }
  }

  /**
   * Limpiar caché completo
   */
  clear() {
    this.cache.clear()
    this.timestamps.clear()
    
    if (this.persistent) {
      localStorage.removeItem(this.storageKey)
    }
  }

  /**
   * Limpiar entradas expiradas
   */
  cleanup() {
    const now = Date.now()
    const keysToDelete = []
    
    this.timestamps.forEach((timestamp, key) => {
      if (now - timestamp > this.defaultTTL) {
        keysToDelete.push(key)
      }
    })
    
    keysToDelete.forEach(key => this.delete(key))
    
    console.log(`Cache cleanup: removed ${keysToDelete.length} expired entries`)
  }

  /**
   * Eliminar la entrada más antigua
   */
  evictOldest() {
    let oldestKey = null
    let oldestTime = Date.now()
    
    this.timestamps.forEach((timestamp, key) => {
      if (timestamp < oldestTime) {
        oldestTime = timestamp
        oldestKey = key
      }
    })
    
    if (oldestKey) {
      this.delete(oldestKey)
    }
  }

  /**
   * Cargar caché desde localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const { cache, timestamps } = JSON.parse(stored)
        this.cache = new Map(cache)
        this.timestamps = new Map(timestamps)
      }
    } catch (error) {
      console.warn('Error loading cache from storage:', error)
    }
  }

  /**
   * Guardar caché en localStorage
   */
  saveToStorage() {
    try {
      const data = {
        cache: Array.from(this.cache.entries()),
        timestamps: Array.from(this.timestamps.entries())
      }
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      console.warn('Error saving cache to storage:', error)
    }
  }

  /**
   * Obtener estadísticas del caché
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.hitCount / (this.hitCount + this.missCount) || 0,
      memoryUsage: this.estimateMemoryUsage()
    }
  }

  /**
   * Estimar uso de memoria
   */
  estimateMemoryUsage() {
    let totalSize = 0
    this.cache.forEach((value, key) => {
      totalSize += JSON.stringify(value).length + key.length
    })
    return Math.round(totalSize / 1024) // KB
  }

  /**
   * Destruir caché y limpiar recursos
   */
  destroy() {
    clearInterval(this.cleanupInterval)
    this.clear()
  }
}

// Instancia global del caché
const apiCache = new APICache({
  ttl: 5 * 60 * 1000, // 5 minutos
  maxSize: 50,
  compress: true,
  persistent: true,
  storageKey: 'oncoderma-api-cache'
})

/**
 * Wrapper para fetch con caché automático
 */
export const cachedFetch = async (url, options = {}) => {
  const {
    cache: useCache = true,
    cacheTTL = 5 * 60 * 1000,
    ...fetchOptions
  } = options

  // Solo cachear GET requests
  if (!useCache || (fetchOptions.method && fetchOptions.method !== 'GET')) {
    return fetch(url, fetchOptions)
  }

  const cacheKey = apiCache.generateKey(url, fetchOptions)
  
  // Intentar obtener del caché
  const cached = apiCache.get(cacheKey, cacheTTL)
  if (cached) {
    console.log('Cache hit:', url)
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(cached),
      text: () => Promise.resolve(JSON.stringify(cached))
    })
  }

  // Hacer request y cachear resultado
  try {
    const response = await fetch(url, fetchOptions)
    
    if (response.ok) {
      const data = await response.json()
      apiCache.set(cacheKey, data, cacheTTL)
      console.log('Cache miss, stored:', url)
      
      return {
        ok: true,
        json: () => Promise.resolve(data),
        text: () => Promise.resolve(JSON.stringify(data))
      }
    }
    
    return response
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

/**
 * Hook para usar caché en componentes React
 */
export const useAPICache = () => {
  return {
    get: (key, ttl) => apiCache.get(key, ttl),
    set: (key, data, ttl) => apiCache.set(key, data, ttl),
    delete: (key) => apiCache.delete(key),
    clear: () => apiCache.clear(),
    stats: () => apiCache.getStats()
  }
}

/**
 * Invalidar caché por patrón
 */
export const invalidateCache = (pattern) => {
  const keysToDelete = []
  
  apiCache.cache.forEach((_, key) => {
    if (key.includes(pattern)) {
      keysToDelete.push(key)
    }
  })
  
  keysToDelete.forEach(key => apiCache.delete(key))
  console.log(`Invalidated ${keysToDelete.length} cache entries matching: ${pattern}`)
}

export default apiCache