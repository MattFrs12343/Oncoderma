import React from 'react'

const Card = ({ 
  children, 
  className = '', 
  onClick, 
  gradient,
  icon,
  title,
  description 
}) => {
  const baseClasses = 'card'
  const gradientClasses = gradient ? `bg-gradient-to-br ${gradient}` : ''

  if (icon && title) {
    // Card con icono y título (para features)
    return (
      <div 
        className={`${baseClasses} ${gradientClasses} ${className}`}
        onClick={onClick}
      >
        <div className="flex items-start space-x-4">
          {icon && (
            <div className="flex-shrink-0">
              {typeof icon === 'string' ? (
                <span className="text-4xl">{icon}</span>
              ) : (
                icon
              )}
            </div>
          )}
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-primary mb-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-gray-600">
                {description}
              </p>
            )}
            {children}
          </div>
        </div>
      </div>
    )
  }

  // Card genérico
  return (
    <div 
      className={`${baseClasses} ${gradientClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card
