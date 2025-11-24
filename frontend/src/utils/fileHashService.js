/**
 * FileHashService
 * 
 * Servicio robusto para generar hashes de archivos con fallback automático.
 * Soporta múltiples métodos de hash para garantizar compatibilidad en diferentes
 * contextos de navegador (HTTP/HTTPS, con/sin Web Crypto API).
 */

class FileHashService {
  constructor() {
    // Cachear resultado de disponibilidad de Web Crypto
    this._webCryptoAvailable = null
  }

  /**
   * Verifica si Web Crypto API está disponible en el navegador
   * @returns {boolean} true si crypto.subtle está disponible
   */
  isWebCryptoAvailable() {
    if (this._webCryptoAvailable === null) {
      this._webCryptoAvailable = 
        typeof crypto !== 'undefined' && 
        typeof crypto.subtle !== 'undefined' &&
        typeof crypto.subtle.digest === 'function'
    }
    return this._webCryptoAvailable
  }

  /**
   * Genera hash usando Web Crypto API (SHA-256)
   * @param {File} file - Archivo a hashear
   * @returns {Promise<string>} Hash hexadecimal
   * @throws {Error} Si Web Crypto no está disponible o falla
   */
  async generateCryptoHash(file) {
    if (!this.isWebCryptoAvailable()) {
      throw new Error('Web Crypto API no está disponible')
    }

    try {
      console.log('[FileHash] Generando hash con Web Crypto API (SHA-256)...')
      
      const buffer = await file.arrayBuffer()
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      
      console.log(`[FileHash] Hash SHA-256 generado: ${hash.substring(0, 16)}...`)
      return hash
    } catch (error) {
      console.error('[FileHash] Error en Web Crypto API:', error)
      throw error
    }
  }

  /**
   * Genera hash simple basado en propiedades del archivo y muestras de bytes
   * @param {File} file - Archivo a hashear
   * @returns {Promise<string>} Hash simple
   */
  async generateSimpleHash(file) {
    try {
      console.log('[FileHash] Generando hash simple basado en propiedades del archivo...')
      
      // Propiedades básicas del archivo
      const props = `${file.name}-${file.size}-${file.type}-${file.lastModified}`
      
      // Leer muestras de bytes del inicio y final del archivo
      const sampleSize = Math.min(1024, file.size) // 1KB o menos
      const startBlob = file.slice(0, sampleSize)
      const endBlob = file.slice(-sampleSize)
      
      // Leer las muestras
      const startBytes = await this._readBlobAsText(startBlob)
      const endBytes = await this._readBlobAsText(endBlob)
      
      // Combinar todo para el hash
      const combined = props + startBytes + endBytes
      
      // Generar hash usando algoritmo djb2
      const hash = this._djb2Hash(combined)
      
      console.log(`[FileHash] Hash simple generado: ${hash.substring(0, 16)}...`)
      return hash
    } catch (error) {
      console.error('[FileHash] Error en hash simple:', error)
      throw error
    }
  }

  /**
   * Genera hash basado solo en metadatos del archivo (último recurso)
   * @param {File} file - Archivo a hashear
   * @returns {string} Hash de metadatos
   */
  generateMetadataHash(file) {
    console.log('[FileHash] Generando hash de metadatos (fallback final)...')
    
    const metadata = `${file.name}-${file.size}-${file.type}-${file.lastModified}-${Date.now()}`
    const hash = this._djb2Hash(metadata)
    
    console.log(`[FileHash] Hash de metadatos generado: ${hash.substring(0, 16)}...`)
    return hash
  }

  /**
   * Genera hash con fallback automático
   * Intenta Web Crypto → Simple Hash → Metadata Hash
   * @param {File} file - Archivo a hashear
   * @returns {Promise<{hash: string, method: string}>} Hash y método usado
   */
  async generateHash(file) {
    if (!file) {
      throw new Error('No se proporcionó un archivo para hashear')
    }

    console.log(`[FileHash] Iniciando generación de hash para: ${file.name} (${file.size} bytes)`)

    // Intentar Web Crypto API primero
    if (this.isWebCryptoAvailable()) {
      try {
        const hash = await this.generateCryptoHash(file)
        console.log('[FileHash] ✅ Método usado: Web Crypto API (SHA-256)')
        return { hash, method: 'crypto' }
      } catch (cryptoError) {
        console.warn('[FileHash] ⚠️ Web Crypto falló, usando fallback:', cryptoError.message)
      }
    } else {
      console.log('[FileHash] ℹ️ Web Crypto API no disponible (probablemente HTTP), usando fallback')
    }

    // Fallback a hash simple
    try {
      const hash = await this.generateSimpleHash(file)
      console.log('[FileHash] ✅ Método usado: Simple Hash (propiedades + muestras)')
      return { hash, method: 'simple' }
    } catch (simpleError) {
      console.warn('[FileHash] ⚠️ Hash simple falló, usando último fallback:', simpleError.message)
    }

    // Último recurso: hash de metadatos
    try {
      const hash = this.generateMetadataHash(file)
      console.log('[FileHash] ✅ Método usado: Metadata Hash (solo propiedades)')
      return { hash, method: 'metadata' }
    } catch (metadataError) {
      console.error('[FileHash] ❌ Todos los métodos de hash fallaron:', metadataError)
      throw new Error('No se pudo generar hash del archivo')
    }
  }

  /**
   * Lee un Blob como texto para obtener muestra de bytes
   * @private
   * @param {Blob} blob - Blob a leer
   * @returns {Promise<string>} Contenido como string
   */
  _readBlobAsText(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = () => {
        resolve(reader.result)
      }
      
      reader.onerror = () => {
        reject(new Error('Error leyendo blob'))
      }
      
      reader.readAsText(blob)
    })
  }

  /**
   * Algoritmo de hash djb2 para strings
   * @private
   * @param {string} str - String a hashear
   * @returns {string} Hash hexadecimal
   */
  _djb2Hash(str) {
    let hash = 5381
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) + hash) + char // hash * 33 + char
      hash = hash & hash // Convertir a 32bit integer
    }
    
    // Convertir a hexadecimal positivo y pad a 16 caracteres
    const hexHash = (hash >>> 0).toString(16).padStart(16, '0')
    return hexHash
  }

  /**
   * Obtiene información sobre las capacidades del navegador
   * @returns {Object} Información de capacidades
   */
  getCapabilities() {
    return {
      webCryptoAvailable: this.isWebCryptoAvailable(),
      fileReaderAvailable: typeof FileReader !== 'undefined',
      arrayBufferAvailable: typeof ArrayBuffer !== 'undefined',
      recommendedMethod: this.isWebCryptoAvailable() ? 'crypto' : 'simple'
    }
  }
}

// Exportar instancia única del servicio
export const fileHashService = new FileHashService()

// También exportar la clase por si se necesita crear instancias personalizadas
export default FileHashService
