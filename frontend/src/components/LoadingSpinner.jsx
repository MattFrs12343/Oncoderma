import React from 'react'

const LoadingSpinner = ({ size = 'large', message = 'Cargando...' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-secondary rounded-full animate-spin`}></div>
      {message && (
        <p className="mt-4 text-primary font-medium">{message}</p>
      )}
    </div>
  )
}

export default LoadingSpinner
