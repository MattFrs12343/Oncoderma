import { useTheme } from '../../contexts/ThemeContext'

const AdaptiveLogo = ({ className = "h-16 w-auto", alt = "OncoDerma" }) => {
  const { isDark } = useTheme()

  // Determinar qué logo usar basado en el tema
  const logoSrc = isDark ? "/img/DarckLogoOscuro.png" : "/img/OncoDerma-Logo.png"

  return (
    <div className={`relative ${className}`}>
      <img
        src={logoSrc}
        alt={alt}
        className={`transition-all duration-300 ${className}`}
        onError={(e) => {
          // Solo logear errores, no éxitos
          console.error(`Error cargando logo: ${logoSrc}`)
          // Si DarckLogoOscuro.png falla, usar el logo original con filtro
          if (isDark && logoSrc.includes('DarckLogoOscuro')) {
            e.target.src = '/img/OncoDerma-Logo.png'
            e.target.style.filter = 'brightness(0) invert(1) brightness(0.95) contrast(1.1)'
          }
        }}
      />
    </div>
  )
}

export default AdaptiveLogo