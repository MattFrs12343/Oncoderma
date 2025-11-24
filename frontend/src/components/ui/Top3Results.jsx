import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'

// Mock data
const mockTop3 = [
  { class: 'NV', name: 'Nevus (lunar benigno)', probability: 78.5 },
  { class: 'BKL', name: 'Queratosis benigna', probability: 15.2 },
  { class: 'MEL', name: 'Melanoma', probability: 4.8 },
]

const Top3Results = ({ compact = false }) => {
  const { theme } = useTheme()

  const classColors = {
    MEL: 'text-red-500',
    NV: 'text-green-500',
    BCC: 'text-orange-500',
    BKL: 'text-blue-500',
  }

  if (compact) {
    return (
      <div
        className={`
          rounded-lg p-3 border
          ${theme === 'dark' ? 'bg-[#1a2332] border-gray-700' : 'bg-white border-gray-200'}
        `}
      >
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Top 3 (mock)
          </span>
        </div>
        <div className="space-y-1">
          {mockTop3.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                #{index + 1} {item.class}
              </span>
              <span className={`font-bold ${classColors[item.class]}`}>{item.probability}%</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`
        rounded-xl p-6 border
        ${theme === 'dark' ? 'bg-[#1a2332] border-gray-700' : 'bg-white border-gray-200'}
      `}
    >
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Top 3 Predicciones
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

      <div className="space-y-3">
        {mockTop3.map((item, index) => (
          <div
            key={index}
            className={`
              p-4 rounded-lg border
              ${theme === 'dark' ? 'bg-[#0f1419] border-gray-700' : 'bg-gray-50 border-gray-200'}
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span
                  className={`
                    text-xl font-bold
                    ${theme === 'dark' ? 'text-cyan-500' : 'text-gray-900'}
                  `}
                >
                  #{index + 1}
                </span>
                <div>
                  <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {item.name}
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Código: {item.class}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${classColors[item.class]}`}>{item.probability}%</p>
              </div>
            </div>
            <div className={`w-full rounded-full h-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${item.probability}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Top3Results
