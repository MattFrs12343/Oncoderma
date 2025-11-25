import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/layout/Layout'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Contacto = lazy(() => import('./pages/Contacto'))
const Analizar = lazy(() => import('./pages/Analizar'))
const Login = lazy(() => import('./pages/Login'))

// Loading fallback component using Tailwind
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Cargando...</p>
    </div>
  </div>
)

function App() {
  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="contacto" element={<Contacto />} />
              <Route path="analizar" element={<Analizar />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  )
}

export default App
