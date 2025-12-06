"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { DeviceType } from "@/lib/data"

const deviceTypes: { value: DeviceType; label: string }[] = [
  { value: "ac", label: "Air Conditioner" },
  { value: "light", label: "Light" },
  { value: "server", label: "Server" },
  { value: "appliance", label: "Appliance" },
  { value: "hvac", label: "HVAC System" },
  { value: "lab-equipment", label: "Lab Equipment" },
]

export function AddDeviceForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    type: "" as DeviceType,
    location: {
      room: "",
      floor: "",
      building: "",
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to add device")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: "Device added successfully",
      })

      router.push("/devices")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add device. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Device Name</Label>
            <Input
              id="name"
              placeholder="Enter device name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Device Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: DeviceType) => setFormData({ ...formData, type: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                {deviceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Location Details</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="room">Room</Label>
                <Input
                  id="room"
                  placeholder="Room number/name"
                  value={formData.location.room}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, room: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="floor">Floor</Label>
                <Input
                  id="floor"
                  type="number"
                  placeholder="Floor number"
                  value={formData.location.floor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, floor: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="building">Building</Label>
                <Input
                  id="building"
                  placeholder="Building name"
                  value={formData.location.building}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, building: e.target.value },
                    })
                  }
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Device"}
          </Button>
        </div>
      </form>
    </Card>
  )
}