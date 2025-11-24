import { useCallback } from 'react'

export const useImageOptimization = () => {
  
  // Comprimir imagen manteniendo calidad
  const compressImage = useCallback((file, maxWidth = 1920, maxHeight = 1920, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspect ratio
        let { width, height } = img
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }
        
        // Configurar canvas
        canvas.width = width
        canvas.height = height
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convertir a blob
        canvas.toBlob(
          (blob) => {
            // Crear nuevo archivo con el blob comprimido
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            
            resolve({
              file: compressedFile,
              originalSize: file.size,
              compressedSize: blob.size,
              compressionRatio: ((file.size - blob.size) / file.size * 100).toFixed(1),
              dimensions: { width, height }
            })
          },
          file.type,
          quality
        )
      }
      
      img.src = URL.createObjectURL(file)
    })
  }, [])
  
  // Optimizar imagen automáticamente
  const optimizeImage = useCallback(async (file) => {
    // Si el archivo es pequeño, no comprimir
    if (file.size < 500 * 1024) { // 500KB
      return {
        file,
        originalSize: file.size,
        compressedSize: file.size,
        compressionRatio: 0,
        optimized: false
      }
    }
    
    try {
      const result = await compressImage(file)
      return {
        ...result,
        optimized: true
      }
    } catch (error) {
      console.error('Error optimizando imagen:', error)
      return {
        file,
        originalSize: file.size,
        compressedSize: file.size,
        compressionRatio: 0,
        optimized: false,
        error: error.message
      }
    }
  }, [compressImage])
  
  // Generar thumbnail
  const generateThumbnail = useCallback((file, size = 150) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Crear thumbnail cuadrado
        canvas.width = size
        canvas.height = size
        
        const { width, height } = img
        const minDimension = Math.min(width, height)
        const x = (width - minDimension) / 2
        const y = (height - minDimension) / 2
        
        // Dibujar imagen centrada y recortada
        ctx.drawImage(
          img, 
          x, y, minDimension, minDimension,
          0, 0, size, size
        )
        
        // Convertir a data URL
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7)
        resolve(thumbnailUrl)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }, [])
  
  // Validar y obtener metadatos de imagen
  const getImageMetadata = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        const metadata = {
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height,
          megapixels: (img.width * img.height / 1000000).toFixed(2),
          fileSize: file.size,
          fileSizeMB: (file.size / 1024 / 1024).toFixed(2),
          type: file.type,
          name: file.name,
          lastModified: new Date(file.lastModified)
        }
        
        resolve(metadata)
      }
      
      img.onerror = () => {
        reject(new Error('No se pudo cargar la imagen'))
      }
      
      img.src = URL.createObjectURL(file)
    })
  }, [])
  
  return {
    compressImage,
    optimizeImage,
    generateThumbnail,
    getImageMetadata
  }
}