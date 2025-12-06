"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { MaintenanceQueue } from "@/components/engineer/maintenance-queue"
import { DeviceHealthMatrix } from "@/components/engineer/device-health-matrix"
import { SystemDiagnostics } from "@/components/engineer/system-diagnostics"
import { PerformanceMetrics } from "@/components/engineer/performance-metrics"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Download, Bell } from "lucide-react"

export default function EngineerPage() {
  return (
        <ProtectedRoute>
    
    <div className="flex h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Engineer Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">System diagnostics and maintenance management</p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Bell className="h-4 w-4" />
                Alerts
                <Badge variant="destructive" className="ml-1">
                  3
                </Badge>
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export Logs
              </Button>
              <Button variant="outline" size="icon" className="bg-transparent">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Top Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SystemDiagnostics />
            <DeviceHealthMatrix />
          </div>

          {/* Performance Chart */}
          <PerformanceMetrics />

          {/* Maintenance Queue */}
          <MaintenanceQueue />
        </div>
      </main>
    </div>
        </ProtectedRoute>
  )
}
