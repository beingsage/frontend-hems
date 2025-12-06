"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EnhancedDeviceCard } from "@/components/devices/enhanced-device-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRealtimeDevices } from "@/lib/hooks/use-realtime-devices"

interface Device {
  id: string
  name: string
  status: string
  type: string
  location: string
  lastUpdated: string
  consumption: number
  temperature?: number
  signalStrength?: number
  batteryLevel?: number
  alertCount?: number
  efficiency?: number
  usageHistory: Array<{ date: string; value: number }>
}

export default function DevicesPage() {
  const { devices = [], loading } = useRealtimeDevices()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

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
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 p-6">
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
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search devices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
            </div>
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
              <EnhancedDeviceCard key={device.id} device={device} />
            ))
          )}
        </div>
      </main>
    </div>
  )
}