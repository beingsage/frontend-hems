"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from "recharts"
import type { LoadForecast } from "@/lib/power-systems/scada-data"

interface LoadForecastChartProps {
  forecasts: LoadForecast[]
}

export function LoadForecastChart({ forecasts }: LoadForecastChartProps) {
  const chartData = forecasts.map((f) => ({
    time: f.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    predicted: Math.round(f.predictedLoad),
    actual: f.actualLoad ? Math.round(f.actualLoad) : null,
    confidence: Math.round(f.confidence * 100),
    temperature: Math.round(f.weather.temperature),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Load Forecasting (48 Hours)</CardTitle>
        <CardDescription>Predicted energy demand with weather correlation</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 11 }} interval={5} />
            <YAxis
              yAxisId="left"
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              label={{ value: "Load (kW)", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              label={{ value: "Temp (°C)", angle: 90, position: "insideRight" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#f1f5f9",
              }}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="predicted"
              fill="#3b82f6"
              fillOpacity={0.2}
              stroke="#3b82f6"
              name="Predicted Load"
            />
            {chartData.some((d) => d.actual) && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="actual"
                stroke="#10b981"
                strokeWidth={2}
                name="Actual Load"
              />
            )}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="temperature"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Temperature"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
