"use client"

import { useState, useEffect } from "react"

export function useRealtimeDevices() {
  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch("/api/realtime/devices")
        const result = await response.json()

        if (result.success) {
          setDevices(result.data)
          setError(null)
        } else {
          setError(result.error)
        }
      } catch (err) {
        console.error("[v0] Error fetching devices:", err)
        setError("Failed to fetch devices")
      } finally {
        setLoading(false)
      }
    }

    fetchDevices()
    const interval = setInterval(fetchDevices, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return { devices, loading, error }
}
