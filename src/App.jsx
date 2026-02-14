import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/hooks/useAuth'
import { GamificationProvider } from '@/hooks/useGamification'
import { FinancialCalculatorProvider } from '@/hooks/useFinancialCalculator'
import ProtectedRoute from '@/components/ProtectedRoute'

// Lazy load all pages for code splitting
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Goals = lazy(() => import('@/pages/Goals'))
const Education = lazy(() => import('@/pages/Education'))
const Challenges = lazy(() => import('@/pages/Challenges'))
const Profile = lazy(() => import('@/pages/Profile'))
const Login = lazy(() => import('@/pages/Login'))
const Signup = lazy(() => import('@/pages/Signup'))
const Onboarding = lazy(() => import('@/pages/Onboarding'))
const Chat = lazy(() => import('@/pages/Chat'))

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="h-12 w-12 border-4 border-malachite-200 border-t-malachite-600 rounded-full animate-spin mx-auto"></div>
      <p className="text-neutral-600 font-medium">Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GamificationProvider>
          <FinancialCalculatorProvider>
            <Toaster position="top-center" richColors theme="light" />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/onboarding" element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                } />

                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/goals" element={
                  <ProtectedRoute>
                    <Goals />
                  </ProtectedRoute>
                } />
                <Route path="/education" element={
                  <ProtectedRoute>
                    <Education />
                  </ProtectedRoute>
                } />
                <Route path="/challenges" element={
                  <ProtectedRoute>
                    <Challenges />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </FinancialCalculatorProvider>
        </GamificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
