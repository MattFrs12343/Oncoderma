import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

const Logo = ({ className = 'h-10 w-auto', showText = true, textClassName = 'text-xl' }) => {
  const { theme } = useTheme()

  return (
    <div className="flex items-center space-x-3">
      <img 
        src={theme === 'light' ? '/img/OncoDerma-Logo.png' : '/img/DarckLogoOscuro.png'} 
        alt="OncoDerma" 
        className={`${className} logo-mobile-navbar`}
      />
      {showText && (
        <span className={`${textClassName} font-bold text-primary`}>
          OncoDerma
        </span>
      )}
    </div>
  )
}

export default Logo
