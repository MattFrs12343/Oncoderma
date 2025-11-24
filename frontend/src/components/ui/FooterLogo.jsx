import { useTheme } from '../../contexts/ThemeContext'

const FooterLogo = ({ className = "h-12 w-auto", alt = "OncoDerma" }) => {
  const { isDark } = useTheme()

  // Solo en el footer usamos el logo oscuro en modo dark
  const logoSrc = isDark ? "/img/DarckLogoOscuro.png" : "/img/OncoDerma-Logo.png"

  return (
    <div className={`relative ${className}`}>
      <img
        src={logoSrc}
        alt={alt}
        className={`transition-all duration-300 ${className}`}
        onError={(e) => {
          // Solo logear errores, no éxitos
          console.error(`Error cargando logo del footer: ${logoSrc}`)
          // Fallback al logo original si el oscuro falla
          e.target.src = '/img/OncoDerma-Logo.png'
        }}
      />
    </div>
  )
}

export default FooterLogo