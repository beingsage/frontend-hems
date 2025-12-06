"use client"

import { useState, useEffect } from "react"
import type { Device } from "@/lib/types"

export function useRealTimeDevices() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch("/api/devices")
        const result = await response.json()

        if (result.success) {
          setDevices(result.data)
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError("Failed to fetch devices")
        console.error("[v0] Error fetching devices:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDevices()

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchDevices, 5000)

    return () => clearInterval(interval)
  }, [])

  return { devices, loading, error }
}

export function useRealTimeAnalytics(type = "overview") {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics?type=${type}`)
        const result = await response.json()

        if (result.success) {
          setData(result.data)
        }
      } catch (err) {
        console.error("[v0] Error fetching analytics:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()

    // Poll for updates every 10 seconds
    const interval = setInterval(fetchAnalytics, 10000)

    return () => clearInterval(interval)
  }, [type])

  return { data, loading }
}
