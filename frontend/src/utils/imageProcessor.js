/**
 * Utilidades para procesamiento de imágenes usando Web Worker
 */

class ImageProcessor {
  constructor() {
    this.worker = null
    this.initWorker()
  }

  initWorker() {
    // Crear Web Worker desde el archivo público
    try {
      this.worker = new Worker('/imageWorker.js')
    } catch (error) {
      console.error('Error al inicializar Web Worker:', error)
    }
  }

  /**
   * Comprimir imagen
   */
  compressImage(file, maxWidth = 1024, maxHeight = 1024, quality = 0.8) {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Web Worker no disponible'))
        return
      }

      const reader = new FileReader()
      
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          this.worker.postMessage({
            type: 'COMPRESS_IMAGE',
            data: {
              imageData: img,
              maxWidth,
              maxHeight,
              quality,
            },
          })

          this.worker.onmessage = (event) => {
            const { type, data, error } = event.data
            
            if (type === 'COMPRESS_COMPLETE') {
              resolve(data)
            } else if (type === 'ERROR') {
              reject(new Error(error))
            }
          }
        }
        
        img.onerror = () => reject(new Error('Error al cargar la imagen'))
        img.src = e.target.result
      }
      
      reader.onerror = () => reject(new Error('Error al leer el archivo'))
      reader.readAsDataURL(file)
    })
  }

  /**
   * Generar thumbnail
   */
  generateThumbnail(file, size = 200) {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Web Worker no disponible'))
        return
      }

      const reader = new FileReader()
      
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          this.worker.postMessage({
            type: 'GENERATE_THUMBNAIL',
            data: {
              imageData: img,
              size,
            },
          })

          this.worker.onmessage = (event) => {
            const { type, data, error } = event.data
            
            if (type === 'THUMBNAIL_COMPLETE') {
              resolve(data)
            } else if (type === 'ERROR') {
              reject(new Error(error))
            }
          }
        }
        
        img.onerror = () => reject(new Error('Error al cargar la imagen'))
        img.src = e.target.result
      }
      
      reader.onerror = () => reject(new Error('Error al leer el archivo'))
      reader.readAsDataURL(file)
    })
  }

  /**
   * Analizar metadatos de imagen
   */
  analyzeMetadata(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const metadata = {
            width: img.width,
            height: img.height,
            aspectRatio: (img.width / img.height).toFixed(2),
            megapixels: ((img.width * img.height) / 1000000).toFixed(2),
            size: file.size,
            type: file.type,
            name: file.name,
          }
          resolve(metadata)
        }
        
        img.onerror = () => reject(new Error('Error al cargar la imagen'))
        img.src = e.target.result
      }
      
      reader.onerror = () => reject(new Error('Error al leer el archivo'))
      reader.readAsDataURL(file)
    })
  }

  /**
   * Validar archivo de imagen
   */
  validateImage(file, maxSizeMB = 10) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    const maxSize = maxSizeMB * 1024 * 1024 // Convertir a bytes

    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Formato de imagen no válido. Use JPEG o PNG.',
      }
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `La imagen es demasiado grande. Máximo ${maxSizeMB}MB.`,
      }
    }

    return { valid: true }
  }

  /**
   * Terminar Web Worker
   */
  terminate() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
  }
}

export const imageProcessor = new ImageProcessor()
