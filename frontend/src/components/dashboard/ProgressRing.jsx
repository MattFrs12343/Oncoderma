import { useState, useEffect } from 'react'

/**
 * ProgressRing - Pure visual component for circular progress indicator
 * Uses only Tailwind CSS classes and inline SVG
 */
const ProgressRing = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8, 
  color = null,
  animated = true,
  showPercentage = true,
  riskLevel = null
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  // Map risk levels to Tailwind colors
  const riskColorMap = {
    'low': '#10B981',
    'medium': '#F59E0B',
    'high': '#EF4444'
  }

  const ringColor = color || (riskLevel ? riskColorMap[riskLevel] : '#06B6D4')

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedPercentage(percentage)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setAnimatedPercentage(percentage)
    }
  }, [percentage, animated])

  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="drop-shadow-sm transition-all duration-1500 ease-out"
          style={{
            strokeDashoffset: animated ? strokeDashoffset : circumference
          }}
        />
        
        {/* Glow effect for high percentages */}
        {animatedPercentage > 70 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth / 2}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="opacity-30 blur-sm"
          />
        )}
      </svg>
      
      {/* Percentage text */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`text-center transition-all duration-500 ${animated ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            <div 
              className="font-bold leading-none"
              style={{ 
                fontSize: size > 100 ? '1.5rem' : '1.25rem',
                color: ringColor
              }}
            >
              {Math.round(animatedPercentage)}%
            </div>
            {size > 100 && (
              <div className="text-xs text-gray-500 mt-1">
                probabilidad
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Pulse animation for high risk */}
      {riskLevel === 'high' && animatedPercentage > 0 && (
        <div
          className="absolute inset-0 rounded-full border-2 opacity-30 animate-ping"
          style={{ borderColor: ringColor, animationDuration: '2s' }}
        />
      )}
    </div>
  )
}

export default ProgressRing
