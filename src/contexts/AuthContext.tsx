import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authService } from '../services'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, passwordConfirm: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
  requestPasswordReset: (email: string) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from service
  useEffect(() => {
    const initAuth = () => {
      const authState = authService.getAuthState()
      setUser(authState.user)
      setIsLoading(false)
    }

    initAuth()

    // Listen for auth changes
    const unsubscribe = authService.onAuthChange((user) => {
      setUser(user)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password)
    setUser(result.user)
  }

  const signup = async (email: string, password: string, passwordConfirm: string) => {
    await authService.signup(email, password, passwordConfirm)
    // Auto-login after signup
    await login(email, password)
  }

  const loginWithGoogle = async () => {
    const result = await authService.loginWithGoogle()
    setUser(result.user)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const requestPasswordReset = async (email: string) => {
    await authService.requestPasswordReset(email)
  }

  const refreshUser = async () => {
    await authService.refreshAuth()
    const authState = authService.getAuthState()
    setUser(authState.user)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    loginWithGoogle,
    logout,
    requestPasswordReset,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
