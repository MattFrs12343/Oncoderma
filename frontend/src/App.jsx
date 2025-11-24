import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute'

// ✅ CARGA INMEDIATA: Layout y componentes críticos para evitar FOUC
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'

// ✅ LAZY LOADING SELECTIVO: Solo páginas pesadas
const Login = lazy(() => import('./components/auth/Login'))
const Home = lazy(() => import('./pages/Home'))
const AnalizarPage = lazy(() => import('./pages/AnalizarPage'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Contacto = lazy(() => import('./pages/Contacto'))

// ✅ Componente de Loading MINIMALISTA para evitar parpadeo
const OptimizedLoadingFallback = () => (
  <div className="flex items-center justify-center py-12">
    <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin" />
  </div>
)

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Ruta de login (pública) */}
              <Route path="/login" element={
                <Suspense fallback={<OptimizedLoadingFallback />}>
                  <Login />
                </Suspense>
              } />
              
              {/* Rutas protegidas con Layout */}
              <Route element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route path="/home" element={
                  <Suspense fallback={<OptimizedLoadingFallback />}>
                    <Home />
                  </Suspense>
                } />
                <Route path="/analizar" element={
                  <Suspense fallback={<OptimizedLoadingFallback />}>
                    <AnalizarPage />
                  </Suspense>
                } />
                <Route path="/faq" element={
                  <Suspense fallback={<OptimizedLoadingFallback />}>
                    <FAQ />
                  </Suspense>
                } />
                <Route path="/contacto" element={
                  <Suspense fallback={<OptimizedLoadingFallback />}>
                    <Contacto />
                  </Suspense>
                } />
              </Route>
              
              {/* Ruta raíz redirige a home */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              
              {/* Catch-all redirige a home */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App