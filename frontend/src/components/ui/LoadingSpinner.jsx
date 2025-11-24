const LoadingSpinner = ({ 
  size = 'lg', 
  message = 'Cargando...', 
  fullScreen = true,
  className = '' 
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  // Detectar si es móvil
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* Spinner optimizado para móvil */}
      <div className="relative">
        <div 
          className={`
            ${sizes[size]} 
            border-4 
            border-gray-200 
            dark:border-gray-700
            border-t-blue-600 
            dark:border-t-blue-500
            rounded-full 
            animate-spin
          `}
          style={isMobile ? { 
            animationDuration: '0.8s',
            willChange: 'transform'
          } : {}}
        />
        {/* Spinner secundario solo en desktop */}
        {!isMobile && (
          <div 
            className={`
              absolute inset-0
              ${sizes[size]} 
              border-4 
              border-transparent 
              border-r-cyan-500 
              rounded-full 
              animate-spin
            `}
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          />
        )}
      </div>
      
      {/* Mensaje */}
      {message && (
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base">{message}</p>
          {/* Puntos animados solo en desktop */}
          {!isMobile && (
            <div className="flex justify-center mt-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {spinnerContent}
      </div>
    )
  }

  return spinnerContent
}

export default LoadingSpinner