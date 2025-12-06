"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Battery, Fuel, Zap, Clock, AlertTriangle } from "lucide-react"

interface EmergencyPowerSystemsProps {
  building: string
}

export function EmergencyPowerSystems({ building }: EmergencyPowerSystemsProps) {
  const upsUnits = [
    {
      id: "UPS-1",
      name: "Main UPS - Server Room",
      capacity: 100,
      load: 68,
      batteryLevel: 95,
      runtime: 45,
      status: "online",
      lastTest: "2024-01-15",
    },
    {
      id: "UPS-2",
      name: "Network Equipment UPS",
      capacity: 40,
      load: 52,
      batteryLevel: 88,
      runtime: 38,
      status: "online",
      lastTest: "2024-01-12",
    },
    {
      id: "UPS-3",
      name: "Emergency Lighting UPS",
      capacity: 25,
      load: 15,
      batteryLevel: 100,
      runtime: 120,
      status: "online",
      lastTest: "2024-01-18",
    },
  ]

  const generators = [
    {
      id: "GEN-1",
      name: "Main Diesel Generator",
      capacity: 500,
      fuelLevel: 78,
      runtime: 24,
      status: "standby",
      lastMaintenance: "2023-12-20",
      nextMaintenance: "2024-03-20",
    },
    {
      id: "GEN-2",
      name: "Backup Generator",
      capacity: 250,
      fuelLevel: 65,
      runtime: 18,
      status: "standby",
      lastMaintenance: "2023-12-22",
      nextMaintenance: "2024-03-22",
    },
  ]

  return (
    <div className="space-y-6">
      {/* UPS Systems */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Battery className="h-5 w-5 text-primary" />
            Uninterruptible Power Supply (UPS) Systems
          </CardTitle>
          <CardDescription>Real-time UPS monitoring and battery status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upsUnits.map((ups) => (
              <div key={ups.id} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-foreground">{ups.name}</h4>
                    <p className="text-sm text-muted-foreground">Unit ID: {ups.id}</p>
                  </div>
                  <Badge variant={ups.status === "online" ? "default" : "secondary"}>{ups.status.toUpperCase()}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Load */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Load</span>
                      <span className="text-sm text-muted-foreground">
                        {ups.load}% ({(ups.capacity * (ups.load / 100)).toFixed(0)} kVA / {ups.capacity} kVA)
                      </span>
                    </div>
                    <Progress value={ups.load} />
                  </div>

                  {/* Battery Level */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Battery Level</span>
                      <span className="text-sm text-muted-foreground">{ups.batteryLevel}%</span>
                    </div>
                    <Progress value={ups.batteryLevel} className="bg-accent/20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Runtime</p>
                      <p className="text-sm font-semibold text-foreground">{ups.runtime} min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Last Test</p>
                      <p className="text-sm font-semibold text-foreground">{ups.lastTest}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generator Systems */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5 text-primary" />
            Emergency Generator Systems
          </CardTitle>
          <CardDescription>Backup generator status and fuel monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generators.map((gen) => (
              <div key={gen.id} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-foreground">{gen.name}</h4>
                    <p className="text-sm text-muted-foreground">Generator ID: {gen.id}</p>
                  </div>
                  <Badge variant={gen.status === "standby" ? "secondary" : "default"}>{gen.status.toUpperCase()}</Badge>
                </div>

                <div className="space-y-4">
                  {/* Fuel Level */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Fuel Level</span>
                      <span className="text-sm text-muted-foreground">{gen.fuelLevel}%</span>
                    </div>
                    <Progress value={gen.fuelLevel} />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Capacity</p>
                      <p className="text-lg font-semibold text-foreground">{gen.capacity} kW</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Runtime</p>
                      <p className="text-lg font-semibold text-foreground">{gen.runtime} hrs</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Next Service</p>
                      <p className="text-sm font-semibold text-foreground">{gen.nextMaintenance}</p>
                    </div>
                  </div>

                  {gen.fuelLevel < 70 && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Low Fuel Warning</p>
                        <p className="text-sm text-muted-foreground">
                          Fuel level below 70%. Schedule refueling to ensure emergency readiness.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
