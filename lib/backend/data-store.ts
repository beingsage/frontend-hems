// Real-time in-memory data store with persistence simulation
import type { Device, EnergyReading } from "@/lib/types"
import { devices as mockDevices } from "@/lib/data"

class DataStore {
  private devices: Map<string, Device> = new Map()
  private readings: Map<string, EnergyReading[]> = new Map()
  private subscribers: Map<string, Set<(data: any) => void>> = new Map()

  constructor() {
    // Initialize with mock devices
    mockDevices.forEach((device) => {
      this.devices.set(device.id, device)
      this.readings.set(device.id, [])
    })

    // Start real-time data simulation
    this.startDataSimulation()
  }

  // Device Management
  getDevice(id: string): Device | undefined {
    return this.devices.get(id)
  }

  getAllDevices(): Device[] {
    return Array.from(this.devices.values())
  }

  updateDevice(id: string, updates: Partial<Device>): Device | null {
    const device = this.devices.get(id)
    if (!device) return null

    const updated = { ...device, ...updates }
    this.devices.set(id, updated)
    this.notifySubscribers("device-update", { deviceId: id, device: updated })
    return updated
  }

  toggleDevice(id: string): Device | null {
    const device = this.devices.get(id)
    if (!device) return null

    const newStatus = device.status === "online" ? "offline" : "online"
    return this.updateDevice(id, { status: newStatus })
  }

  // Energy Readings
  addReading(deviceId: string, reading: EnergyReading): void {
    const readings = this.readings.get(deviceId) || []
    readings.push(reading)

    // Keep only last 1000 readings per device
    if (readings.length > 1000) {
      readings.shift()
    }

    this.readings.set(deviceId, readings)
    this.notifySubscribers("reading-update", { deviceId, reading })
  }

  getReadings(deviceId: string, limit?: number): EnergyReading[] {
    const readings = this.readings.get(deviceId) || []
    return limit ? readings.slice(-limit) : readings
  }

  getLatestReading(deviceId: string): EnergyReading | undefined {
    const readings = this.readings.get(deviceId) || []
    return readings[readings.length - 1]
  }

  // Real-time data simulation
  private startDataSimulation(): void {
    setInterval(() => {
      this.devices.forEach((device) => {
        if (device.status === "online") {
          const baseConsumption = device.currentConsumption
          const variation = (Math.random() - 0.5) * 0.2 * baseConsumption
          const newConsumption = Math.max(0, baseConsumption + variation)

          const reading: EnergyReading = {
            timestamp: new Date(),
            consumption: newConsumption,
            voltage: 220 + (Math.random() - 0.5) * 10,
            current: newConsumption / 220,
            powerFactor: 0.85 + Math.random() * 0.1,
            frequency: 50 + (Math.random() - 0.5) * 0.5,
          }

          this.addReading(device.id, reading)
          this.updateDevice(device.id, { currentConsumption: newConsumption })
        }
      })
    }, 5000) // Update every 5 seconds
  }

  // Pub/Sub for real-time updates
  subscribe(event: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set())
    }
    this.subscribers.get(event)!.add(callback)

    // Return unsubscribe function
    return () => {
      this.subscribers.get(event)?.delete(callback)
    }
  }

  private notifySubscribers(event: string, data: any): void {
    this.subscribers.get(event)?.forEach((callback) => callback(data))
  }

  // Analytics
  getTotalConsumption(): number {
    return Array.from(this.devices.values()).reduce((sum, device) => sum + device.currentConsumption, 0)
  }

  getDevicesByBuilding(building: string): Device[] {
    return Array.from(this.devices.values()).filter((device) => device.building === building)
  }

  getDevicesByType(type: string): Device[] {
    return Array.from(this.devices.values()).filter((device) => device.type === type)
  }

  getAnomalousDevices(): Device[] {
    return Array.from(this.devices.values()).filter((device) => device.anomalyDetected)
  }
}

// Singleton instance
export const dataStore = new DataStore()
