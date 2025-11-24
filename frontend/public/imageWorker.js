// Web Worker para procesamiento de imágenes en background
self.onmessage = function(e) {
  const { type, data } = e.data
  
  switch (type) {
    case 'COMPRESS_IMAGE':
      compressImage(data)
      break
    case 'GENERATE_THUMBNAIL':
      generateThumbnail(data)
      break
    case 'ANALYZE_IMAGE_METADATA':
      analyzeImageMetadata(data)
      break
    default:
      self.postMessage({ type: 'ERROR', error: 'Unknown task type' })
  }
}

// Comprimir imagen
function compressImage({ imageData, maxWidth, maxHeight, quality }) {
  try {
    const canvas = new OffscreenCanvas(maxWidth, maxHeight)
    const ctx = canvas.getContext('2d')
    
    // Crear imagen desde ImageData
    const bitmap = createImageBitmap(imageData)
    
    bitmap.then(img => {
      // Calcular nuevas dimensiones
      let { width, height } = img
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }
      
      // Redimensionar canvas
      canvas.width = width
      canvas.height = height
      
      // Dibujar imagen
      ctx.drawImage(img, 0, 0, width, height)
      
      // Convertir a blob
      canvas.convertToBlob({ type: 'image/jpeg', quality })
        .then(blob => {
          self.postMessage({
            type: 'COMPRESS_COMPLETE',
            data: {
              blob,
              width,
              height,
              size: blob.size
            }
          })
        })
        .catch(error => {
          self.postMessage({
            type: 'ERROR',
            error: error.message
          })
        })
    })
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      error: error.message
    })
  }
}

// Generar thumbnail
function generateThumbnail({ imageData, size }) {
  try {
    const canvas = new OffscreenCanvas(size, size)
    const ctx = canvas.getContext('2d')
    
    createImageBitmap(imageData).then(img => {
      const { width, height } = img
      const minDimension = Math.min(width, height)
      const x = (width - minDimension) / 2
      const y = (height - minDimension) / 2
      
      // Dibujar thumbnail cuadrado
      ctx.drawImage(
        img,
        x, y, minDimension, minDimension,
        0, 0, size, size
      )
      
      canvas.convertToBlob({ type: 'image/jpeg', quality: 0.7 })
        .then(blob => {
          self.postMessage({
            type: 'THUMBNAIL_COMPLETE',
            data: { blob }
          })
        })
    })
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      error: error.message
    })
  }
}

// Analizar metadatos de imagen
function analyzeImageMetadata({ imageData }) {
  try {
    createImageBitmap(imageData).then(img => {
      const metadata = {
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
        megapixels: (img.width * img.height / 1000000).toFixed(2)
      }
      
      self.postMessage({
        type: 'METADATA_COMPLETE',
        data: metadata
      })
    })
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      error: error.message
    })
  }
}