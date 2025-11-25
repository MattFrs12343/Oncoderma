const Card = ({ 
  children, 
  className = '', 
  onClick, 
  gradient,
  icon,
  title,
  description 
}) => {
  const baseClasses = `
    bg-white dark:bg-slate-800
    rounded-2xl
    p-6
    border border-gray-200 dark:border-slate-700
    shadow-md
    transition-all duration-200
    hover:shadow-xl hover:-translate-y-1
    hover:border-cyan-500 dark:hover:border-cyan-500
  `
  
  const gradientClasses = gradient ? `bg-gradient-to-br ${gradient}` : ''
  const clickableClasses = onClick ? 'cursor-pointer' : ''

  if (icon && title) {
    return (
      <div 
        className={`${baseClasses} ${gradientClasses} ${clickableClasses} ${className}`}
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
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`${baseClasses} ${gradientClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card
