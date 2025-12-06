"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Zap, Clock } from "lucide-react"
import { useRealtimeDevices } from "@/lib/hooks/use-realtime-devices"

interface Device {
  id: string
  name: string
  type: string
  status: string
  location: string
  consumption: number
  lastUpdated: string
}

interface DeviceCardProps {
  device: Device
}

function DeviceCard({ device }: DeviceCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{device.name}</h3>
          <Badge variant={device.status === "online" ? "default" : "destructive"}>
            {device.status}
          </Badge>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          <p>{device.location}</p>
          <p className="flex items-center mt-1">
            <Clock className="w-4 h-4 mr-1" />
            Last updated: {new Date(device.lastUpdated).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center text-sm">
          <Zap className="w-4 h-4 mr-1" />
          {device.consumption.toFixed(2)} kWh
        </div>
      </CardContent>
    </Card>
  )
}

export function DeviceList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const { devices = [], loading } = useRealtimeDevices()

  const filteredDevices = useMemo(() => {
    if (!Array.isArray(devices)) return []
    return devices.filter((device) => {
      const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || device.status === statusFilter
      const matchesType = typeFilter === "all" || device.type === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
  }, [devices, searchQuery, statusFilter, typeFilter])

  const uniqueTypes = useMemo(() => {
    if (!Array.isArray(devices)) return []
    const types = new Set(devices.map(device => device.type))
    return Array.from(types)
  }, [devices])

  const uniqueStatuses = useMemo(() => {
    if (!Array.isArray(devices)) return []
    const statuses = new Set(devices.map(device => device.status))
    return Array.from(statuses)
  }, [devices])

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Devices</h1>
        <Link href="/devices/add" passHref>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Device
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-3">
        <div className="flex items-center gap-2 rounded-md border bg-background px-3">
          <Search className="h-4 w-4" />
          <Input
            placeholder="Search devices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 focus-visible:ring-0"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {uniqueStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading devices...</p>
        ) : filteredDevices.length === 0 ? (
          <p>No devices found.</p>
        ) : (
          filteredDevices.map((device) => (
            <Link key={device.id} href={`/devices/${device.id}`}>
              <DeviceCard device={device} />
            </Link>
          ))
        )}
      </div>
    </>
  )
}