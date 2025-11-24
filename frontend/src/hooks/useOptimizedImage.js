import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook optimizado para manejo de imágenes con lazy loading y compresión
 */
export const useOptimizedImage = (src, options = {}) => {
  const {
    lazy = true,
    quality = 0.8,
    maxWidth = 1024,
    placeholder = null,
    onLoad = null,
    onError = null
  } = options

  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef(null)
  const observerRef = useRef(null)

  // Función para comprimir imagen si es necesario
  const compressImage = useCallback(async (file) => {
    if (!file || typeof file === 'string') return file

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(resolve, 'image/jpeg', quality)
      }

      img.src = typeof file === 'string' ? file : URL.createObjectURL(file)
    })
  }, [maxWidth, quality])

  // Función para cargar imagen
  const loadImage = useCallback(async () => {
    if (!src) return

    setIsLoading(true)
    setHasError(false)

    try {
      const processedSrc = await compressImage(src)
      const finalSrc = processedSrc instanceof Blob ? URL.createObjectURL(processedSrc) : processedSrc

      // Precargar imagen para verificar que se puede cargar
      const img = new Image()
      img.onload = () => {
        setImageSrc(finalSrc)
        setIsLoading(false)
        onLoad?.(finalSrc)
      }
      img.onerror = () => {
        setHasError(true)
        setIsLoading(false)
        onError?.(new Error('Failed to load image'))
      }
      img.src = finalSrc

    } catch (error) {
      setHasError(true)
      setIsLoading(false)
      onError?.(error)
    }
  }, [src, compressImage, onLoad, onError])

  // Configurar Intersection Observer para lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) {
      loadImage()
      return
    }

    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage()
              observerRef.current?.unobserve(entry.target)
            }
          })
        },
        {
          rootMargin: '50px' // Cargar imagen 50px antes de que sea visible
        }
      )

      observerRef.current.observe(imgRef.current)
    } else {
      // Fallback para navegadores sin soporte
      loadImage()
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [lazy, loadImage])

  // Cleanup de URLs de objeto
  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc)
      }
    }
  }, [imageSrc])

  return {
    imageSrc,
    isLoading,
    hasError,
    imgRef,
    reload: loadImage
  }
}

/**
 * Hook para precargar múltiples imágenes
 */
export const useImagePreloader = (imageUrls = []) => {
  const [loadedImages, setLoadedImages] = useState(new Set())
  const [isPreloading, setIsPreloading] = useState(false)

  const preloadImages = useCallback(async () => {
    if (imageUrls.length === 0) return

    setIsPreloading(true)
    const loaded = new Set()

    const promises = imageUrls.map((url) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          loaded.add(url)
          resolve(url)
        }
        img.onerror = () => resolve(null) // No fallar por una imagen
        img.src = url
      })
    })

    await Promise.allSettled(promises)
    setLoadedImages(loaded)
    setIsPreloading(false)
  }, [imageUrls])

  useEffect(() => {
    preloadImages()
  }, [preloadImages])

  return {
    loadedImages,
    isPreloading,
    preloadProgress: imageUrls.length > 0 ? loadedImages.size / imageUrls.length : 1
  }
}

export default useOptimizedImage