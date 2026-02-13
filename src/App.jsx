import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/hooks/useAuth'
import { GamificationProvider } from '@/hooks/useGamification'
import { FinancialCalculatorProvider } from '@/hooks/useFinancialCalculator'
import ProtectedRoute from '@/components/ProtectedRoute'
import Dashboard from '@/pages/Dashboard'
import Goals from '@/pages/Goals'
import Education from '@/pages/Education'
import Challenges from '@/pages/Challenges'
import Profile from '@/pages/Profile'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Onboarding from '@/pages/Onboarding'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GamificationProvider>
          <FinancialCalculatorProvider>
            <Toaster position="top-center" richColors />
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
            </Routes>
          </FinancialCalculatorProvider>
        </GamificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
