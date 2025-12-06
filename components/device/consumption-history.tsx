"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp } from "lucide-react"
import type { Device } from "@/lib/data"
import { DeviceTimeSeriesChart } from "../charts/device-timeseries-chart"
import { DeviceForecastChart } from "../charts/device-forecast-chart"

interface ConsumptionHistoryProps {
  device: Device
}

export function ConsumptionHistory({ device }: ConsumptionHistoryProps) {
  const [timeWindow, setTimeWindow] = useState("24h")

  return (
    <Tabs defaultValue="timeseries" className="space-y-4">
      <TabsList>
        <TabsTrigger value="timeseries">Time Series</TabsTrigger>
        <TabsTrigger value="forecast">Forecast</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
      </TabsList>

      <TabsContent value="timeseries" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Power Consumption</CardTitle>
                <CardDescription>Historical power usage over time</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={timeWindow === "1h" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeWindow("1h")}
                >
                  1H
                </Button>
                <Button
                  variant={timeWindow === "24h" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeWindow("24h")}
                >
                  24H
                </Button>
                <Button
                  variant={timeWindow === "7d" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeWindow("7d")}
                >
                  7D
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DeviceTimeSeriesChart deviceId={device.id} timeWindow={timeWindow} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="forecast" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>24-Hour Forecast</CardTitle>
            <CardDescription>Predicted power consumption with confidence intervals</CardDescription>
          </CardHeader>
          <CardContent>
            <DeviceForecastChart deviceId={device.id} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="events" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Anomalies and automation actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium">Unusual spike detected</div>
                  <div className="text-sm text-muted-foreground">Power exceeded 2× average for 5 minutes</div>
                  <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium">Automation triggered</div>
                  <div className="text-sm text-muted-foreground">Device turned off by schedule</div>
                  <div className="text-xs text-muted-foreground mt-1">5 hours ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="recommendations" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Optimization Recommendations</CardTitle>
            <CardDescription>AI-powered suggestions to reduce energy consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">Schedule off-peak usage</h4>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    Save ₹120/mo
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  This device draws 20% more power during peak hours (6pm-10pm). Consider scheduling usage
                  between 10pm-6am for lower rates.
                </p>
                <Button size="sm">Apply Schedule</Button>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">Reduce standby power</h4>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    Save ₹45/mo
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Device consumes {Math.round(device.consumption.average * 0.05)}W in standby mode. Use a smart plug to
                  completely cut power when not in use.
                </p>
                <Button size="sm" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
