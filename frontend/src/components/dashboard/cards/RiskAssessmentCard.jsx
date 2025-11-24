import { motion } from 'framer-motion'

const RiskAssessmentCard = ({ riskAssessment }) => {
  const getRiskConfig = (level) => {
    switch (level) {
      case 'urgente':
        return {
          color: 'from-red-500 to-red-600',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-400'
        }
      case 'atencion':
        return {
          color: 'from-yellow-500 to-orange-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          textColor: 'text-yellow-400'
        }
      case 'tranquilo':
        return {
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          textColor: 'text-green-400'
        }
      default:
        return {
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          textColor: 'text-blue-400'
        }
    }
  }

  const config = getRiskConfig(riskAssessment.level)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className={`${config.bgColor} ${config.borderColor} border rounded-xl p-6`}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center text-white text-xl`}>
          {riskAssessment.icon}
        </div>
        <div>
          <h3 className="text-white font-bold text-lg capitalize">
            {riskAssessment.level}
          </h3>
          <p className="text-slate-300 text-sm">
            Evaluación de riesgo
          </p>
        </div>
      </div>
      
      <p className={`${config.textColor} text-sm mb-3`}>
        {riskAssessment.message}
      </p>
      
      {riskAssessment.timeframe && (
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{riskAssessment.timeframe}</span>
        </div>
      )}
    </motion.div>
  )
}

export default RiskAssessmentCard