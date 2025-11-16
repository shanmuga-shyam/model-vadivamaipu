"use client"

import { createContext, useContext, type ReactNode, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
  handleTokenError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")
        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const formData = new FormData()
    formData.append("username", email)
    formData.append("password", password)

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      throw new Error("Login failed")
    }

    const data = await res.json()
    const newToken = data.access_token

    // Fetch user info
    const userRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${newToken}` },
    })

    if (!userRes.ok) {
      throw new Error("Failed to fetch user info")
    }

    const userData = await userRes.json()
    setToken(newToken)
    setUser(userData)
    localStorage.setItem("token", newToken)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const signup = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.detail || "Signup failed")
    }

    const userData = await res.json()

    // Auto-login after signup
    const loginFormData = new FormData()
    loginFormData.append("username", email)
    loginFormData.append("password", password)

    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      body: loginFormData,
    })

    if (!loginRes.ok) {
      throw new Error("Auto-login failed after signup")
    }

    const loginData = await loginRes.json()
    const newToken = loginData.access_token

    setToken(newToken)
    setUser(userData)
    localStorage.setItem("token", newToken)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }

  const handleTokenError = () => {
    // Clear auth state when token is invalid/expired
    logout()
    // Redirect to login
    router.push("/auth")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        login,
        signup,
        logout,
        handleTokenError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
