"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Zap, Thermometer, Signal, Battery, AlertTriangle, ArrowRight } from "lucide-react"
import { DeviceActivityGraph } from "./device-activity-graph"
import Link from "next/link"

interface Device {
  id: string
  name: string
  type: string
  status: string
  location: string
  consumption: number
  lastUpdated: string
  temperature?: number
  signalStrength?: number
  batteryLevel?: number
  alertCount?: number
  efficiency?: number
  usageHistory: Array<{ date: string; value: number }>
}

interface EnhancedDeviceCardProps {
  device: Device
}

export function EnhancedDeviceCard({ device }: EnhancedDeviceCardProps) {
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-500"
    if (efficiency >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  const getSignalStrengthIcon = (strength: number) => {
    if (strength >= 75) return "w-4 h-4"
    if (strength >= 50) return "w-3 h-4"
    if (strength >= 25) return "w-2 h-4"
    return "w-1 h-4"
  }

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-lg">{device.name}</h3>
            <p className="text-sm text-gray-500">{device.location}</p>
          </div>
          <Badge 
            variant={device.status === "online" ? "default" : "destructive"}
            className="animate-pulse"
          >
            {device.status}
          </Badge>
        </div>

        <DeviceActivityGraph data={device.usageHistory} />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-blue-500" />
            <span className="text-sm">{device.consumption.toFixed(2)} kWh</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-red-500" />
            <span className="text-sm">{device.temperature}°C</span>
          </div>

          <div className="flex items-center space-x-2">
            <Signal className={`${getSignalStrengthIcon(device.signalStrength || 0)} text-purple-500`} />
            <span className="text-sm">{device.signalStrength}%</span>
          </div>

          <div className="flex items-center space-x-2">
            <Battery className="w-4 h-4 text-green-500" />
            <span className="text-sm">{device.batteryLevel}%</span>
          </div>

          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-sm">{device.alertCount} alerts</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`font-medium ${getEfficiencyColor(device.efficiency || 0)}`}>
              {device.efficiency}% efficient
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Last updated: {new Date(device.lastUpdated).toLocaleString()}
          </div>
          <Link href={`/devices/${device.id}`} className="flex items-center hover:text-blue-500 transition-colors">
            View Details
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}