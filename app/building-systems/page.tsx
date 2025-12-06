"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Zap, AlertTriangle, Activity, Download, RefreshCw, Gauge } from "lucide-react"
import { BuildingDigitalTwin } from "@/components/building-systems/building-digital-twin"
import { ElectricalPanelMonitor } from "@/components/building-systems/electrical-panel-monitor"
import { CircuitBreakerStatus } from "@/components/building-systems/circuit-breaker-status"
import { LoadDistribution } from "@/components/building-systems/load-distribution"
import { BASIntegration } from "@/components/building-systems/bas-integration"
import { EmergencyPowerSystems } from "@/components/building-systems/emergency-power-systems"

export default function BuildingSystemsPage() {
  const [selectedBuilding, setSelectedBuilding] = useState("main-building")
  const [selectedFloor, setSelectedFloor] = useState("floor-1")

  const buildings = [
    { id: "main-building", name: "Main Building", floors: 5, panels: 12 },
    { id: "lab-building", name: "Laboratory Building", floors: 3, panels: 8 },
    { id: "admin-building", name: "Administration Building", floors: 4, panels: 6 },
  ]

  const systemStats = [
    {
      label: "Total Load",
      value: "847 kW",
      change: "+5.2%",
      icon: Zap,
      status: "normal",
    },
    {
      label: "Power Factor",
      value: "0.94",
      change: "+0.02",
      icon: Gauge,
      status: "good",
    },
    {
      label: "Active Circuits",
      value: "156/180",
      change: "87%",
      icon: Activity,
      status: "normal",
    },
    {
      label: "Alerts",
      value: "3",
      change: "2 critical",
      icon: AlertTriangle,
      status: "warning",
    },
  ]

  return (
        <ProtectedRoute>
    
    <div className="flex h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                Building Electrical Systems & Digital Twin
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time monitoring and digital twin visualization of building electrical infrastructure
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Building" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building) => (
                    <SelectItem key={building.id} value={building.id}>
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* System Stats */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemStats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      <p
                        className={`text-xs mt-1 ${
                          stat.status === "warning"
                            ? "text-destructive"
                            : stat.status === "good"
                              ? "text-accent"
                              : "text-muted-foreground"
                        }`}
                      >
                        {stat.change}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-full ${
                        stat.status === "warning"
                          ? "bg-destructive/10"
                          : stat.status === "good"
                            ? "bg-accent/10"
                            : "bg-primary/10"
                      }`}
                    >
                      <stat.icon
                        className={`h-6 w-6 ${
                          stat.status === "warning"
                            ? "text-destructive"
                            : stat.status === "good"
                              ? "text-accent"
                              : "text-primary"
                        }`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="digital-twin" className="space-y-6">
            <TabsList>
              <TabsTrigger value="digital-twin">Digital Twin</TabsTrigger>
              <TabsTrigger value="panels">Electrical Panels</TabsTrigger>
              <TabsTrigger value="circuits">Circuit Breakers</TabsTrigger>
              <TabsTrigger value="load">Load Distribution</TabsTrigger>
              <TabsTrigger value="bas">Building Automation</TabsTrigger>
              <TabsTrigger value="emergency">Emergency Power</TabsTrigger>
            </TabsList>

            <TabsContent value="digital-twin" className="space-y-6">
              <BuildingDigitalTwin building={selectedBuilding} floor={selectedFloor} />
            </TabsContent>

            <TabsContent value="panels" className="space-y-6">
              <ElectricalPanelMonitor building={selectedBuilding} />
            </TabsContent>

            <TabsContent value="circuits" className="space-y-6">
              <CircuitBreakerStatus building={selectedBuilding} />
            </TabsContent>

            <TabsContent value="load" className="space-y-6">
              <LoadDistribution building={selectedBuilding} />
            </TabsContent>

            <TabsContent value="bas" className="space-y-6">
              <BASIntegration building={selectedBuilding} />
            </TabsContent>

            <TabsContent value="emergency" className="space-y-6">
              <EmergencyPowerSystems building={selectedBuilding} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
        </ProtectedRoute>
    
  )
}
