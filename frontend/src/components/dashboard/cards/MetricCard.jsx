import { motion } from 'framer-motion'

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  color = "from-blue-500 to-cyan-500",
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 uppercase tracking-wide">
            {title}
          </div>
        </div>
      </div>
      
      <div className="text-2xl font-bold text-white mb-1">
        {value}
      </div>
      
      {/* Barra de progreso decorativa */}
      <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: delay + 0.5 }}
        />
      </div>
    </motion.div>
  )
}

export default MetricCard