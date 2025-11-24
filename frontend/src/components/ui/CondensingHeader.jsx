import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import Top3Results from './Top3Results'

const CondensingHeader = ({ formData, sexOptions, anatomSiteOptions, isCondensed, onToggle }) => {
  const { theme } = useTheme()

  const getSexLabel = (value) => {
    const option = sexOptions.find((opt) => opt.value === value)
    return option ? option.label : value
  }

  const getAnatomSiteLabel = (value) => {
    const option = anatomSiteOptions.find((opt) => opt.value === value)
    return option ? option.label : value
  }

  return (
    <div
      className={`
        sticky top-0 z-10 transition-all duration-500 ease-in-out
        ${
          isCondensed
            ? 'py-3 shadow-lg'
            : 'py-0'
        }
        ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-gray-50'}
      `}
    >
      {isCondensed && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mini Patient Card */}
            <div
              className={`
                flex-1 flex items-center gap-4 p-3 rounded-lg border
                ${theme === 'dark' ? 'bg-[#1a2332] border-gray-700' : 'bg-white border-gray-200'}
              `}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <div className="flex items-center gap-3 text-sm">
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {formData.age} años
                  </span>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>•</span>
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {getSexLabel(formData.sex)}
                  </span>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>•</span>
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {getAnatomSiteLabel(formData.anatom_site_general)}
                  </span>
                </div>
              </div>

              <button
                onClick={onToggle}
                className={`
                  ml-auto p-2 rounded-lg transition-colors
                  ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                `}
                aria-label="Expandir datos del paciente"
              >
                <svg
                  className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Compact Top 3 */}
            <div className="w-64">
              <Top3Results compact />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CondensingHeader
