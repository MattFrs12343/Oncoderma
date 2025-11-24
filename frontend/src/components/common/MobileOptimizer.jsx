import { useEffect } from 'react'

/**
 * Componente que optimiza la experiencia móvil
 * - Detecta dispositivos móviles
 * - Ajusta el viewport dinámicamente
 * - Previene zoom no deseado
 * - Optimiza el scroll
 */
const MobileOptimizer = () => {
  useEffect(() => {
    // Detectar si es móvil
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const isSmallScreen = window.innerWidth < 768

    if (isMobile || isSmallScreen) {
      // Agregar clase al body para estilos específicos
      document.body.classList.add('mobile-device')

      // Prevenir zoom en inputs (iOS)
      const preventZoom = (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
          e.target.style.fontSize = '16px' // iOS no hace zoom si el font-size es >= 16px
        }
      }

      document.addEventListener('focus', preventZoom, true)

      // Optimizar scroll en iOS
      document.body.style.webkitOverflowScrolling = 'touch'
      document.body.style.overscrollBehavior = 'contain'

      // Prevenir pull-to-refresh en Chrome móvil
      let lastTouchY = 0
      const preventPullToRefresh = (e) => {
        const touchY = e.touches[0].clientY
        const touchYDelta = touchY - lastTouchY
        lastTouchY = touchY

        if (window.scrollY === 0 && touchYDelta > 0) {
          e.preventDefault()
        }
      }

      document.addEventListener('touchstart', (e) => {
        lastTouchY = e.touches[0].clientY
      })
      document.addEventListener('touchmove', preventPullToRefresh, { passive: false })

      // Ajustar altura del viewport para teclado móvil
      const adjustViewportHeight = () => {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
      }

      adjustViewportHeight()
      window.addEventListener('resize', adjustViewportHeight)
      window.addEventListener('orientationchange', adjustViewportHeight)

      // Cleanup
      return () => {
        document.body.classList.remove('mobile-device')
        document.removeEventListener('focus', preventZoom, true)
        document.removeEventListener('touchmove', preventPullToRefresh)
        window.removeEventListener('resize', adjustViewportHeight)
        window.removeEventListener('orientationchange', adjustViewportHeight)
      }
    }
  }, [])

  // Agregar estilos dinámicos para móvil
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      /* Usar altura de viewport personalizada */
      .mobile-device {
        height: calc(var(--vh, 1vh) * 100);
      }

      /* Prevenir zoom en inputs */
      .mobile-device input,
      .mobile-device select,
      .mobile-device textarea {
        font-size: 16px !important;
      }

      /* Mejorar scroll en móvil */
      .mobile-device {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior-y: contain;
      }

      /* Optimizar touch targets */
      .mobile-device button,
      .mobile-device a,
      .mobile-device input[type="button"],
      .mobile-device input[type="submit"] {
        min-height: 44px;
        min-width: 44px;
      }

      /* Prevenir selección de texto accidental */
      .mobile-device .card,
      .mobile-device .metric-card {
        -webkit-user-select: none;
        user-select: none;
      }

      /* Permitir selección en inputs y texto */
      .mobile-device input,
      .mobile-device textarea,
      .mobile-device p,
      .mobile-device span {
        -webkit-user-select: text;
        user-select: text;
      }

      /* Mejorar tap highlight */
      .mobile-device * {
        -webkit-tap-highlight-color: rgba(6, 182, 212, 0.2);
      }

      /* Optimizar animaciones en móvil */
      @media (max-width: 768px) {
        .mobile-device * {
          animation-duration: 0.3s !important;
          transition-duration: 0.2s !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null // Este componente no renderiza nada
}

export default MobileOptimizer
