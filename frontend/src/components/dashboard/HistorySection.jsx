import { useTheme } from '../../contexts/ThemeContext'

const DonutChart = ({ percentage, label, abbreviation, isHighRisk, index }) => {
  const { theme } = useTheme()
  const radius = 15.9155
  const circumference = 2 * Math.PI * radius
  // Calcular el offset correctamente: a mayor porcentaje, menor offset
  const strokeDashoffset = circumference - (circumference * percentage / 100)
  const animationId = `fillDonut-${index}-${percentage}`

  return (
    <div 
      className="flex flex-col items-center gap-1.5 group cursor-pointer transition-transform duration-300 hover:scale-110"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <style>
        {`
          @keyframes ${animationId} {
            from {
              stroke-dashoffset: ${circumference};
            }
            to {
              stroke-dashoffset: ${strokeDashoffset};
            }
          }
        `}
      </style>
      <span 
        className={`
          text-xs font-bold tracking-wider transition-colors duration-300
          ${theme === 'dark' ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-cyan-600 group-hover:text-cyan-700'}
        `}
      >
        {abbreviation}
      </span>
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 transition-all duration-300 group-hover:drop-shadow-lg">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke={theme === 'dark' ? '#1f2937' : '#e5e7eb'}
            strokeWidth="3.5"
            className="transition-all duration-300"
          />
          {/* Animated progress circle */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke={isHighRisk ? '#f97316' : '#10b981'}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className={`
              text-xs sm:text-sm font-bold transition-all duration-300
              ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
              group-hover:scale-110
            `}
          >
            {percentage}%
          </span>
        </div>
      </div>
      <p 
        className={`
          text-xs text-center max-w-[80px] truncate transition-colors duration-300
          ${theme === 'dark' ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'}
        `}
      >
        {label}
      </p>
    </div>
  )
}

const HistoryCard = ({ item, index }) => {
  const { theme } = useTheme()

  const diseaseInfo = {
    'MEL': {
      name: 'Melanoma',
      status: 'Maligno',
    },
    'NV': {
      name: 'Nevus mel...',
      status: 'Benigno',
    },
    'BCC': {
      name: 'Carcinoma ...',
      status: 'Maligno',
    },
    'BKL': {
      name: 'Lesión tipo ...',
      status: 'Benigno',
    },
  }

  return (
    <div
      className={`
        rounded-xl border p-4 sm:p-5 
        transition-all duration-300 ease-out
        hover:shadow-xl hover:scale-[1.01]
        animate-fadeInUp
        ${theme === 'dark' 
          ? 'bg-slate-800/50 border-gray-700/50 hover:bg-slate-800/70 hover:border-cyan-500/30' 
          : 'bg-white border-gray-200 hover:border-cyan-500/50 hover:shadow-cyan-500/10'
        }
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        {/* Left Section: Date, Diagnosis, Percentage */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <div 
              className={`
                w-2 h-2 rounded-full flex-shrink-0 animate-pulse
                ${item.status === 'completed' ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-yellow-500 shadow-lg shadow-yellow-500/50'}
              `} 
            />
            <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {item.date} • {item.time}
            </span>
            <span 
              className={`
                ml-auto text-xl sm:text-2xl font-bold transition-all duration-300
                ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} 
                lg:hidden
              `}
            >
              {item.probability}%
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <h4 
              className={`
                text-base sm:text-lg font-bold transition-colors duration-300
                ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
              `}
            >
              {item.result}
            </h4>
            <span 
              className={`
                text-xl sm:text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent
                ${theme === 'dark' 
                  ? 'from-cyan-400 to-blue-400' 
                  : 'from-cyan-600 to-blue-600'
                }
              `}
            >
              {item.probability}%
            </span>
          </div>
        </div>

        {/* Vertical Divider for Desktop */}
        <div 
          className={`
            hidden lg:block w-px h-20 transition-colors duration-300
            ${theme === 'dark' ? 'bg-gradient-to-b from-transparent via-gray-700 to-transparent' : 'bg-gradient-to-b from-transparent via-gray-300 to-transparent'}
          `} 
        />

        {/* Right Section: Donut Charts */}
        <div className={`
          flex items-center justify-center gap-4 sm:gap-6 lg:gap-8
          pt-4 lg:pt-0
          border-t lg:border-t-0
          ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
        `}>
          {item.top3.map((result, index) => {
            const info = diseaseInfo[result.class]
            const isHighRisk = info.status === 'Maligno'
            const percentage = (result.prob * 100).toFixed(1)

            return (
              <DonutChart
                key={index}
                index={index}
                percentage={percentage}
                label={info.name}
                abbreviation={result.class}
                isHighRisk={isHighRisk}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

const HistorySection = ({ historyData }) => {
  const { theme } = useTheme()

  return (
    <div
      className={`
        rounded-xl p-4 sm:p-6 border backdrop-blur-sm
        transition-all duration-300
        ${theme === 'dark' 
          ? 'bg-slate-800/80 border-gray-700 shadow-xl shadow-slate-900/50' 
          : 'bg-white/80 border-gray-200 shadow-xl shadow-gray-200/50'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 animate-fadeIn">
        <div 
          className={`
            p-2.5 rounded-xl transition-all duration-300 hover:scale-110
            ${theme === 'dark' 
              ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 shadow-lg shadow-cyan-500/10' 
              : 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 shadow-lg shadow-cyan-500/20'
            }
          `}
        >
          <svg
            className={`
              w-5 h-5 transition-transform duration-300 hover:rotate-12
              ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 
          className={`
            text-lg sm:text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent
            ${theme === 'dark' 
              ? 'from-white to-gray-300' 
              : 'from-gray-900 to-gray-600'
            }
          `}
        >
          Historial de Análisis
        </h3>
        <span 
          className={`
            ml-auto text-xs px-3 py-1.5 rounded-full font-semibold
            transition-all duration-300 hover:scale-105
            ${theme === 'dark' 
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30' 
              : 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 border border-cyan-200'
            }
          `}
        >
          Datos mock
        </span>
      </div>

      {/* History Cards */}
      <div className="space-y-3">
        {historyData.map((item, index) => (
          <HistoryCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  )
}

export default HistorySection

// Agregar estilos de animación al documento
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fadeIn {
      animation: fadeIn 0.6s ease-out;
    }

    .animate-fadeInUp {
      animation: fadeInUp 0.6s ease-out backwards;
    }
  `
  if (!document.querySelector('#history-section-animations')) {
    style.id = 'history-section-animations'
    document.head.appendChild(style)
  }
}
