import React, { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import './HistorySection.css'

// Mock data
const mockHistory = [
  {
    id: 1,
    date: '2024-01-15',
    time: '14:30',
    age: 45,
    sex: 'Femenino',
    location: 'Torso anterior',
    result: 'Nevus (lunar benigno)',
    probability: 89.5,
    status: 'completed',
    top3: [
      { class: 'NV', prob: 0.895 },
      { class: 'BKL', prob: 0.078 },
      { class: 'MEL', prob: 0.027 }
    ]
  },
  {
    id: 2,
    date: '2024-01-10',
    time: '10:15',
    age: 52,
    sex: 'Masculino',
    location: 'Cabeza/Cuello',
    result: 'Queratosis benigna',
    probability: 76.3,
    status: 'completed',
    top3: [
      { class: 'BKL', prob: 0.763 },
      { class: 'NV', prob: 0.182 },
      { class: 'BCC', prob: 0.055 }
    ]
  },
  {
    id: 3,
    date: '2024-01-05',
    time: '16:45',
    age: 38,
    sex: 'Femenino',
    location: 'Extremidad superior',
    result: 'Nevus (lunar benigno)',
    probability: 92.1,
    status: 'completed',
    top3: [
      { class: 'NV', prob: 0.921 },
      { class: 'BKL', prob: 0.065 },
      { class: 'MEL', prob: 0.014 }
    ]
  },
]

// Información de enfermedades
const diseaseInfo = {
  'MEL': {
    name: 'Melanoma',
    status: 'Maligno'
  },
  'NV': {
    name: 'Nevus melanocítico',
    status: 'Benigno'
  },
  'BCC': {
    name: 'Carcinoma basocelular',
    status: 'Maligno'
  },
  'BKL': {
    name: 'Queratosis benigna',
    status: 'Benigno'
  },
}

// Componente de dona pequeña para el historial
const MiniDonutChart = ({ result, index, theme, isPrimary = false }) => {
  const info = diseaseInfo[result.class]
  const isHighRisk = info.status === 'Maligno'
  const percentage = (result.prob * 100).toFixed(1)
  
  // Colores según el tipo
  const colors = isHighRisk 
    ? ['#f97316', '#f59e0b'] // Naranja/Amarillo para maligno
    : ['#10b981', '#14b8a6'] // Verde/Turquesa para benigno
  
  // Usar viewBox 36x36 con r=15.9155 para cálculos más fáciles
  const radius = 15.9155
  const circumference = 2 * Math.PI * radius // ≈ 100
  const strokeDasharray = circumference
  const strokeDashoffset = circumference * (1 - result.prob)
  
  return (
    <div className="mini-donut-container">
      {/* Badge de diagnóstico principal - Solo en desktop */}
      {isPrimary && (
        <div className={`mini-donut-badge ${isHighRisk ? 'malignant' : 'benign'}`}>
          Principal
        </div>
      )}
      
      {/* Dona */}
      <div 
        className={`mini-donut-chart ${isPrimary ? 'primary' : ''} ${isHighRisk ? 'malignant' : 'benign'} ${theme === 'light' ? 'light' : ''}`}
        style={{ willChange: 'opacity, transform' }}
      >
        <svg 
          viewBox="0 0 36 36" 
          className={`mini-donut-svg ${isPrimary ? 'primary' : ''}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`${percentage}% — ${info.name}`}
        >
          {/* Círculo de fondo */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            stroke={theme === 'dark' ? '#1f2937' : '#e5e7eb'}
            strokeWidth="3"
            fill="none"
          />
          {/* Círculo de progreso */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            stroke={`url(#mini-gradient-${index})`}
            strokeWidth="3"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1), stroke-dasharray 600ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
          <defs>
            <linearGradient id={`mini-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors[0]} />
              <stop offset="100%" stopColor={colors[1]} />
            </linearGradient>
          </defs>
        </svg>
        {/* Porcentaje en el centro */}
        <div className={`mini-donut-percentage ${theme === 'light' ? 'light' : ''}`}>
          <span>
            {percentage}%
          </span>
        </div>
      </div>
      
      {/* Nombre de la enfermedad */}
      <p className={`mini-donut-label ${theme === 'light' ? 'light' : ''}`}>
        {info.name}
      </p>
    </div>
  )
}

const HistorySection = ({ historyHeaderRef }) => {
  const { theme } = useTheme()
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className={`history-section-container ${theme === 'light' ? 'light' : ''}`}>
      {/* Header */}
      <button
        ref={historyHeaderRef}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`history-section-header ${theme === 'light' ? 'light' : ''}`}
        aria-label="Historial de Análisis"
      >
        <div className="history-header-content">
          <div className="history-icon-container">
            <svg className="history-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className={`history-title ${theme === 'light' ? 'light' : ''}`}>
            Historial de Análisis
          </h3>
          <span className={`history-badge ${theme === 'light' ? 'light' : ''}`}>
            Datos mock
          </span>
        </div>
        <svg
          className={`history-chevron ${theme === 'light' ? 'light' : ''} ${isExpanded ? 'expanded' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content */}
      <div className={`history-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="history-items-container">
          <div className="history-items-list">
            {mockHistory.map((item, itemIndex) => (
              <div
                key={item.id}
                className={`history-item-card ${theme === 'light' ? 'light' : ''}`}
                title={`${item.result} - ${item.age} años, ${item.sex}, ${item.location}`}
              >
                {/* Layout responsive: columna en móvil, fila en desktop */}
                <div className="history-item-layout">
                  {/* Información principal (izquierda) */}
                  <div className="history-item-main">
                    {/* Fecha y hora */}
                    <div className="history-item-date-row">
                      <div className={`history-status-dot ${item.status === 'completed' ? 'completed' : 'pending'}`} />
                      <span className={`history-date-text ${theme === 'light' ? 'light' : ''}`}>
                        {item.date} • {item.time}
                      </span>
                      {/* Porcentaje principal en móvil - destacado */}
                      <span className={`history-probability-mobile ${theme === 'light' ? 'light' : ''}`}>
                        {item.probability}%
                      </span>
                    </div>

                    {/* Diagnóstico principal */}
                    <div className="history-diagnosis-section">
                      <div className="history-diagnosis-row">
                        <p className={`history-diagnosis-name ${theme === 'light' ? 'light' : ''}`}>
                          {item.result}
                        </p>
                        {/* Porcentaje en desktop */}
                        <span className={`history-probability-desktop ${theme === 'light' ? 'light' : ''}`}>
                          {item.probability}%
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Top 3 Diagnósticos con donas (derecha) */}
                  <div className={`history-top3-section ${theme === 'light' ? 'light' : ''}`}>
                    {/* Título explicativo - Oculto en móvil para ahorrar espacio */}
                    <p className={`history-top3-title ${theme === 'light' ? 'light' : ''}`}>
                      Probabilidades estimadas por la IA (Top 3 diagnósticos)
                    </p>
                    
                    {/* Donas - Grid 3 columnas en móvil, flex en desktop */}
                    <div className="history-donuts-grid">
                      {item.top3.map((result, index) => (
                        <MiniDonutChart 
                          key={`${itemIndex}-${index}`}
                          result={result} 
                          index={`${itemIndex}-${index}`}
                          theme={theme}
                          isPrimary={index === 0}
                        />
                      ))}
                    </div>
                    
                    {/* Leyenda de colores */}
                    <div className="history-legend">
                      <div className="history-legend-item">
                        <div className="history-legend-dot benign"></div>
                        <span className={`history-legend-text ${theme === 'light' ? 'light' : ''}`}>
                          Benigno
                        </span>
                      </div>
                      <div className="history-legend-item">
                        <div className="history-legend-dot malignant"></div>
                        <span className={`history-legend-text ${theme === 'light' ? 'light' : ''}`}>
                          Maligno
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistorySection
