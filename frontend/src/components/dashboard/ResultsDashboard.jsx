import { useState, useMemo } from 'react'
import { useTheme } from '../../hooks/useTheme'
import DashboardHeader from './DashboardHeader'
import MetricsGrid from './MetricsGrid'
import DetailedView from './DetailedView'
import RecommendationsPanel from './RecommendationsPanel'

const ResultsDashboard = ({ 
  analysisResult, 
  onNewAnalysis,
  imageMetadata,
  processingTime 
}) => {
  const { theme } = useTheme()
  const [currentView, setCurrentView] = useState('summary')

  // Transform analysis result to dashboard format
  const dashboardData = useMemo(() => {
    if (!analysisResult) return null

    const result = analysisResult.result || analysisResult
    const detailedAnalysis = result.detailed_analysis || {}
    
    return {
      id: Date.now().toString(),
      timestamp: new Date(),
      processingTime: processingTime || result.processing_time || 0,
      confidence: result.confidence || 0.85,
      
      primaryDiagnosis: {
        type: detailedAp-4">
  900 g-gray-0 dark:ben bg-gray-5n-h-scressName="mila   <div c (
     returnta) {
  dashboardDa
  if (!)
  }
viewew(tVisetCurren=> {
    = (view) Change leViewonst hand

  cadata])mageMetngTime, it, processisResullysi[ana}
  }, 
    
      }quality: 100},
        : 0 h: 0, heights: { widtnsion dime   ,
     0     size:jpg',
   is.ame: 'analyslenfi     | {
   a |tadat imageMeata:Metad image     
     t),
 assessmen.risk_iledAnalysisions(detadatateRecommengenerns: io recommendat 
              },
   []
ics ||acterist.chardAnalysisailetics: detracteris   cha},
     00
        ty: 1abili  benignProb        ility: 0,
babPro  cancer      
  sk: 'low', overallRi       
   {nt ||k_assessmeAnalysis.risedt: detailmenskAssess  ri  | {},
    es |litiobabiprs.lesion_edAnalysitailties: deabilionProb    lesi: {
    isledAnalysetai
      d          },
'
  ompletadoálisis con || 'Anlt.description: resuescripti    dow',
    risk || 'lall_t?.overessmensis.risk_assiledAnalykLevel: deta   ris|| 0,
     lity t.probabiy || resul.probabilitost_likely?sis.metailedAnalyobability: d
        prknown',type || 'un?.t_likelys.mosnalysi