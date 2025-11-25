const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
  size = 'medium'
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-300 inline-flex items-center justify-center'
  
  const variantClasses = {
    primary: `
      bg-blue-800 dark:bg-blue-600
      text-white
      hover:bg-slate-900 dark:hover:bg-blue-700
      shadow-md hover:shadow-lg
      hover:-translate-y-0.5
    `,
    secondary: `
      bg-cyan-500 dark:bg-cyan-600
      text-white
      hover:bg-cyan-600 dark:hover:bg-cyan-700
      shadow-md hover:shadow-lg
      hover:-translate-y-0.5
    `,
    outline: `
      border-2 border-blue-800 dark:border-blue-600
      text-blue-800 dark:text-blue-600
      hover:bg-blue-800 dark:hover:bg-blue-600
      hover:text-white
    `,
    danger: `
      bg-red-600 dark:bg-red-700
      text-white
      hover:bg-red-700 dark:hover:bg-red-800
    `,
    ghost: `
      text-blue-800 dark:text-blue-600
      hover:bg-blue-50 dark:hover:bg-slate-800
    `,
  }

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  }

  const widthClass = fullWidth ? 'w-full' : ''
  const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${disabledClass}
        ${className}
      `}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}

export default Button
