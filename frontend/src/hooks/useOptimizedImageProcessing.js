import { useState, useCallback } from 'react'
import { useWebWorker } from './useWebWorker'

export const useOptimizedImageProcessing = () => {
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const { executeTask, isSupported } = useWebWorker('/imageWorker.js')
  
  // Procesar imagen con Web Worker si está disponible
  const processImageWithWorker = useCallback(async (file, options = {}) => {
    if (!isSupported) {
      throw new Error('Web Workers not supported')
    }
    
    try {
      setProcessing(true)
      setProgress(10)
      
      // Convertir archivo a ImageData
      const imageData = await fileToImageData(file)
      setProgress(30)
      
      // Procesar en Web Worker
      const result = await executeTask('COMPRESS_IMAGE', {
        imageData,
        maxWidth: options.maxWidth || 1920,
        maxHeight: options.maxHeight || 1920,
        quality: options.quality || 0.8
      })
      
      setProgress(80)
      
      // Crear nuevo archivo desde el blob
      const processedFile = new File([result.data.blob], file.name, {
        type: 'image/jpeg',
        lastModified: Date.now()
      })
      
      setProgress(100)
      
      return {
        file: processedFile,
        originalSize: file.size,
        processedSize: result.data.blob.size,
        dimensions: {
          width: result.data.width,
          height: result.data.height
        },
        compressionRatio: ((file.size - result.data.blob.size) / file.size * 100).toFixed(1)
      }
      
    } finally {
      setProcessing(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }, [executeTask, isSupported])
  
  // Fallback para navegadores sin Web Workers
  const processImageFallback = useCallback(async (file, options = {}) => {
    return new Promise((resolve) => {
      setProcessing(true)
      setProgress(10)
      
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        setProgress(40)
        
        // Calcular dimensiones
        let { width, height } = img
        const maxWidth = options.maxWidth || 1920
        const maxHeight = options.maxHeight || 1920
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }
        
        canvas.width = width
        canvas.height = height
        
        setProgress(60)
        
        // Dibujar imagen
        ctx.drawImage(img, 0, 0, width, height)
        
        setProgress(80)
        
        // Convertir a blob
        canvas.toBlob((blob) => {
          const processedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          })
          
          setProgress(100)
          
          resolve({
            file: processedFile,
            originalSize: file.size,
            processedSize: blob.size,
            dimensions: { width, height },
            compressionRatio: ((file.size - blob.size) / file.size * 100).toFixed(1)
          })
          
          setProcessing(false)
          setTimeout(() => setProgress(0), 1000)
        }, 'image/jpeg', options.quality || 0.8)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }, [])
  
  // Función principal de procesamiento
  const processImage = useCallback(async (file, options = {}) => {
    try {
      if (isSupported) {
        return await processImageWithWorker(file, options)
      } else {
        return await processImageFallback(file, options)
      }
    } catch (error) {
      console.warn('Error en procesamiento con Worker, usando fallback:', error)
      return await processImageFallback(file, options)
    }
  }, [processImageWithWorker, processImageFallback, isSupported])
  
  // Generar thumbnail optimizado
  const generateThumbnail = useCallback(async (file, size = 150) => {
    if (isSupported) {
      try {
        const imageData = await fileToImageData(file)
        const result = await executeTask('GENERATE_THUMBNAIL', {
          imageData,
          size
        })
        
        return URL.createObjectURL(result.data.blob)
      } catch (error) {
        console.warn('Error generando thumbnail con Worker:', error)
      }
    }
    
    // Fallback
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        canvas.width = size
        canvas.height = size
        
        const { width, height } = img
        const minDimension = Math.min(width, height)
        const x = (width - minDimension) / 2
        const y = (height - minDimension) / 2
        
        ctx.drawImage(
          img,
          x, y, minDimension, minDimension,
          0, 0, size, size
        )
        
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      
      img.src = URL.createObjectURL(file)
    })
  }, [executeTask, isSupported])
  
  return {
    processImage,
    generateThumbnail,
    processing,
    progress,
    isWorkerSupported: isSupported
  }
}

// Función auxiliar para convertir archivo a ImageData
async function fileToImageData(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      const imageData = ctx.getImageData(0, 0, img.width, img.height)
      resolve(imageData)
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}