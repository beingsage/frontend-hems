// Real-time IoT device data simulator
export interface DeviceData {
  id: string
  name: string
  type: string
  building: string
  room: string
  floor: number
  status: string
  consumption: number
  voltage: number
  current: number
  powerFactor: number
  temperature: number
  lastUpdated: string
  anomaly: boolean
  health: number
  location: string
  signalStrength: number
  batteryLevel: number
  alertCount: number
  efficiency: number
  usageHistory: Array<{ date: string; value: number }>
}

export class IoTSimulator {
  private devices: Map<string, any> = new Map()
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private listeners: Set<(data: any) => void> = new Set()

  constructor() {
    this.initializeDevices()
    this.startSimulation()
  }

  private initializeDevices() {
    // Initialize with real device states
    const deviceTypes = ["AC", "Heater", "Light", "Refrigerator", "Computer", "Server"]
    const buildings = ["Main Building", "Lab Building", "Admin Building"]
    const rooms = ["Room 101", "Room 102", "Room 201", "Room 202", "Lab 1", "Lab 2"]

    let deviceId = 1
    buildings.forEach((building, bIdx) => {
      rooms.slice(bIdx * 2, bIdx * 2 + 2).forEach((room) => {
        deviceTypes.forEach((type) => {
          const id = `DEV${String(deviceId).padStart(3, "0")}`
          this.devices.set(id, {
            id,
            name: `${type} - ${room}`,
            type,
            building,
            room,
            floor: Math.floor(Number.parseInt(room.split(" ")[1]) / 100),
            status: Math.random() > 0.1 ? "online" : "offline",
            consumption: this.getBaseConsumption(type),
            voltage: 220 + (Math.random() - 0.5) * 10,
            current: 0,
            powerFactor: 0.85 + Math.random() * 0.1,
            temperature: 25 + Math.random() * 10,
            lastUpdated: new Date().toISOString(),
            anomaly: false,
            health: 85 + Math.random() * 15,
            location: `${building} - ${room}`,
            signalStrength: 60 + Math.floor(Math.random() * 40),
            batteryLevel: 70 + Math.floor(Math.random() * 30),
            alertCount: Math.floor(Math.random() * 5),
            efficiency: 75 + Math.floor(Math.random() * 25),
            usageHistory: this.generateUsageHistory(type),
          })
          deviceId++
        })
      })
    })
  }

  private generateUsageHistory(type: string): Array<{ date: string; value: number }> {
    const baseConsumption = this.getBaseConsumption(type)
    const history: Array<{ date: string; value: number }> = []
    const today = new Date()
    
    // Generate 84 days (12 weeks) of history
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Add some randomness to consumption
      const randomFactor = 0.5 + Math.random()
      const value = baseConsumption * randomFactor * (Math.random() > 0.2 ? 1 : 0) // 20% chance of zero consumption
      
      history.push({
        date: date.toISOString().split('T')[0],
        value: Number(value.toFixed(2))
      })
    }
    
    return history
  }

  private getBaseConsumption(type: string): number {
    const baseValues: Record<string, number> = {
      AC: 1500,
      Heater: 2000,
      Light: 60,
      Refrigerator: 150,
      Computer: 300,
      Server: 500,
    }
    return baseValues[type] || 100
  }

  // Register a listener for real-time data
  onData(callback: (data: Record<string, DeviceData>) => void) {
    this.listeners.add(callback)
    // Send initial data
    callback(Object.fromEntries(this.devices))
  }

  offData(callback: (data: Record<string, DeviceData>) => void) {
    this.listeners.delete(callback)
  }

  private startSimulation() {
    // Simulate real-time data updates every 5 seconds
    const interval = setInterval(() => {
      this.devices.forEach((device, id) => {
        if (device.status === "online") {
          // Simulate realistic consumption patterns
          const timeOfDay = new Date().getHours()
          const isBusinessHours = timeOfDay >= 9 && timeOfDay <= 18
          const loadFactor = isBusinessHours ? 0.7 + Math.random() * 0.3 : 0.3 + Math.random() * 0.4

          const baseConsumption = this.getBaseConsumption(device.type)
          device.consumption = baseConsumption * loadFactor + (Math.random() - 0.5) * baseConsumption * 0.1
          device.current = device.consumption / device.voltage
          device.voltage = 220 + (Math.random() - 0.5) * 10
          device.powerFactor = 0.85 + Math.random() * 0.1
          device.temperature = 25 + Math.random() * 15
          device.lastUpdate = new Date().toISOString()

          // Simulate anomalies (5% chance)
          if (Math.random() < 0.05) {
            device.anomaly = true
            device.consumption *= 1.5 + Math.random() * 0.5
          } else {
            device.anomaly = false
          }

          // Update health based on usage patterns
          if (device.anomaly) {
            device.health = Math.max(50, device.health - 5)
          } else {
            device.health = Math.min(100, device.health + 0.5)
          }

          this.devices.set(id, device)
        }
      })

      // Notify all listeners
      this.notifyListeners()
    }, 5000)

    this.intervals.set("main", interval)
  }

  subscribe(callback: (data: any) => void) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  private notifyListeners() {
    const deviceMap = Object.fromEntries(this.devices)
    const data = {
      devices: Array.from(this.devices.values()),
      timestamp: new Date().toISOString(),
      totalConsumption: this.getTotalConsumption(),
      activeDevices: this.getActiveDeviceCount(),
    }
    this.listeners.forEach((listener) => {
      // For onData subscribers that expect the map
      if (listener.length === 1) {
        listener(deviceMap)
      } else {
        // For legacy subscribers that expect the expanded data
        listener(data)
      }
    })
  }

  getAllDevices() {
    return Array.from(this.devices.values())
  }

  getDevice(id: string) {
    return this.devices.get(id)
  }

  updateDevice(id: string, updates: Partial<any>) {
    const device = this.devices.get(id)
    if (device) {
      this.devices.set(id, { ...device, ...updates, lastUpdate: new Date().toISOString() })
      this.notifyListeners()
      return this.devices.get(id)
    }
    return null
  }

  getTotalConsumption() {
    return Array.from(this.devices.values())
      .filter((d) => d.status === "online")
      .reduce((sum, d) => sum + d.consumption, 0)
  }

  getActiveDeviceCount() {
    return Array.from(this.devices.values()).filter((d) => d.status === "online").length
  }

  getConsumptionHistory(deviceId: string, hours = 24) {
    // Generate realistic historical data
    const history = []
    const now = Date.now()
    const device = this.devices.get(deviceId)
    if (!device) return []

    const baseConsumption = this.getBaseConsumption(device.type)

    for (let i = hours; i >= 0; i--) {
      const timestamp = new Date(now - i * 60 * 60 * 1000)
      const hour = timestamp.getHours()
      const isBusinessHours = hour >= 9 && hour <= 18
      const loadFactor = isBusinessHours ? 0.7 + Math.random() * 0.3 : 0.3 + Math.random() * 0.4

      history.push({
        timestamp: timestamp.toISOString(),
        consumption: baseConsumption * loadFactor + (Math.random() - 0.5) * baseConsumption * 0.1,
        voltage: 220 + (Math.random() - 0.5) * 10,
        current: (baseConsumption * loadFactor) / 220,
        powerFactor: 0.85 + Math.random() * 0.1,
      })
    }

    return history
  }

  destroy() {
    this.intervals.forEach((interval) => clearInterval(interval))
    this.intervals.clear()
    this.listeners.clear()
  }
}

// Global singleton instance
let simulatorInstance: IoTSimulator | null = null

export function getIoTSimulator(): IoTSimulator {
  if (!simulatorInstance) {
    simulatorInstance = new IoTSimulator()
  }
  return simulatorInstance
}
