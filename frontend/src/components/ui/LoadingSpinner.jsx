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

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
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
        />
      </div>
      
      {message && (
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base">
            {message}
          </p>
        </div>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F3] dark:bg-[#0c1220]">
        {spinnerContent}
      </div>
    )
  }

  return spinnerContent
}

export default LoadingSpinner
