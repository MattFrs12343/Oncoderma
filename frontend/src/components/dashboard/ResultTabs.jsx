import { motion, AnimatePresence } from 'framer-motion'
import { DASHBOARD_TABS, ANIMATION_VARIANTS } from '../../utils/dashboardConstants'
import ResumenTab from './tabs/ResumenTab'
import DetallesTab from './tabs/DetallesTab'
import RecomendacionesTab from './tabs/RecomendacionesTab'

const ResultTabs = ({ activeTab, onTabChange, dashboardData }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'resumen':
        return <ResumenTab dashboardData={dashboardData} />
      case 'detalles':
        return <DetallesTab dashboardData={dashboardData} />
      case 'recomendaciones':
        return <RecomendacionesTab dashboardData={dashboardData} />
      default:
        return <ResumenTab dashboardData={dashboardData} />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden"
    >
      {/* Tab Headers */}
      <div className="flex border-b border-slate-700 bg-slate-900/50">
        {DASHBOARD_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-4 py-4 text-sm font-medium transition-all duration-200 relative ${
              activeTab === tab.id
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </div>
            
            {/* Active indicator */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={ANIMATION_VARIANTS.tab}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default ResultTabs