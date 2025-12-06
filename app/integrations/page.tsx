"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plug, Webhook, Code } from "lucide-react"

export default function IntegrationsPage() {
  const [apiKey, setApiKey] = useState("sk_live_••••••••••••••••")

  // Feature 112: Integration marketplace
  const integrations = [
    {
      id: "nest",
      name: "Google Nest",
      description: "Connect your Nest thermostat and cameras",
      icon: "🏠",
      category: "Smart Home",
      status: "connected",
      devices: 3,
    },
    {
      id: "philips-hue",
      name: "Philips Hue",
      description: "Control and monitor your smart lights",
      icon: "💡",
      category: "Smart Home",
      status: "connected",
      devices: 12,
    },
    {
      id: "tesla",
      name: "Tesla",
      description: "Monitor and control your Tesla vehicle charging",
      icon: "🚗",
      category: "EV Charging",
      status: "available",
      devices: 0,
    },
    {
      id: "weather",
      name: "Weather API",
      description: "Get weather forecasts and solar predictions",
      icon: "🌤️",
      category: "Weather",
      status: "connected",
      devices: 1,
    },
    {
      id: "utility",
      name: "Utility Provider",
      description: "Link your utility account for real-time billing",
      icon: "⚡",
      category: "Utility",
      status: "available",
      devices: 0,
    },
    {
      id: "solar",
      name: "Solar Inverter",
      description: "Monitor solar panel production",
      icon: "☀️",
      category: "Solar",
      status: "connected",
      devices: 1,
    },
  ]

  // Feature 113: API documentation
  const apiEndpoints = [
    {
      method: "GET",
      path: "/api/v1/energy",
      description: "Get energy consumption data",
      params: ["timeframe", "metric"],
    },
    {
      method: "POST",
      path: "/api/v1/energy",
      description: "Submit energy data",
      params: ["timestamp", "value", "deviceId"],
    },
    {
      method: "GET",
      path: "/api/v1/devices",
      description: "List all connected devices",
      params: ["type", "status"],
    },
    {
      method: "POST",
      path: "/api/v1/automation",
      description: "Create automation rule",
      params: ["trigger", "conditions", "actions"],
    },
  ]

  // Feature 114: Webhook configuration
  const webhooks = [
    {
      id: "1",
      event: "threshold.exceeded",
      url: "https://api.example.com/webhooks/energy",
      enabled: true,
    },
    {
      id: "2",
      event: "device.connected",
      url: "https://api.example.com/webhooks/devices",
      enabled: true,
    },
    {
      id: "3",
      event: "automation.triggered",
      url: "https://api.example.com/webhooks/automation",
      enabled: false,
    },
  ]

  return (
        <ProtectedRoute>
    
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Plug className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Integrations</h1>
          </div>
          <p className="text-muted-foreground">Connect your devices, services, and APIs</p>
        </div>

        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {integrations.map((integration) => (
                <Card key={integration.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{integration.icon}</div>
                        <div>
                          <CardTitle className="text-base">{integration.name}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {integration.category}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant={integration.status === "connected" ? "default" : "secondary"}>
                        {integration.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{integration.description}</CardDescription>
                    {integration.status === "connected" ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{integration.devices} devices</span>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" className="w-full">
                        Connect
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Key</CardTitle>
                <CardDescription>Use this key to authenticate API requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input value={apiKey} readOnly className="font-mono" />
                  <Button variant="outline">Copy</Button>
                  <Button variant="outline">Regenerate</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>Available REST API endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiEndpoints.map((endpoint, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          variant={endpoint.method === "GET" ? "default" : "secondary"}
                          className={endpoint.method === "POST" ? "bg-green-500" : ""}
                        >
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono">{endpoint.path}</code>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{endpoint.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {endpoint.params.map((param) => (
                          <Badge key={param} variant="outline">
                            {param}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="mt-4">
                  <Code className="h-4 w-4 mr-2" />
                  View Full Documentation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Webhooks</CardTitle>
                    <CardDescription>Receive real-time notifications for events</CardDescription>
                  </div>
                  <Button>
                    <Webhook className="h-4 w-4 mr-2" />
                    Add Webhook
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {webhooks.map((webhook) => (
                    <div key={webhook.id} className="flex items-center justify-between border rounded-lg p-4">
                      <div className="flex-1">
                        <div className="font-medium mb-1">{webhook.event}</div>
                        <code className="text-sm text-muted-foreground">{webhook.url}</code>
                      </div>
                      <div className="flex items-center gap-4">
                        <Switch checked={webhook.enabled} />
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
        </Tabs>
      </main>
    </div>
        </ProtectedRoute>
    
  )
}
