import { motion } from 'framer-motion'
import { SKIN_LESION_TYPES } from '../../../utils/constants'

const CompactResultCard = ({ 
  result, 
  index = 0, 
  isHighlighted = false,
  onClick = null,
  animated = true 
}) => {
  if (!result) return null

  const lesionInfo = SKIN_LESION_TYPES[result.type] || {}
  
  const getCancerBadgeColor = (isCancer) => {
    if (isCancer === true) return 'bg-red-500 text-white'
    if (isCancer === 'potential') return 'bg-yellow-500 text-white'
    return 'bg-green-500 text-white'
  }

  const getCancerIcon = (isCancer) => {
    if (isCancer === true) return '⚠️'
    if (isCancer === 'potential') return '🟡'
    return '✅'
  }

  const getProgressColor = (probability, isCancer) => {
    if (isCancer === true) return 'from-red-400 to-red-600'
    if (isCancer === 'potential') return 'from-yellow-400 to-yellow-600'
    return 'from-green-400 to-green-600'
  }

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20, scale: 0.95 } : {}}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: animated ? index * 0.1 : 0,
        type: "spring",
        stiffness: 200
      }}
      whileHover={{ 
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 }
      }}
      className={`bg-white rounded-xl p-4 border-2 transition-all duration-300 cursor-pointer relative overflow-hidden ${
        isHighlighted 
          ? 'ring-2 ring-blue-300 shadow-lg border-blue-300' 
          : 'hover:border-blue-300 hover:shadow-md border-gray-200'
      } ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Ranking badge para los top 3 */}
      {index < 3 && (
        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
        }`}>
          {index + 1}
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1">
          {/* Ícono */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <span className="text-2xl">
              {result.icon || lesionInfo.icon || '❓'}
            </span>
            {index === 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            )}
          </motion.div>

          {/* Información */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h6 className="font-bold text-primary text-sm truncate">
                {result.name || result.fullName}
              </h6>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getCancerBadgeColor(result.isCancer)}`}>
                {getCancerIcon(result.isCancer)} {lesionInfo.type || 'N/A'}
              </span>
            </div>
            <p className="text-xs text-gray-600 truncate">
              {lesionInfo.description || 'Análisis de lesión cutánea'}
            </p>
          </div>
        </div>

        {/* Porcentaje y barra */}
        <div className="text-right ml-3">
          <div className="text-xl font-bold text-primary mb-1">
            {result.probability}%
          </div>
          <div className="w-16 bg-gray-200 rounded-full h-2 relative overflow-hidden">
            <motion.div 
              className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(result.probability, result.isCancer)}`}
              initial={{ width: 0 }}
              animate={{ width: `${result.probability}%` }}
              transition={{ duration: 1, delay: animated ? 0.3 + index * 0.1 : 0 }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Información adicional colapsable */}
      {isHighlighted && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="pt-3 border-t border-gray-200"
        >
          <div className="space-y-2">
            {/* Descripción detallada */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1">DESCRIPCIÓN:</p>
              <p className="text-xs text-gray-700">{lesionInfo.detailedDescription}</p>
            </div>
            
            {/* Características */}
            {lesionInfo.characteristics && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">CARACTERÍSTICAS:</p>
                <div className="flex flex-wrap gap-1">
                  {lesionInfo.characteristics.slice(0, 3).map((char, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Urgencia */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-600">URGENCIA:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                  lesionInfo.urgency === 'urgent' 
                    ? 'bg-red-200 text-red-800' :
                  lesionInfo.urgency === 'priority' 
                    ? 'bg-yellow-200 text-yellow-800' :
                  'bg-green-200 text-green-800'
                }`}>
                  {lesionInfo.urgency?.toUpperCase() || 'ROUTINE'}
                </span>
              </div>
              
              {/* Severidad */}
              <div className="text-xs text-gray-500">
                Severidad: {lesionInfo.severity || 'low'}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Indicador de relevancia */}
      {!result.isRelevant && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-xl flex items-center justify-center">
          <span className="text-xs text-gray-500 font-medium">Probabilidad baja</span>
        </div>
      )}

      {/* Efecto de brillo para el resultado principal */}
      {index === 0 && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  )
}

export default CompactResultCard