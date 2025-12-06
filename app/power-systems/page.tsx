"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SCADAView } from "@/components/power-systems/scada-view"
import { LoadForecastChart } from "@/components/power-systems/load-forecast-chart"
import {
  scadaNodes,
  generateSmartMeterData,
  generateLoadForecast,
  demandResponseEvents,
  calculateGridMetrics,
  type SCADANode,
} from "@/lib/power-systems/scada-data"
import { Activity, Zap, TrendingUp, AlertTriangle, Download } from "lucide-react"

export default function PowerSystemsPage() {
  const [selectedNode, setSelectedNode] = useState<SCADANode | null>(null)
  const gridMetrics = calculateGridMetrics()
  const loadForecasts = generateLoadForecast(48)
  const meterData = generateSmartMeterData("node-004", 24)

  return (
        <ProtectedRoute>
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Power Systems & Smart Grid</h1>
          <p className="text-muted-foreground mt-1">SCADA monitoring, load forecasting, and demand response</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Grid Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Load</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gridMetrics.totalPowerKW.toFixed(1)} kW</div>
            <p className="text-xs text-muted-foreground mt-1">Across {gridMetrics.totalNodes} nodes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Power Factor</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gridMetrics.avgPowerFactor.toFixed(3)}</div>
            <p className="text-xs text-muted-foreground mt-1">{gridMetrics.gridEfficiency.toFixed(1)}% efficiency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grid Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gridMetrics.gridHealth.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">{gridMetrics.nodesOnline} nodes online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gridMetrics.nodesWithIssues}</div>
            <p className="text-xs text-muted-foreground mt-1">Nodes need attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scada" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scada">SCADA View</TabsTrigger>
          <TabsTrigger value="forecast">Load Forecasting</TabsTrigger>
          <TabsTrigger value="meters">Smart Meters</TabsTrigger>
          <TabsTrigger value="demand-response">Demand Response</TabsTrigger>
        </TabsList>

        <TabsContent value="scada" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SCADAView nodes={scadaNodes} onNodeClick={setSelectedNode} />
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Node Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedNode ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">{selectedNode.name}</p>
                        <Badge variant={selectedNode.status === "normal" ? "default" : "destructive"} className="mt-1">
                          {selectedNode.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium capitalize">{selectedNode.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Voltage:</span>
                          <span className="font-medium">{selectedNode.voltage} V</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Current:</span>
                          <span className="font-medium">{selectedNode.current.toFixed(1)} A</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Power:</span>
                          <span className="font-medium">{(selectedNode.power / 1000).toFixed(1)} kW</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Power Factor:</span>
                          <span className="font-medium">{selectedNode.powerFactor.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Frequency:</span>
                          <span className="font-medium">{selectedNode.frequency.toFixed(2)} Hz</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Click on a node to view details</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Normal:</span>
                    <span className="font-medium text-green-500">
                      {scadaNodes.filter((n) => n.status === "normal").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Warning:</span>
                    <span className="font-medium text-yellow-500">
                      {scadaNodes.filter((n) => n.status === "warning").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Alarm:</span>
                    <span className="font-medium text-red-500">
                      {scadaNodes.filter((n) => n.status === "alarm").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Offline:</span>
                    <span className="font-medium text-gray-500">
                      {scadaNodes.filter((n) => n.status === "offline").length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <LoadForecastChart forecasts={loadForecasts} />

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Peak Demand Prediction</CardTitle>
                <CardDescription>Next 48 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loadForecasts
                    .sort((a, b) => b.predictedLoad - a.predictedLoad)
                    .slice(0, 5)
                    .map((forecast, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{forecast.timestamp.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">
                            Confidence: {(forecast.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                        <Badge variant="outline">{forecast.predictedLoad.toFixed(1)} kW</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Weather Impact</CardTitle>
                <CardDescription>Temperature correlation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Temperature:</span>
                    <span className="font-medium">{loadForecasts[0].weather.temperature.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Humidity:</span>
                    <span className="font-medium">{loadForecasts[0].weather.humidity.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cloud Cover:</span>
                    <span className="font-medium">{(loadForecasts[0].weather.cloudCover * 100).toFixed(0)}%</span>
                  </div>
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      High temperatures increase cooling load. Each degree above 25°C adds approximately 5 kW to demand.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="meters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Meter Data - Building A Floor 1</CardTitle>
              <CardDescription>Real-time three-phase power monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Active Power</p>
                    <p className="text-2xl font-bold">{meterData[meterData.length - 1].activePower.toFixed(1)} kW</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Reactive Power</p>
                    <p className="text-2xl font-bold">
                      {meterData[meterData.length - 1].reactivePower.toFixed(1)} kVAR
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Power Factor</p>
                    <p className="text-2xl font-bold">{meterData[meterData.length - 1].powerFactor.toFixed(3)}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">Three-Phase Voltage</p>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">L1:</span>
                      <span className="font-medium">{meterData[meterData.length - 1].voltage.l1.toFixed(1)} V</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">L2:</span>
                      <span className="font-medium">{meterData[meterData.length - 1].voltage.l2.toFixed(1)} V</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">L3:</span>
                      <span className="font-medium">{meterData[meterData.length - 1].voltage.l3.toFixed(1)} V</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">Three-Phase Current</p>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">L1:</span>
                      <span className="font-medium">{meterData[meterData.length - 1].current.l1.toFixed(2)} A</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">L2:</span>
                      <span className="font-medium">{meterData[meterData.length - 1].current.l2.toFixed(2)} A</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">L3:</span>
                      <span className="font-medium">{meterData[meterData.length - 1].current.l3.toFixed(2)} A</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demand-response" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demand Response Events</CardTitle>
              <CardDescription>Utility demand reduction programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demandResponseEvents.map((event) => (
                  <div key={event.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{event.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.startTime.toLocaleString()} - {event.endTime.toLocaleString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          event.status === "completed"
                            ? "default"
                            : event.status === "active"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>

                    <div className="grid gap-3 md:grid-cols-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Target Reduction</p>
                        <p className="font-medium">{event.targetReduction} kW</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Actual Reduction</p>
                        <p className="font-medium">{event.actualReduction} kW</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Incentive</p>
                        <p className="font-medium">${event.incentive}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Participants</p>
                        <p className="font-medium">{event.participants.length} devices</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
        </ProtectedRoute>
  )
}
