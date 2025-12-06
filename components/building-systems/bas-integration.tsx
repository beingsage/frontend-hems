"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Thermometer, Wind, Droplets, Sun, Moon, Settings } from "lucide-react"

interface BASIntegrationProps {
  building: string
}

export function BASIntegration({ building }: BASIntegrationProps) {
  const basZones = [
    {
      id: "zone-1",
      name: "North Wing - Offices",
      temperature: 22.5,
      setpoint: 22.0,
      humidity: 45,
      occupancy: 78,
      lighting: "auto",
      hvacMode: "cooling",
      energyMode: "comfort",
    },
    {
      id: "zone-2",
      name: "Server Room",
      temperature: 18.2,
      setpoint: 18.0,
      humidity: 40,
      occupancy: 2,
      lighting: "on",
      hvacMode: "cooling",
      energyMode: "critical",
    },
    {
      id: "zone-3",
      name: "Conference Rooms",
      temperature: 23.1,
      setpoint: 23.0,
      humidity: 48,
      occupancy: 0,
      lighting: "off",
      hvacMode: "standby",
      energyMode: "eco",
    },
    {
      id: "zone-4",
      name: "Laboratory",
      temperature: 21.8,
      setpoint: 21.5,
      humidity: 42,
      occupancy: 12,
      lighting: "on",
      hvacMode: "cooling",
      energyMode: "comfort",
    },
  ]

  const automationSchedules = [
    {
      name: "Weekday Office Hours",
      time: "7:00 AM - 6:00 PM",
      actions: "Lights ON, HVAC Comfort Mode, Full Ventilation",
      active: true,
    },
    {
      name: "Night Mode",
      time: "6:00 PM - 7:00 AM",
      actions: "Lights OFF, HVAC Eco Mode, Reduced Ventilation",
      active: true,
    },
    {
      name: "Weekend Energy Saving",
      time: "Sat-Sun All Day",
      actions: "Minimal Lighting, HVAC Setback, Security Only",
      active: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* BAS Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {basZones.map((zone) => (
          <Card key={zone.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{zone.name}</CardTitle>
                  <CardDescription>Zone ID: {zone.id}</CardDescription>
                </div>
                <Badge
                  variant={
                    zone.energyMode === "critical"
                      ? "destructive"
                      : zone.energyMode === "comfort"
                        ? "default"
                        : "secondary"
                  }
                >
                  {zone.energyMode}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Environmental Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Thermometer className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Temperature</p>
                      <p className="text-lg font-semibold text-foreground">
                        {zone.temperature}°C
                        <span className="text-sm text-muted-foreground ml-1">(SP: {zone.setpoint}°C)</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-accent/10">
                      <Droplets className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Humidity</p>
                      <p className="text-lg font-semibold text-foreground">{zone.humidity}%</p>
                    </div>
                  </div>
                </div>

                {/* System Status */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">HVAC</p>
                    <Badge variant="outline" className="w-full justify-center">
                      <Wind className="h-3 w-3 mr-1" />
                      {zone.hvacMode}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Lighting</p>
                    <Badge variant="outline" className="w-full justify-center">
                      {zone.lighting === "on" ? <Sun className="h-3 w-3 mr-1" /> : <Moon className="h-3 w-3 mr-1" />}
                      {zone.lighting}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Occupancy</p>
                    <Badge variant="outline" className="w-full justify-center">
                      {zone.occupancy}%
                    </Badge>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                  <Settings className="h-4 w-4" />
                  Configure Zone
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Automation Schedules */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Schedules</CardTitle>
          <CardDescription>Automated control schedules for energy optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {automationSchedules.map((schedule, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground">{schedule.name}</p>
                    <Badge variant="outline">{schedule.time}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{schedule.actions}</p>
                </div>
                <Switch checked={schedule.active} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
