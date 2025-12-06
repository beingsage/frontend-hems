import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Device } from "@/lib/data"
import { MapPin, Activity, Power, Settings } from "lucide-react"

interface DeviceHeaderProps {
  device: Device
}

export function DeviceHeader({ device }: DeviceHeaderProps) {
  const statusColor = {
    online: "bg-accent",
    offline: "bg-muted",
    warning: "bg-chart-2",
    error: "bg-destructive",
  }[device.status]

  return (
    <div className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{device?.name || 'Unnamed Device'}</h1>
            <p className="text-muted-foreground mt-1">
              {device?.type}{device?.location?.room ? ` • ${device.location.room}` : ''}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={device?.status === "online" ? "default" : "secondary"} className="h-fit">
            {device?.status || 'unknown'}
          </Badge>
          <Button variant="outline">
            <Power className="h-4 w-4 mr-2" />
            Toggle Power
          </Button>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{device?.name || 'Unnamed Device'}</h1>
            <Badge className={statusColor}>{device?.status || 'unknown'}</Badge>
            {device?.anomalyDetected && <Badge variant="destructive">Anomaly Detected</Badge>}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>
                {device?.location ? 
                  `${device.location.room}, Floor ${device.location.floor}, ${device.location.building}`
                  : 'Location not available'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span>Health: {device?.health || 0}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Power className="h-4 w-4" />
              <span>{device?.consumption?.current || 0}W</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
          <Button variant={device.status === "online" ? "destructive" : "default"} size="sm">
            {device.status === "online" ? "Turn Off" : "Turn On"}
          </Button>
        </div>
      </div>
    </div>
  )
}
