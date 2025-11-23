import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import AuthPage from './pages/Auth/AuthPage'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'
import OnboardingPage from './pages/Onboarding/OnboardingPage'
import Dashboard from './pages/Dashboard/Dashboard'
import CreatePage from './pages/Create/CreatePage'
import HistoryPage from './pages/History/HistoryPage'
import SettingsPage from './pages/Settings/SettingsPage'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/Layout/AppLayout'

function App() {
  return (
    <BrowserRouter basename="/app">
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected routes - Onboarding without layout */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          {/* Protected routes - With app layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireOnboarding>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute requireOnboarding>
                <AppLayout>
                  <CreatePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute requireOnboarding>
                <AppLayout>
                  <HistoryPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute requireOnboarding>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
