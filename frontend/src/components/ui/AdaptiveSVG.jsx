import { useTheme } from '../../contexts/ThemeContext'

const AdaptiveSVG = ({ src, alt, className = "w-full h-auto", darkFilter = true }) => {
  const { isDark } = useTheme()

  if (!darkFilter) {
    // Si no necesita filtro para modo oscuro, mostrar normal
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={(e) => {
          e.target.style.display = 'none'
        }}
      />
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* SVG para tema claro */}
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${isDark ? 'opacity-0 absolute inset-0' : 'opacity-100'} ${className}`}
        onError={(e) => {
          e.target.style.display = 'none'
        }}
      />
      
      {/* SVG para tema oscuro - con filtro */}
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0 absolute inset-0'} ${className}`}
        style={{
          filter: isDark ? 'invert(1) brightness(0.8) contrast(1.2) hue-rotate(180deg)' : 'none'
        }}
        onError={(e) => {
          e.target.style.display = 'none'
        }}
      />
    </div>
  )
}

export default AdaptiveSVG