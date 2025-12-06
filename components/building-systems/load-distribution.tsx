"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface LoadDistributionProps {
  building: string
}

export function LoadDistribution({ building }: LoadDistributionProps) {
  const floorLoadData = [
    { floor: "Basement", load: 245, capacity: 400, percentage: 61 },
    { floor: "Floor 1", load: 156, capacity: 300, percentage: 52 },
    { floor: "Floor 2", load: 198, capacity: 300, percentage: 66 },
    { floor: "Floor 3", load: 134, capacity: 250, percentage: 54 },
    { floor: "Floor 4", load: 114, capacity: 250, percentage: 46 },
  ]

  const systemLoadData = [
    { name: "HVAC", value: 385, color: "#3b82f6" },
    { name: "Lighting", value: 145, color: "#f59e0b" },
    { name: "IT Equipment", value: 285, color: "#10b981" },
    { name: "Elevators", value: 95, color: "#8b5cf6" },
    { name: "Kitchen", value: 45, color: "#ef4444" },
    { name: "Other", value: 92, color: "#6b7280" },
  ]

  const hourlyLoadData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    load: Math.sin((i - 6) / 3) * 200 + 500 + Math.random() * 50,
  }))

  return (
    <div className="space-y-6">
      {/* Floor-wise Load Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Floor-wise Load Distribution</CardTitle>
          <CardDescription>Current load vs capacity by floor</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={floorLoadData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="floor" stroke="hsl(var(--muted-foreground))" />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                label={{ value: "Load (A)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="load" fill="hsl(var(--primary))" name="Current Load (A)" />
              <Bar dataKey="capacity" fill="hsl(var(--muted))" name="Capacity (A)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System-wise Load Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>System-wise Load Distribution</CardTitle>
            <CardDescription>Load breakdown by system type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={systemLoadData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {systemLoadData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {systemLoadData.map((system) => (
                <div key={system.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: system.color }} />
                  <span className="text-sm text-foreground">
                    {system.name}: {system.value}A
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 24-Hour Load Profile */}
        <Card>
          <CardHeader>
            <CardTitle>24-Hour Load Profile</CardTitle>
            <CardDescription>Typical daily load pattern</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyLoadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} interval={2} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: "Load (kW)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="load" fill="hsl(var(--accent))" name="Load (kW)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
