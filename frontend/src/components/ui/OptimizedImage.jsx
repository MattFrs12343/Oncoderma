import { memo, forwardRef } from 'react'
import { useOptimizedImage } from '../../hooks/useOptimizedImage'

/**
 * Componente de imagen optimizado con lazy loading, compresión y fallbacks
 */
const OptimizedImage = memo(forwardRef(({
  src,
  alt = '',
  className = '',
  lazy = true,
  quality = 0.8,
  maxWidth = 1024,
  placeholder = null,
  fallback = null,
  onLoad = null,
  onError = null,
  ...props
}, ref) => {
  const {
    imageSrc,
    isLoading,
    hasError,
    imgRef,
    reload
  } = useOptimizedImage(src, {
    lazy,
    quality,
    maxWidth,
    placeholder,
    onLoad,
    onError
  })

  // Combinar refs
  const combinedRef = (node) => {
    imgRef.current = node
    if (ref) {
      if (typeof ref === 'function') {
        ref(node)
      } else {
        ref.current = node
      }
    }
  }

  // Mostrar placeholder mientras carga
  if (isLoading && placeholder) {
    return (
      <div 
        className={`${className} animate-pulse bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}
        {...props}
      >
        {typeof placeholder === 'string' ? (
          <span className="text-gray-400 text-sm">{placeholder}</span>
        ) : (
          placeholder
        )}
      </div>
    )
  }

  // Mostrar fallback en caso de error
  if (hasError && fallback) {
    return (
      <div 
        className={`${className} bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600`}
        {...props}
      >
        {typeof fallback === 'string' ? (
          <div className="text-center p-4">
            <div className="text-gray-400 mb-2">⚠️</div>
            <span className="text-gray-500 text-sm">{fallback}</span>
            <button 
              onClick={reload}
              className="block mt-2 text-xs text-blue-500 hover:text-blue-700 underline"
            >
              Reintentar
            </button>
          </div>
        ) : (
          fallback
        )}
      </div>
    )
  }

  return (
    <img
      ref={combinedRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
      {...props}
      onLoad={(e) => {
        onLoad?.(e)
      }}
      onError={(e) => {
        onError?.(e)
      }}
    />
  )
}))

OptimizedImage.displayName = 'OptimizedImage'

/**
 * Componente de imagen con skeleton loader
 */
export const ImageWithSkeleton = memo(({ 
  src, 
  alt, 
  className = '',
  skeletonClassName = '',
  ...props 
}) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      placeholder={
        <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${skeletonClassName}`}>
          <div className="flex items-center justify-center h-full">
            <svg 
              className="w-8 h-8 text-gray-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>
      }
      fallback="Error al cargar imagen"
      {...props}
    />
  )
})

ImageWithSkeleton.displayName = 'ImageWithSkeleton'

/**
 * Componente de avatar optimizado
 */
export const OptimizedAvatar = memo(({ 
  src, 
  alt, 
  size = 'md',
  fallbackText = '',
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg'
  }

  const initials = fallbackText
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      quality={0.9}
      maxWidth={200}
      placeholder={
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold`}>
          {initials || '?'}
        </div>
      }
      fallback={
        <div className={`${sizeClasses[size]} rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold`}>
          {initials || '?'}
        </div>
      }
      {...props}
    />
  )
})

OptimizedAvatar.displayName = 'OptimizedAvatar'

export default OptimizedImage