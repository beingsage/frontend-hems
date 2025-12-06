"use client"

import { useState, useEffect } from "react"
import type { AnalyticsData } from "@/lib/types/analytics"

export function useEnhancedAnalytics(timeRange: string = "24h", deviceId: string = "all") {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchAnalytics = async () => {
      if (!mounted) return

      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/v1/analytics?timeRange=${timeRange}&deviceId=${deviceId}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (!mounted) return

        if (result.success) {
          setData(result.data)
        } else {
          throw new Error(result.error || "Failed to fetch analytics data")
        }
      } catch (err) {
        if (!mounted) return
        console.error("[v1] Error fetching analytics:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch analytics data")
        setData(null)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 30000) // Update every 30 seconds

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [timeRange, deviceId])

  return { data, loading, error }
}