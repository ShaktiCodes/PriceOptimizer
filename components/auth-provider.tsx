"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type AuthState,
  getAuthState,
  login as authLogin,
  logout as authLogout,
  signup as authSignup,
} from "@/lib/auth"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>
  signup: (
    username: string,
    password: string,
    email?: string,
    name?: string,
  ) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: () => {},
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Initialize auth state from localStorage
    const state = getAuthState()
    setAuthState(state)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated and trying to access protected routes
    if (!isLoading && !authState.isAuthenticated) {
      const protectedRoutes = ["/dashboard", "/store", "/products", "/analytics", "/settings"]

      if (protectedRoutes.some((route) => pathname?.startsWith(route))) {
        router.push("/login")
      }
    }
  }, [authState.isAuthenticated, isLoading, pathname, router])

  const login = async (username: string, password: string) => {
    const result = authLogin(username, password)

    if (result.success) {
      const newState = getAuthState()
      setAuthState(newState)

      // Redirect to dashboard on successful login
      router.push("/dashboard")
    }

    return result
  }

  const signup = async (username: string, password: string, email?: string, name?: string) => {
    const result = authSignup(username, password, email, name)

    if (result.success) {
      const newState = getAuthState()
      setAuthState(newState)

      // Redirect to dashboard on successful signup
      router.push("/dashboard")
    }

    return result
  }

  const logout = () => {
    authLogout()
    setAuthState({ user: null, isAuthenticated: false })

    // Redirect to home page on logout
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}
