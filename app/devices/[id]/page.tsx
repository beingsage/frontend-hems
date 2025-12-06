"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { use } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { DeviceHeader } from "@/components/device/device-header"
import { DeviceStats } from "@/components/device/device-stats"
import { ConsumptionHistory } from "@/components/device/consumption-history"
import { MaintenanceLog } from "@/components/device/maintenance-log"
import { OptimizationSuggestions } from "@/components/device/optimization-suggestions"
import { useRealtimeDevices } from "@/lib/hooks/use-realtime-devices"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DeviceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { devices, loading } = useRealtimeDevices()
  const device = devices?.find((d) => d.id === id)

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading device details...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!device) {
    return (
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Device Not Found</h1>
            <p className="text-muted-foreground mb-4">The device you're looking for doesn't exist.</p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
        <ProtectedRoute>
    
    <div className="flex h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Back Button */}
        <div className="border-b border-border bg-card px-6 py-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Device Header */}
        <DeviceHeader device={device} />

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <DeviceStats device={device} />

          {/* Consumption History */}
          <ConsumptionHistory device={device} />

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OptimizationSuggestions device={device} />
            <MaintenanceLog />
          </div>
        </div>
      </main>
    </div>
        </ProtectedRoute>
    
  )
}
