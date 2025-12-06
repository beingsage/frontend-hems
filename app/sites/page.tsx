"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HeatmapChart } from "@/components/visualization/heatmap-chart"
import { PeakLoadChart } from "@/components/visualization/peak-load-chart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Zap, TrendingDown, Download } from "lucide-react"

export default function AdminPage() {
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch("/api/metrics?hours=168") // 7 days
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error("Failed to fetch metrics:", error)
      }
    }

    fetchMetrics()
  }, [])

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <AppSidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">Multi-site analytics and management</p>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Sites</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div className="text-2xl font-bold">3</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Across 2 locations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="text-2xl font-bold">24</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">8 active today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Devices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <div className="text-2xl font-bold">47</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">45 online, 2 offline</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Energy Saved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <div className="text-2xl font-bold">18%</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">vs last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="sites">Sites</TabsTrigger>
                <TabsTrigger value="users">Users & Roles</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Consumption Heatmap</CardTitle>
                      <CardDescription>Hour of day × Day of week pattern</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <HeatmapChart />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Peak Load Forecast</CardTitle>
                      <CardDescription>Next 7 days predicted peaks</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PeakLoadChart />
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Summary</CardTitle>
                    <CardDescription>Energy consumption by site</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Main Office", energy: 1245.6, cost: 7473.6, trend: -12 },
                        { name: "Warehouse", energy: 892.3, cost: 5353.8, trend: -8 },
                        { name: "Retail Store", energy: 456.8, cost: 2740.8, trend: 5 },
                      ].map((site) => (
                        <div key={site.name} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <div className="font-semibold">{site.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {site.energy} kWh • ₹{site.cost}
                              </div>
                            </div>
                          </div>
                          <Badge variant={site.trend < 0 ? "default" : "secondary"} className="font-mono">
                            {site.trend > 0 ? "+" : ""}
                            {site.trend}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sites" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Site Management</CardTitle>
                    <CardDescription>Configure and monitor all sites</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Main Office", location: "Mumbai", devices: 23, users: 12, status: "online" },
                        { name: "Warehouse", location: "Pune", devices: 18, users: 8, status: "online" },
                        { name: "Retail Store", location: "Delhi", devices: 6, users: 4, status: "online" },
                      ].map((site) => (
                        <div key={site.name} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Building2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <div className="font-semibold">{site.name}</div>
                              <div className="text-sm text-muted-foreground">{site.location}</div>
                              <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                                <span>{site.devices} devices</span>
                                <span>{site.users} users</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="default">{site.status}</Badge>
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage users and permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "John Doe", email: "john@example.com", role: "Admin", sites: ["All"] },
                        { name: "Jane Smith", email: "jane@example.com", role: "Manager", sites: ["Main Office"] },
                        { name: "Bob Wilson", email: "bob@example.com", role: "Analyst", sites: ["Warehouse"] },
                        { name: "Alice Brown", email: "alice@example.com", role: "User", sites: ["Retail Store"] },
                      ].map((user) => (
                        <div key={user.email} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-semibold text-primary">{user.name[0]}</span>
                            </div>
                            <div>
                              <div className="font-semibold">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <Badge variant="outline">{user.role}</Badge>
                              <div className="text-xs text-muted-foreground mt-1">{user.sites.join(", ")}</div>
                            </div>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>Configure global system preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Data Retention</h4>
                      <p className="text-sm text-muted-foreground">
                        Raw readings are stored for 90 days, aggregated data for 2 years
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Alert Thresholds</h4>
                      <p className="text-sm text-muted-foreground">
                        Global anomaly detection sensitivity: Medium (score ≥ 0.7)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">API Access</h4>
                      <p className="text-sm text-muted-foreground">3 active API keys • Last used 2 hours ago</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Privacy & Security</h4>
                      <p className="text-sm text-muted-foreground">
                        PII data TTL: 30 days • Geolocation data TTL: 7 days
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
