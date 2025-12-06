"use client"


import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { EnergyScene } from "@/components/3d/energy-scene"
import { DeviceInfoPanel } from "@/components/3d/device-info-panel"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRealtimeDevices } from "@/lib/hooks/use-realtime-devices"
import type { DeviceType, ConsumptionLevel } from "@/lib/data"
import { Box, Layers, Filter, Eye, EyeOff } from "lucide-react"

export default function EnergyMapPage() {
  const { devices, loading } = useRealtimeDevices()
  const [selectedDevice, setSelectedDevice] = useState<any | null>(null)
  const [filterType, setFilterType] = useState<DeviceType | "all">("all")
  const [filterLevel, setFilterLevel] = useState<ConsumptionLevel | "all">("all")
  const [showRooms, setShowRooms] = useState(true)

  if (loading) {
    return (
      
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading 3D energy map...</p>
          </div>
        </main>
      </div>
    )
  }

  const deviceTypeCounts = {
    all: devices?.length || 0,
    ac: devices?.filter((d) => d.type === "ac").length || 0,
    light: devices?.filter((d) => d.type === "light").length || 0,
    server: devices?.filter((d) => d.type === "server").length || 0,
    appliance: devices?.filter((d) => d.type === "appliance").length || 0,
    hvac: devices?.filter((d) => d.type === "hvac").length || 0,
    "lab-equipment": devices?.filter((d) => d.type === "lab-equipment").length || 0,
  }

  const levelCounts = {
    all: devices?.length || 0,
    high: devices?.filter((d) => d.consumption_watts > 2000).length || 0,
    medium: devices?.filter((d) => d.consumption_watts >= 500 && d.consumption_watts <= 2000).length || 0,
    low: devices?.filter((d) => d.consumption_watts < 500).length || 0,
  }

  return (
        <ProtectedRoute>
    
    <div className="flex h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Box className="h-6 w-6 text-primary" />
                3D Energy Map
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Interactive visualization of device locations and energy consumption
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Layers className="h-3 w-3" />
                {devices?.length || 0} Devices
              </Badge>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="border-b border-border bg-card px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filters:</span>
            </div>

            <Select value={filterType} onValueChange={(value) => setFilterType(value as DeviceType | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Device Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types ({deviceTypeCounts.all})</SelectItem>
                <SelectItem value="ac">AC Units ({deviceTypeCounts.ac})</SelectItem>
                <SelectItem value="hvac">HVAC ({deviceTypeCounts.hvac})</SelectItem>
                <SelectItem value="light">Lights ({deviceTypeCounts.light})</SelectItem>
                <SelectItem value="server">Servers ({deviceTypeCounts.server})</SelectItem>
                <SelectItem value="appliance">Appliances ({deviceTypeCounts.appliance})</SelectItem>
                <SelectItem value="lab-equipment">Lab Equipment ({deviceTypeCounts["lab-equipment"]})</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterLevel} onValueChange={(value) => setFilterLevel(value as ConsumptionLevel | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Consumption Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels ({levelCounts.all})</SelectItem>
                <SelectItem value="high">High ({levelCounts.high})</SelectItem>
                <SelectItem value="medium">Medium ({levelCounts.medium})</SelectItem>
                <SelectItem value="low">Low ({levelCounts.low})</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showRooms ? "default" : "outline"}
              size="sm"
              onClick={() => setShowRooms(!showRooms)}
              className="gap-2"
            >
              {showRooms ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Rooms
            </Button>
          </div>
        </div>

        {/* 3D Scene */}
        <div className="flex-1 relative">
          <EnergyScene
            devices={devices || []}
            selectedDevice={selectedDevice}
            onDeviceClick={setSelectedDevice}
            filterType={filterType}
            filterLevel={filterLevel}
            showRooms={showRooms}
          />

          <DeviceInfoPanel device={selectedDevice} onClose={() => setSelectedDevice(null)} />

          {/* Legend */}
          <Card className="absolute bottom-4 left-4 w-64">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-sm text-foreground">Consumption Levels</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-destructive" />
                  <span className="text-xs text-foreground">High (2000W+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-chart-2" />
                  <span className="text-xs text-foreground">Medium (500-2000W)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-accent" />
                  <span className="text-xs text-foreground">Low (&lt;500W)</span>
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <h3 className="font-semibold text-sm text-foreground mb-2">Device Shapes</h3>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>■ Cube - AC/HVAC</p>
                  <p>● Sphere - Lights</p>
                  <p>▮ Rectangle - Servers</p>
                  <p>◆ Cylinder - Appliances</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls Help */}
          <Card className="absolute bottom-4 right-4 w-56">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-sm text-foreground">Controls</h3>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>🖱️ Left Click + Drag - Rotate</p>
                <p>🖱️ Right Click + Drag - Pan</p>
                <p>🖱️ Scroll - Zoom</p>
                <p>🖱️ Click Device - View Details</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
   
        </ProtectedRoute>
  )
}
