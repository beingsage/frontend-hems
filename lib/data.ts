// Mock IoT Device Data for Energy Monitoring System

export type DeviceType = "ac" | "light" | "server" | "appliance" | "hvac" | "lab-equipment"
export type DeviceStatus = "online" | "offline" | "warning" | "error"
export type ConsumptionLevel = "high" | "medium" | "low"

export interface Device {
  id: string
  name: string
  type: DeviceType
  status: DeviceStatus
  location: {
    room: string
    floor: number
    building: string
    position: { x: number; y: number; z: number }
  }
  consumption: {
    current: number // watts
    average: number
    peak: number
    level: ConsumptionLevel
  }
  health: number // 0-100
  lastUpdate: Date
  anomalyDetected: boolean
  costPerHour: number
}

export interface EnergyReading {
  timestamp: Date
  deviceId: string
  consumption: number
  voltage: number
  current: number
}

export interface Room {
  id: string
  name: string
  floor: number
  building: string
  totalDevices: number
  totalConsumption: number
}

// Generate mock devices
export const mockDevices: Device[] = [
  // Building A - Floor 1
  {
    id: "dev-001",
    name: "Main Hall AC Unit 1",
    type: "ac",
    status: "online",
    location: { room: "Main Hall", floor: 1, building: "Building A", position: { x: 5, y: 2, z: 10 } },
    consumption: { current: 3500, average: 3200, peak: 4000, level: "high" },
    health: 85,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.42,
  },
  {
    id: "dev-002",
    name: "Main Hall AC Unit 2",
    type: "ac",
    status: "online",
    location: { room: "Main Hall", floor: 1, building: "Building A", position: { x: 15, y: 2, z: 10 } },
    consumption: { current: 3800, average: 3400, peak: 4200, level: "high" },
    health: 78,
    lastUpdate: new Date(),
    anomalyDetected: true,
    costPerHour: 0.46,
  },
  {
    id: "dev-003",
    name: "Main Hall LED Panel 1",
    type: "light",
    status: "online",
    location: { room: "Main Hall", floor: 1, building: "Building A", position: { x: 10, y: 3, z: 10 } },
    consumption: { current: 120, average: 115, peak: 130, level: "low" },
    health: 95,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.014,
  },
  {
    id: "dev-004",
    name: "Reception Desk Computer",
    type: "appliance",
    status: "online",
    location: { room: "Reception", floor: 1, building: "Building A", position: { x: 2, y: 1, z: 2 } },
    consumption: { current: 250, average: 230, peak: 280, level: "low" },
    health: 92,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.03,
  },
  // Building A - Floor 2
  {
    id: "dev-005",
    name: "Lab 201 HVAC System",
    type: "hvac",
    status: "online",
    location: { room: "Lab 201", floor: 2, building: "Building A", position: { x: 8, y: 2, z: 8 } },
    consumption: { current: 2800, average: 2600, peak: 3200, level: "high" },
    health: 88,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.34,
  },
  {
    id: "dev-006",
    name: "Lab 201 Centrifuge",
    type: "lab-equipment",
    status: "online",
    location: { room: "Lab 201", floor: 2, building: "Building A", position: { x: 6, y: 1, z: 6 } },
    consumption: { current: 1500, average: 1400, peak: 1800, level: "medium" },
    health: 90,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.18,
  },
  {
    id: "dev-007",
    name: "Lab 201 Fume Hood",
    type: "lab-equipment",
    status: "warning",
    location: { room: "Lab 201", floor: 2, building: "Building A", position: { x: 10, y: 1, z: 6 } },
    consumption: { current: 1200, average: 900, peak: 1300, level: "medium" },
    health: 65,
    lastUpdate: new Date(),
    anomalyDetected: true,
    costPerHour: 0.14,
  },
  {
    id: "dev-008",
    name: "Office 202 Lighting",
    type: "light",
    status: "online",
    location: { room: "Office 202", floor: 2, building: "Building A", position: { x: 15, y: 3, z: 5 } },
    consumption: { current: 180, average: 170, peak: 200, level: "low" },
    health: 94,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.022,
  },
  // Building B - Floor 1
  {
    id: "dev-009",
    name: "Server Room AC",
    type: "ac",
    status: "online",
    location: { room: "Server Room", floor: 1, building: "Building B", position: { x: 5, y: 2, z: 5 } },
    consumption: { current: 4200, average: 4000, peak: 4500, level: "high" },
    health: 82,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.5,
  },
  {
    id: "dev-010",
    name: "Server Rack 1",
    type: "server",
    status: "online",
    location: { room: "Server Room", floor: 1, building: "Building B", position: { x: 3, y: 1, z: 3 } },
    consumption: { current: 2200, average: 2100, peak: 2400, level: "high" },
    health: 96,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.26,
  },
  {
    id: "dev-011",
    name: "Server Rack 2",
    type: "server",
    status: "online",
    location: { room: "Server Room", floor: 1, building: "Building B", position: { x: 7, y: 1, z: 3 } },
    consumption: { current: 2400, average: 2200, peak: 2600, level: "high" },
    health: 94,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.29,
  },
  {
    id: "dev-012",
    name: "Cafeteria Refrigerator 1",
    type: "appliance",
    status: "online",
    location: { room: "Cafeteria", floor: 1, building: "Building B", position: { x: 12, y: 1, z: 8 } },
    consumption: { current: 800, average: 750, peak: 900, level: "medium" },
    health: 87,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.096,
  },
  {
    id: "dev-013",
    name: "Cafeteria Refrigerator 2",
    type: "appliance",
    status: "online",
    location: { room: "Cafeteria", floor: 1, building: "Building B", position: { x: 14, y: 1, z: 8 } },
    consumption: { current: 820, average: 760, peak: 920, level: "medium" },
    health: 89,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.098,
  },
  {
    id: "dev-014",
    name: "Cafeteria Oven",
    type: "appliance",
    status: "online",
    location: { room: "Cafeteria", floor: 1, building: "Building B", position: { x: 16, y: 1, z: 10 } },
    consumption: { current: 3000, average: 2800, peak: 3500, level: "high" },
    health: 91,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.36,
  },
  // Building B - Floor 2
  {
    id: "dev-015",
    name: "Classroom 201 AC",
    type: "ac",
    status: "online",
    location: { room: "Classroom 201", floor: 2, building: "Building B", position: { x: 8, y: 2, z: 8 } },
    consumption: { current: 2500, average: 2300, peak: 2800, level: "high" },
    health: 86,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.3,
  },
  {
    id: "dev-016",
    name: "Classroom 201 Projector",
    type: "appliance",
    status: "online",
    location: { room: "Classroom 201", floor: 2, building: "Building B", position: { x: 8, y: 2.5, z: 12 } },
    consumption: { current: 350, average: 340, peak: 380, level: "low" },
    health: 93,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.042,
  },
  {
    id: "dev-017",
    name: "Classroom 202 AC",
    type: "ac",
    status: "online",
    location: { room: "Classroom 202", floor: 2, building: "Building B", position: { x: 18, y: 2, z: 8 } },
    consumption: { current: 2600, average: 2400, peak: 2900, level: "high" },
    health: 84,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.31,
  },
  {
    id: "dev-018",
    name: "Classroom 202 Lighting",
    type: "light",
    status: "online",
    location: { room: "Classroom 202", floor: 2, building: "Building B", position: { x: 18, y: 3, z: 8 } },
    consumption: { current: 200, average: 190, peak: 220, level: "low" },
    health: 96,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.024,
  },
  // Building C - Floor 1
  {
    id: "dev-019",
    name: "Gym HVAC System",
    type: "hvac",
    status: "online",
    location: { room: "Gym", floor: 1, building: "Building C", position: { x: 10, y: 2, z: 10 } },
    consumption: { current: 3200, average: 3000, peak: 3600, level: "high" },
    health: 80,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.38,
  },
  {
    id: "dev-020",
    name: "Gym Lighting System",
    type: "light",
    status: "online",
    location: { room: "Gym", floor: 1, building: "Building C", position: { x: 10, y: 4, z: 10 } },
    consumption: { current: 450, average: 430, peak: 480, level: "medium" },
    health: 92,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.054,
  },
  {
    id: "dev-021",
    name: "Library AC Unit 1",
    type: "ac",
    status: "online",
    location: { room: "Library", floor: 1, building: "Building C", position: { x: 5, y: 2, z: 15 } },
    consumption: { current: 2200, average: 2000, peak: 2500, level: "high" },
    health: 88,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.26,
  },
  {
    id: "dev-022",
    name: "Library AC Unit 2",
    type: "ac",
    status: "online",
    location: { room: "Library", floor: 1, building: "Building C", position: { x: 15, y: 2, z: 15 } },
    consumption: { current: 2300, average: 2100, peak: 2600, level: "high" },
    health: 86,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.28,
  },
  {
    id: "dev-023",
    name: "Library Computers (20 units)",
    type: "appliance",
    status: "online",
    location: { room: "Library", floor: 1, building: "Building C", position: { x: 10, y: 1, z: 15 } },
    consumption: { current: 4000, average: 3800, peak: 4500, level: "high" },
    health: 90,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.48,
  },
  // Building C - Floor 2
  {
    id: "dev-024",
    name: "Auditorium Sound System",
    type: "appliance",
    status: "online",
    location: { room: "Auditorium", floor: 2, building: "Building C", position: { x: 12, y: 2, z: 10 } },
    consumption: { current: 1800, average: 1600, peak: 2000, level: "medium" },
    health: 91,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.22,
  },
  {
    id: "dev-025",
    name: "Auditorium Lighting",
    type: "light",
    status: "online",
    location: { room: "Auditorium", floor: 2, building: "Building C", position: { x: 12, y: 4, z: 10 } },
    consumption: { current: 600, average: 580, peak: 650, level: "medium" },
    health: 94,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.072,
  },
  {
    id: "dev-026",
    name: "Auditorium HVAC",
    type: "hvac",
    status: "online",
    location: { room: "Auditorium", floor: 2, building: "Building C", position: { x: 12, y: 2, z: 5 } },
    consumption: { current: 3800, average: 3500, peak: 4200, level: "high" },
    health: 83,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.46,
  },
  {
    id: "dev-027",
    name: "Conference Room AC",
    type: "ac",
    status: "error",
    location: { room: "Conference Room", floor: 2, building: "Building C", position: { x: 20, y: 2, z: 8 } },
    consumption: { current: 0, average: 2000, peak: 2400, level: "high" },
    health: 0,
    lastUpdate: new Date(),
    anomalyDetected: true,
    costPerHour: 0,
  },
  {
    id: "dev-028",
    name: "Conference Room Display",
    type: "appliance",
    status: "online",
    location: { room: "Conference Room", floor: 2, building: "Building C", position: { x: 20, y: 2, z: 12 } },
    consumption: { current: 280, average: 270, peak: 300, level: "low" },
    health: 95,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.034,
  },
  {
    id: "dev-029",
    name: "Storage Room Lighting",
    type: "light",
    status: "online",
    location: { room: "Storage", floor: 2, building: "Building C", position: { x: 25, y: 3, z: 5 } },
    consumption: { current: 80, average: 75, peak: 90, level: "low" },
    health: 97,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.01,
  },
  {
    id: "dev-030",
    name: "Parking Lot Lighting",
    type: "light",
    status: "online",
    location: { room: "Parking Lot", floor: 0, building: "Outdoor", position: { x: 0, y: 5, z: 0 } },
    consumption: { current: 1200, average: 1150, peak: 1300, level: "medium" },
    health: 89,
    lastUpdate: new Date(),
    anomalyDetected: false,
    costPerHour: 0.14,
  },
]

// Generate time-series data for charts
export function generateTimeSeriesData(deviceId: string, hours = 24): EnergyReading[] {
  const device = mockDevices.find((d) => d.id === deviceId)
  if (!device) return []

  const readings: EnergyReading[] = []
  const now = new Date()

  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    const baseConsumption = device.consumption.average
    const variance = (Math.random() - 0.5) * 0.3 * baseConsumption
    const consumption = Math.max(0, baseConsumption + variance)

    readings.push({
      timestamp,
      deviceId,
      consumption,
      voltage: 220 + (Math.random() - 0.5) * 10,
      current: consumption / 220,
    })
  }

  return readings
}

// Calculate total consumption by building
export function getTotalConsumptionByBuilding() {
  const buildings = ["Building A", "Building B", "Building C", "Outdoor"]
  return buildings.map((building) => {
    const devices = mockDevices.filter((d) => d.location.building === building)
    const total = devices.reduce((sum, d) => sum + d.consumption.current, 0)
    return { building, consumption: total, deviceCount: devices.length }
  })
}

// Calculate total consumption by device type
export function getTotalConsumptionByType() {
  const types: DeviceType[] = ["ac", "light", "server", "appliance", "hvac", "lab-equipment"]
  return types.map((type) => {
    const devices = mockDevices.filter((d) => d.type === type)
    const total = devices.reduce((sum, d) => sum + d.consumption.current, 0)
    return { type, consumption: total, deviceCount: devices.length }
  })
}

// Get devices by consumption level
export function getDevicesByConsumptionLevel(level: ConsumptionLevel) {
  return mockDevices.filter((d) => d.consumption.level === level)
}

// Get devices with anomalies
export function getDevicesWithAnomalies() {
  return mockDevices.filter((d) => d.anomalyDetected)
}

// Calculate energy savings potential
export function calculateSavingsPotential() {
  const highConsumptionDevices = getDevicesByConsumptionLevel("high")
  const potentialSavings = highConsumptionDevices.reduce((sum, d) => {
    return sum + (d.consumption.current - d.consumption.average) * 0.7
  }, 0)

  return {
    potentialSavingsWatts: potentialSavings,
    potentialSavingsCost: potentialSavings * 0.00012, // per hour
    affectedDevices: highConsumptionDevices.length,
  }
}

// SDG Impact Metrics
export function getSDGMetrics() {
  const totalConsumption = mockDevices.reduce((sum, d) => sum + d.consumption.current, 0)
  const totalCost = mockDevices.reduce((sum, d) => sum + d.costPerHour, 0)

  // CO2 emissions: ~0.5 kg CO2 per kWh (average)
  const co2EmissionsPerHour = (totalConsumption / 1000) * 0.5
  const co2EmissionsPerDay = co2EmissionsPerHour * 24
  const co2EmissionsPerYear = co2EmissionsPerDay * 365

  return {
    totalConsumptionKW: totalConsumption / 1000,
    totalCostPerHour: totalCost,
    totalCostPerDay: totalCost * 24,
    totalCostPerMonth: totalCost * 24 * 30,
    co2EmissionsPerDay,
    co2EmissionsPerYear,
    sdg7Progress: 72, // Affordable and Clean Energy
    sdg13Progress: 68, // Climate Action
    devicesOptimized: mockDevices.filter((d) => d.consumption.level === "low").length,
    totalDevices: mockDevices.length,
  }
}

// Get rooms summary
export function getRoomsSummary(): Room[] {
  const roomsMap = new Map<string, Room>()

  mockDevices.forEach((device) => {
    const key = `${device.location.building}-${device.location.floor}-${device.location.room}`

    if (!roomsMap.has(key)) {
      roomsMap.set(key, {
        id: key,
        name: device.location.room,
        floor: device.location.floor,
        building: device.location.building,
        totalDevices: 0,
        totalConsumption: 0,
      })
    }

    const room = roomsMap.get(key)!
    room.totalDevices++
    room.totalConsumption += device.consumption.current
  })

  return Array.from(roomsMap.values())
}

export const devices = mockDevices
