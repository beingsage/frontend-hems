"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Zap, Clock, Sparkles, Play, Plus, Settings } from "lucide-react"

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState("rules")

  // Feature 76: Automation rules display
  const rules = [
    {
      id: "1",
      name: "Peak Hour Load Reduction",
      description: "Automatically reduce non-essential loads during peak pricing hours",
      enabled: true,
      trigger: "Price > $0.30/kWh",
      actions: ["Pause EV charging", "Reduce HVAC by 2°C", "Dim lights to 70%"],
      lastTriggered: "2 hours ago",
      savings: "$45/month",
    },
    {
      id: "2",
      name: "Solar Optimization",
      description: "Run high-power appliances during peak solar generation",
      enabled: true,
      trigger: "Solar > 3kW",
      actions: ["Start dishwasher", "Heat water", "Charge battery"],
      lastTriggered: "Today at 1:30 PM",
      savings: "$32/month",
    },
    {
      id: "3",
      name: "Away Mode Auto-Enable",
      description: "Activate energy-saving mode when no occupancy detected",
      enabled: false,
      trigger: "No motion for 2 hours",
      actions: ["Set HVAC to eco", "Turn off lights", "Disable outlets"],
      lastTriggered: "Never",
      savings: "$28/month",
    },
  ]

  // Feature 77: Smart scenes
  const scenes = [
    {
      id: "1",
      name: "Away Mode",
      icon: "🏠",
      description: "Minimize energy when nobody is home",
      devices: 8,
      active: false,
    },
    {
      id: "2",
      name: "Sleep Mode",
      icon: "🌙",
      description: "Nighttime comfort and efficiency",
      devices: 6,
      active: false,
    },
    {
      id: "3",
      name: "Eco Mode",
      icon: "🌿",
      description: "Maximum energy savings",
      devices: 12,
      active: true,
    },
    {
      id: "4",
      name: "Peak Shaving",
      icon: "📉",
      description: "Reduce peak demand charges",
      devices: 5,
      active: false,
    },
  ]

  // Feature 78: Schedules
  const schedules = [
    {
      id: "1",
      device: "EV Charger",
      action: "Start charging",
      time: "11:00 PM",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      enabled: true,
      condition: "If price < $0.20/kWh",
    },
    {
      id: "2",
      device: "Pool Pump",
      action: "Run cycle",
      time: "12:00 PM",
      days: ["Daily"],
      enabled: true,
      condition: "During solar peak",
    },
    {
      id: "3",
      device: "Water Heater",
      action: "Heat to 60°C",
      time: "6:00 AM",
      days: ["Daily"],
      enabled: true,
      condition: "None",
    },
  ]

  return (
        <ProtectedRoute>

    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Smart Automation</h1>
            </div>
            <p className="text-muted-foreground">Intelligent rules, scenes, and schedules</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Automation
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">Saving $105/month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Automations Run</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">847</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Energy Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">234 kWh</div>
              <p className="text-xs text-muted-foreground mt-1">Through automation</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="scenes">Scenes</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{rule.name}</CardTitle>
                        <Badge variant={rule.enabled ? "default" : "secondary"}>
                          {rule.enabled ? "Active" : "Disabled"}
                        </Badge>
                      </div>
                      <CardDescription>{rule.description}</CardDescription>
                    </div>
                    <Switch checked={rule.enabled} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Trigger</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Sparkles className="h-4 w-4" />
                        <span>{rule.trigger}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Actions</div>
                      <div className="flex flex-wrap gap-2">
                        {rule.actions.map((action, index) => (
                          <Badge key={index} variant="outline">
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Last triggered: {rule.lastTriggered} • Savings: {rule.savings}
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="scenes" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {scenes.map((scene) => (
                <Card key={scene.id} className={scene.active ? "border-primary" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{scene.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{scene.name}</CardTitle>
                          <CardDescription>{scene.description}</CardDescription>
                        </div>
                      </div>
                      {scene.active && <Badge>Active</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{scene.devices} devices configured</span>
                      <Button size="sm" variant={scene.active ? "outline" : "default"}>
                        <Play className="h-4 w-4 mr-2" />
                        {scene.active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedules" className="space-y-4">
            {schedules.map((schedule) => (
              <Card key={schedule.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{schedule.device}</CardTitle>
                        <Badge variant={schedule.enabled ? "default" : "secondary"}>
                          {schedule.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <CardDescription>{schedule.action}</CardDescription>
                    </div>
                    <Switch checked={schedule.enabled} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <div className="text-sm font-medium mb-1">Time</div>
                      <div className="text-sm text-muted-foreground">{schedule.time}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Recurrence</div>
                      <div className="text-sm text-muted-foreground">{schedule.days.join(", ")}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Condition</div>
                      <div className="text-sm text-muted-foreground">{schedule.condition}</div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
        </ProtectedRoute>

  )
}
