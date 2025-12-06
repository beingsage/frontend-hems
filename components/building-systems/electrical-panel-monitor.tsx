"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Zap, AlertTriangle } from "lucide-react"

interface ElectricalPanelMonitorProps {
  building: string
}

export function ElectricalPanelMonitor({ building }: ElectricalPanelMonitorProps) {
  const panels = [
    {
      id: "MDP-1",
      name: "Main Distribution Panel 1",
      location: "Basement - Electrical Room A",
      voltage: { a: 240.2, b: 239.8, c: 240.5 },
      current: { a: 145.3, b: 152.1, c: 148.7 },
      powerFactor: 0.94,
      load: 78,
      capacity: 400,
      status: "normal",
      temperature: 42,
    },
    {
      id: "MDP-2",
      name: "Main Distribution Panel 2",
      location: "Basement - Electrical Room B",
      voltage: { a: 239.5, b: 240.1, c: 239.9 },
      current: { a: 178.2, b: 185.4, c: 180.9 },
      powerFactor: 0.92,
      load: 92,
      capacity: 400,
      status: "warning",
      temperature: 58,
    },
    {
      id: "SDP-1A",
      name: "Sub Distribution Panel 1A",
      location: "Floor 1 - North Wing",
      voltage: { a: 240.0, b: 239.7, c: 240.2 },
      current: { a: 98.5, b: 102.3, c: 99.8 },
      powerFactor: 0.95,
      load: 65,
      capacity: 225,
      status: "normal",
      temperature: 38,
    },
    {
      id: "SDP-2B",
      name: "Sub Distribution Panel 2B",
      location: "Floor 2 - Server Room",
      voltage: { a: 239.8, b: 240.3, c: 239.6 },
      current: { a: 195.2, b: 198.7, c: 196.4 },
      powerFactor: 0.89,
      load: 98,
      capacity: 300,
      status: "critical",
      temperature: 65,
    },
  ]

  return (
    <div className="space-y-4">
      {panels.map((panel) => (
        <Card key={panel.id} className={panel.status === "critical" ? "border-destructive" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{panel.name}</CardTitle>
                <CardDescription>{panel.location}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    panel.status === "critical" ? "destructive" : panel.status === "warning" ? "default" : "secondary"
                  }
                >
                  {panel.status.toUpperCase()}
                </Badge>
                <Badge variant="outline">{panel.id}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Load Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Load Capacity</span>
                  <span className="text-sm text-muted-foreground">
                    {panel.load}% ({(panel.capacity * (panel.load / 100)).toFixed(0)}A / {panel.capacity}A)
                  </span>
                </div>
                <Progress
                  value={panel.load}
                  className={panel.load > 95 ? "bg-destructive/20" : panel.load > 80 ? "bg-yellow-500/20" : ""}
                />
              </div>

              {/* Three-Phase Voltage and Current */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Voltage (V)
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phase A:</span>
                      <span className="font-mono text-foreground">{panel.voltage.a.toFixed(1)} V</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phase B:</span>
                      <span className="font-mono text-foreground">{panel.voltage.b.toFixed(1)} V</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phase C:</span>
                      <span className="font-mono text-foreground">{panel.voltage.c.toFixed(1)} V</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Current (A)
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phase A:</span>
                      <span className="font-mono text-foreground">{panel.current.a.toFixed(1)} A</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phase B:</span>
                      <span className="font-mono text-foreground">{panel.current.b.toFixed(1)} A</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phase C:</span>
                      <span className="font-mono text-foreground">{panel.current.c.toFixed(1)} A</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Power Factor</p>
                  <p className="text-lg font-semibold text-foreground">{panel.powerFactor.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p
                    className={`text-lg font-semibold ${panel.temperature > 60 ? "text-destructive" : panel.temperature > 50 ? "text-yellow-500" : "text-foreground"}`}
                  >
                    {panel.temperature}°C
                  </p>
                </div>
              </div>

              {/* Alerts */}
              {panel.status !== "normal" && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {panel.status === "critical" ? "Critical Alert" : "Warning"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {panel.load > 95
                        ? "Panel operating at critical capacity. Immediate load balancing required."
                        : panel.temperature > 60
                          ? "High temperature detected. Check ventilation and cooling systems."
                          : "Panel load exceeds recommended threshold. Consider load redistribution."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
