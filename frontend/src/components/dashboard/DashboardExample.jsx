import { MetricCard, RiskIndicator, ProgressRing, ResultCard } from './index'

/**
 * DashboardExample - Example usage of dashboard components
 * Shows how to use the components with mock data
 */
const DashboardExample = () => {
  // Mock data for demonstration
  const mockResult = {
    type: 'mel',
    name: 'Melanoma',
    simpleName: 'Melanoma',
    probability: 75,
    confidence: 0.85,
    icon: '🔬',
    description: 'Se detectó Melanoma con probabilidad alta. Se recomienda evaluación médica.',
    riskLevel: 'high'
  }

  const mockRiskAssessment = {
    level: 'urgente',
    message: 'Consulta dermatológica prioritaria recomendada',
    timeframe: '1-2 semanas',
    icon: '🚨'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Dashboard Components Example
        </h1>

        {/* Metric Cards Grid */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Metric Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Confianza"
              value="85%"
              icon="📊"
              color="from-blue-500 to-cyan-500"
            />
            <MetricCard
              title="Precisión"
              value="92%"
              icon="🎯"
              color="from-green-500 to-emerald-500"
            />
            <MetricCard
              title="Tiempo"
              value="2.5s"
              icon="⚡"
              color="from-purple-500 to-pink-500"
            />
          </div>
        </section>

        {/* Progress Rings */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Progress Rings
          </h2>
          <div className="flex flex-wrap gap-8 bg-white dark:bg-slate-800 p-8 rounded-xl">
            <div className="text-center">
              <ProgressRing percentage={75} riskLevel="high" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">High Risk</p>
            </div>
            <div className="text-center">
              <ProgressRing percentage={50} riskLevel="medium" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Medium Risk</p>
            </div>
            <div className="text-center">
              <ProgressRing percentage={25} riskLevel="low" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Low Risk</p>
            </div>
          </div>
        </section>

        {/* Result Card */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Result Card
          </h2>
          <ResultCard result={mockResult} />
        </section>

        {/* Risk Indicator */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Risk Indicator
          </h2>
          <RiskIndicator riskAssessment={mockRiskAssessment} />
        </section>
      </div>
    </div>
  )
}

export default DashboardExample
