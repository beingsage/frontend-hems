"use client"

import { useState, useEffect } from "react"

export function useRealtimeAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [trends, setTrends] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/realtime/analytics")
        const result = await response.json()

        if (result.success) {
          setAnalytics(result.data.analytics)
          setTrends(result.data.trends)
          setError(null)
        } else {
          setError(result.error)
        }
      } catch (err) {
        console.error("[v0] Error fetching analytics:", err)
        setError("Failed to fetch analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return { analytics, trends, loading, error }
}
