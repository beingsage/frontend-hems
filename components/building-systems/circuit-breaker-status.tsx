"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Power, AlertCircle, CheckCircle, XCircle } from "lucide-react"

interface CircuitBreakerStatusProps {
  building: string
}

export function CircuitBreakerStatus({ building }: CircuitBreakerStatusProps) {
  const circuits = [
    {
      panel: "MDP-1",
      circuits: [
        { id: "CB-1", name: "HVAC System - Chiller 1", rating: "100A", load: 78, status: "on", trips: 0 },
        { id: "CB-2", name: "Lighting - Floor 1-2", rating: "60A", load: 45, status: "on", trips: 0 },
        { id: "CB-3", name: "Receptacles - North Wing", rating: "40A", load: 32, status: "on", trips: 1 },
        { id: "CB-4", name: "Emergency Lighting", rating: "30A", load: 15, status: "on", trips: 0 },
      ],
    },
    {
      panel: "MDP-2",
      circuits: [
        { id: "CB-5", name: "Server Room - UPS Feed", rating: "150A", load: 92, status: "on", trips: 0 },
        { id: "CB-6", name: "HVAC System - AHU 1-3", rating: "80A", load: 68, status: "on", trips: 0 },
        { id: "CB-7", name: "Elevator Motors", rating: "100A", load: 55, status: "on", trips: 2 },
        { id: "CB-8", name: "Kitchen Equipment", rating: "60A", load: 0, status: "off", trips: 0 },
      ],
    },
    {
      panel: "SDP-2B",
      circuits: [
        { id: "CB-9", name: "Server Racks 1-10", rating: "80A", load: 95, status: "on", trips: 0 },
        { id: "CB-10", name: "Network Equipment", rating: "40A", load: 72, status: "on", trips: 0 },
        { id: "CB-11", name: "Cooling Units", rating: "60A", load: 88, status: "on", trips: 1 },
        { id: "CB-12", name: "Backup Systems", rating: "50A", load: 0, status: "off", trips: 0 },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      {circuits.map((panelGroup) => (
        <Card key={panelGroup.panel}>
          <CardHeader>
            <CardTitle>Panel {panelGroup.panel} - Circuit Breakers</CardTitle>
            <CardDescription>Real-time circuit breaker status and load monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {panelGroup.circuits.map((circuit) => (
                <div
                  key={circuit.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    circuit.load > 90
                      ? "border-destructive bg-destructive/5"
                      : circuit.trips > 0
                        ? "border-yellow-500 bg-yellow-500/5"
                        : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`p-2 rounded-full ${
                        circuit.status === "on"
                          ? circuit.load > 90
                            ? "bg-destructive/10"
                            : "bg-accent/10"
                          : "bg-secondary"
                      }`}
                    >
                      {circuit.status === "on" ? (
                        circuit.load > 90 ? (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-accent" />
                        )
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{circuit.id}</span>
                        <Badge variant="outline">{circuit.rating}</Badge>
                        {circuit.trips > 0 && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {circuit.trips} trip{circuit.trips > 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{circuit.name}</p>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <p className="text-lg font-semibold text-foreground">{circuit.load}%</p>
                      <p className="text-xs text-muted-foreground">
                        {((Number.parseInt(circuit.rating) * circuit.load) / 100).toFixed(1)}A
                      </p>
                    </div>

                    <Badge variant={circuit.status === "on" ? "default" : "secondary"} className="min-w-[60px]">
                      {circuit.status.toUpperCase()}
                    </Badge>
                  </div>

                  <Button variant="outline" size="sm" className="ml-4 bg-transparent">
                    <Power className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
