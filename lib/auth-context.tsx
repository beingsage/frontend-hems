"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "homeowner" | "facility_admin" | "analyst"
  onboarded: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<User>
  signup: (email: string, password: string, name: string, role: User["role"]) => Promise<User>
  logout: () => void
  completeOnboarding: () => void
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Check for stored user
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error loading stored user:", error)
      setError("Failed to load user data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log("Login attempt:", { email })
      
      // Mock login - in production, this would call an API
      const mockUser: User = {
        id: "user-" + Date.now(),
        email,
        name: email.split("@")[0],
        role: "homeowner",
        onboarded: true,
      }
      
      // Create a mock token
      const token = btoa(JSON.stringify({ userId: mockUser.id, email: mockUser.email }))
      
      // Store token and user in cookies with explicit domain and expiry
      const secure = process.env.NODE_ENV === "production"
      const cookieOptions = `path=/; max-age=86400; ${secure ? "secure;" : ""} samesite=lax`
      document.cookie = `auth-token=${token}; ${cookieOptions}`
      document.cookie = `user=${JSON.stringify(mockUser)}; ${cookieOptions}`
      
      // Update state and storage
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      
      console.log("Login successful:", { user: mockUser })
      return mockUser
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const signup = async (email: string, password: string, name: string, role: User["role"]) => {
    try {
      // Mock signup
      const mockUser: User = {
        id: "user-" + Date.now(),
        email,
        name,
        role,
        onboarded: false,
      }
      
      // Create a mock token
      const token = btoa(JSON.stringify({ userId: mockUser.id, email: mockUser.email }))
      
      // Store token in cookie with explicit domain and expiry
      const secure = process.env.NODE_ENV === "production"
      document.cookie = `auth-token=${token}; path=/; max-age=86400; ${secure ? "secure;" : ""} samesite=lax`
      
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      
      return mockUser
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, onboarded: true }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, completeOnboarding, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
