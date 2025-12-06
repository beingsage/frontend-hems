"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if we're not loading and there's no user
    if (!isLoading && !user) {
      const currentPath = window.location.pathname
      router.push(`/login?from=${currentPath}`)
      return
    }

    // Handle onboarding if needed
    if (!isLoading && user && !user.onboarded) {
      router.push("/onboarding")
      return
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (!user) {
    return null
  }

  // Don't render if needs onboarding
  if (!user.onboarded) {
    return null
  }

  return <>{children}</>
}
