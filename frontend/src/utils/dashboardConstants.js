// Estados del dashboard
export const DASHBOARD_STATES = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  EMPTY: 'empty'
}

// Mapeo de nombres técnicos a nombres simples
export const SIMPLE_NAMES = {
  'mel': 'Melanoma',
  'nv': 'Lunar común',
  'bcc': 'Carcinoma basal',
  'akiec': 'Queratosis actínica',
  'bkl': 'Queratosis seborreica',
  'df': 'Dermatofibroma',
  'vasc': 'Lesión vascular'
}

// Mapeo de niveles de riesgo
export const RISK_MAPPING = {
  'high': {
    level: 'urgente',
    message: 'Consulta dermatológica prioritaria recomendada',
    timeframe: '1-2 semanas',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA',
    icon: '🚨'
  },
  'medium': {
    level: 'atencion',
    message: 'Consulta dermatológica recomendada',
    timeframe: '2-4 semanas',
    color: '#C2410C',
    bgColor: '#FFFBEB',
    borderColor: '#FED7AA',
    icon: '⚠️'
  },
  'low': {
    level: 'tranquilo',
    message: 'Resultado favorable, mantén observación regular',
    timeframe: 'Chequeos de rutina',
    color: '#166534',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    icon: '✅'
  }
}

// Colores de riesgo para componentes
export const RISK_COLORS = {
  low: {
    bg: '#F0FDF4',
    border: '#BBF7D0',
    text: '#166534',
    progress: '#10B981'
  },
  medium: {
    bg: '#FFFBEB',
    border: '#FED7AA',
    text: '#C2410C',
    progress: '#F59E0B'
  },
  high: {
    bg: '#FEF2F2',
    border: '#FECACA',
    text: '#DC2626',
    progress: '#EF4444'
  }
}

// Sistema de design tokens para el dashboard
export const DASHBOARD_THEME = {
  colors: {
    primary: '#0F172A',
    secondary: '#1E3A8A',
    accent: '#06B6D4',
    background: '#E2E8F0',
    white: '#FFFFFF',
    surface: {
      primary: '#FFFFFF',
      secondary: '#F8FAFC',
      elevated: '#FFFFFF'
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
      muted: '#94A3B8'
    }
  },
  spacing: {
    card: '1.5rem',
    section: '2rem',
    element: '1rem'
  },
  borderRadius: {
    card: '1rem',
    button: '0.5rem',
    indicator: '50%'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
  },
  animations: {
    duration: {
      fast: '200ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
}

// Configuración de pestañas
export const DASHBOARD_TABS = [
  { 
    id: 'resumen', 
    label: 'Resumen', 
    icon: '📊',
    description: 'Vista general del análisis'
  },
  { 
    id: 'detalles', 
    label: 'Detalles', 
    icon: '🔍',
    description: 'Información detallada de todos los resultados'
  },
  { 
    id: 'recomendaciones', 
    label: 'Recomendaciones', 
    icon: '💡',
    description: 'Acciones recomendadas y cuidados'
  }
]

// Configuración de animaciones
export const ANIMATION_VARIANTS = {
  // Variantes para tarjetas
  card: {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  },
  
  // Variantes para contenedores con stagger
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  
  // Variantes para tabs
  tab: {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.2 }
    }
  }
}