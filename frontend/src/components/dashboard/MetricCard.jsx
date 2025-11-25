/**
 * MetricCard - Pure visual component for displaying metrics
 * Uses only Tailwind CSS classes
 */
const MetricCard = ({ 
  title, 
  value, 
  icon, 
  color = "from-blue-500 to-cyan-500",
  animated = true 
}) => {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-all duration-300 group">
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
      
      {/* Progress bar */}
      <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out ${animated ? 'w-full' : 'w-0'}`}
        />
      </div>
    </div>
  )
}

export default MetricCard
