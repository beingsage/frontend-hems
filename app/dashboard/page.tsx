"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ConsumptionChart } from "@/components/dashboard/consumption-chart"
import { DeviceTypeBreakdown } from "@/components/dashboard/device-type-breakdown"
import { CostProjection } from "@/components/dashboard/cost-projection"
import { TopConsumers } from "@/components/dashboard/top-consumers"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { Button } from "@/components/ui/button"
import { Box, Download, RefreshCw } from "lucide-react"
import Link from "next/link"
import { SDGProgress } from "@/components/dashboard/sdg-progress"
import { useRealtimeDevices } from "@/lib/hooks/use-realtime-devices"
import { useRealtimeAnalytics } from "@/lib/hooks/use-realtime-analytics"

export default function DashboardPage() {
  const { devices, loading: devicesLoading } = useRealtimeDevices()
  const { analytics, loading: analyticsLoading } = useRealtimeAnalytics()

  // Data refreshes automatically every 5 seconds
  const handleRefresh = () => {
    // Manual refresh will be handled by the realtime hooks
  }

  if (devicesLoading || analyticsLoading) {
    return (
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
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
          {/* Header */}
          <div className="border-b border-border bg-card px-6 py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Energy Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">Real-time monitoring and optimization for your smart campus</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
                <Link href="/energy-map">
                  <Button variant="default" size="sm" className="gap-2">
                    <Box className="h-4 w-4" />
                    View 3D Map
                  </Button>
                </Link>
              </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <StatsCards />

          {/* Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConsumptionChart />
            <DeviceTypeBreakdown />
          </div>

          {/* Cost Projection */}
          <CostProjection />

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopConsumers />
            <AlertsPanel />
          </div>

          {/* SDG Progress Section */}
          <SDGProgress 
            sdg7Progress={analytics?.efficiency || 0} 
            sdg13Progress={100 - ((analytics?.totalCO2 || 0) / 100) * 10} 
          />
        </div>
      </main>
    </div>
    </ProtectedRoute>
  )
}
