import React, { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

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
  
  const radius = 35
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (result.prob * circumference)
  
  return (
    <div className="flex flex-col items-center relative min-w-[60px] sm:min-w-[70px]">
      {/* Badge de diagnóstico principal */}
      {isPrimary && (
        <div className={`
          absolute -top-1.5 sm:-top-2 left-1/2 transform -translate-x-1/2 z-10
          px-1.5 sm:px-2 py-0.5 rounded-full text-[7px] sm:text-[9px] font-bold whitespace-nowrap
          ${isHighRisk 
            ? 'bg-orange-500 text-white' 
            : 'bg-green-500 text-white'
          }
        `}>
          Principal
        </div>
      )}
      
      {/* Dona */}
      <div className={`
        relative w-14 h-14 sm:w-20 sm:h-20
        ${isPrimary ? 'ring-1 sm:ring-2 ring-offset-1 sm:ring-offset-2 rounded-full' : ''}
        ${isPrimary && isHighRisk ? 'ring-orange-400' : ''}
        ${isPrimary && !isHighRisk ? 'ring-green-400' : ''}
        ${isPrimary && theme === 'dark' ? 'ring-offset-[#0f1419]' : 'ring-offset-gray-50'}
      `}>
        <svg 
          viewBox="0 0 80 80" 
          className={`
            w-full h-full transform -rotate-90
            ${isPrimary ? 'drop-shadow-md sm:drop-shadow-lg' : ''}
          `}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Círculo de fondo */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={theme === 'dark' ? '#1f2937' : '#e5e7eb'}
            strokeWidth="6"
            fill="none"
          />
          {/* Círculo de progreso */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={`url(#mini-gradient-${index})`}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id={`mini-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors[0]} />
              <stop offset="100%" stopColor={colors[1]} />
            </linearGradient>
          </defs>
        </svg>
        {/* Porcentaje en el centro */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`
            text-[10px] sm:text-sm font-black
            ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
          `}>
            {percentage}%
          </span>
        </div>
      </div>
      
      {/* Nombre de la enfermedad */}
      <p className={`
        text-[8px] sm:text-[10px] text-center mt-1 sm:mt-1.5 font-medium leading-tight max-w-[60px] sm:max-w-[70px] px-0.5
        ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
      `}>
        {info.name}
      </p>
    </div>
  )
}

const HistorySection = ({ historyHeaderRef }) => {
  const { theme } = useTheme()
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div
      className={`
        rounded-xl border overflow-hidden
        ${theme === 'dark' ? 'bg-[#1a2332] border-gray-700' : 'bg-white border-gray-200'}
      `}
    >
      {/* Header */}
      <button
        ref={historyHeaderRef}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full px-6 py-4 flex items-center justify-between
          transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2
          ${theme === 'dark' ? 'hover:bg-[#0f1419] focus:ring-offset-[#1a2332]' : 'hover:bg-gray-50 focus:ring-offset-white'}
        `}
        aria-label="Historial de Análisis"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Historial de Análisis
          </h3>
          <span
            className={`
              text-xs px-2 py-1 rounded-full font-medium
              ${theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'}
            `}
          >
            Datos mock
          </span>
        </div>
        <svg
          className={`
            w-5 h-5 transition-transform duration-300
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
            ${isExpanded ? 'rotate-180' : ''}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content */}
      <div
        className={`
          transition-all duration-300 overflow-hidden
          ${isExpanded ? 'max-h-[2000px]' : 'max-h-0'}
        `}
      >
        <div className="px-6 pb-4">
          <div className="space-y-3">
            {mockHistory.map((item, itemIndex) => (
              <div
                key={item.id}
                className={`
                  p-3 sm:p-4 rounded-lg border cursor-pointer
                  transition-all duration-200
                  ${
                    theme === 'dark'
                      ? 'bg-[#0f1419] border-gray-700 hover:border-cyan-500/50'
                      : 'bg-gray-50 border-gray-200 hover:border-cyan-500/50'
                  }
                `}
              >
                {/* Layout responsive: columna en móvil, fila en desktop */}
                <div className="flex flex-col lg:flex-row lg:items-start gap-3 lg:gap-4">
                  {/* Información principal (izquierda) */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`
                          w-2 h-2 rounded-full flex-shrink-0
                          ${item.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}
                        `}
                      />
                      <span className={`text-[10px] sm:text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.date} • {item.time}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {/* Diagnóstico principal con porcentaje pegado */}
                      <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                        <p className={`text-xs sm:text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {item.result}
                        </p>
                        <span
                          className={`
                            text-xs sm:text-sm font-bold whitespace-nowrap
                            ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}
                          `}
                        >
                          {item.probability}%
                        </span>
                      </div>
                      <p className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                        {item.age} años • {item.sex} • {item.location}
                      </p>
                    </div>
                  </div>

                  {/* Top 3 Diagnósticos con donas (derecha) */}
                  <div className={`
                    flex flex-col items-center lg:items-end w-full lg:w-auto
                    pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:pl-4
                    ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
                  `}>
                    {/* Título explicativo */}
                    <p className={`
                      text-[8px] sm:text-[10px] font-medium mb-1.5 sm:mb-2 text-center lg:text-right
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                      leading-tight px-1
                    `}>
                      Probabilidades estimadas por la IA (Top 3 diagnósticos)
                    </p>
                    
                    {/* Donas */}
                    <div className="flex items-start justify-center lg:justify-end gap-1.5 sm:gap-3 lg:gap-4 mb-1.5 sm:mb-2 w-full overflow-x-auto px-1">
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
                    <div className="flex items-center gap-2 sm:gap-3 text-[8px] sm:text-[10px] font-medium">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></div>
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          Benigno
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-500"></div>
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
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
