// SCADA (Supervisory Control and Data Acquisition) System Data

export interface SCADANode {
  id: string
  name: string
  type: "substation" | "transformer" | "meter" | "breaker" | "load"
  status: "normal" | "warning" | "alarm" | "offline"
  voltage: number // volts
  current: number // amps
  power: number // watts
  powerFactor: number // 0-1
  frequency: number // Hz
  position: { x: number; y: number }
  connections: string[] // IDs of connected nodes
}

export interface SmartMeterData {
  meterId: string
  timestamp: Date
  activePower: number // kW
  reactivePower: number // kVAR
  apparentPower: number // kVA
  powerFactor: number
  voltage: { l1: number; l2: number; l3: number }
  current: { l1: number; l2: number; l3: number }
  frequency: number
  totalEnergy: number // kWh
  peakDemand: number // kW
  demandWindow: number // minutes
}

export interface LoadForecast {
  timestamp: Date
  predictedLoad: number // kW
  confidence: number // 0-1
  actualLoad?: number // kW (if available)
  weather: {
    temperature: number
    humidity: number
    cloudCover: number
  }
}

export interface DemandResponseEvent {
  id: string
  startTime: Date
  endTime: Date
  targetReduction: number // kW
  actualReduction: number // kW
  incentive: number // dollars
  status: "scheduled" | "active" | "completed" | "cancelled"
  participants: string[] // device IDs
}

// Mock SCADA nodes for campus electrical distribution
export const scadaNodes: SCADANode[] = [
  {
    id: "node-001",
    name: "Main Substation",
    type: "substation",
    status: "normal",
    voltage: 11000,
    current: 450,
    power: 4950000,
    powerFactor: 0.95,
    frequency: 60,
    position: { x: 50, y: 50 },
    connections: ["node-002", "node-003"],
  },
  {
    id: "node-002",
    name: "Transformer 1 (Building A)",
    type: "transformer",
    status: "normal",
    voltage: 480,
    current: 520,
    power: 249600,
    powerFactor: 0.92,
    frequency: 60,
    position: { x: 150, y: 100 },
    connections: ["node-001", "node-004", "node-005"],
  },
  {
    id: "node-003",
    name: "Transformer 2 (Building B&C)",
    type: "transformer",
    status: "normal",
    voltage: 480,
    current: 680,
    power: 326400,
    powerFactor: 0.93,
    frequency: 60,
    position: { x: 150, y: 200 },
    connections: ["node-001", "node-006", "node-007"],
  },
  {
    id: "node-004",
    name: "Smart Meter - Building A Floor 1",
    type: "meter",
    status: "normal",
    voltage: 480,
    current: 260,
    power: 124800,
    powerFactor: 0.91,
    frequency: 60,
    position: { x: 250, y: 80 },
    connections: ["node-002", "node-008"],
  },
  {
    id: "node-005",
    name: "Smart Meter - Building A Floor 2",
    type: "meter",
    status: "normal",
    voltage: 480,
    current: 260,
    power: 124800,
    powerFactor: 0.93,
    frequency: 60,
    position: { x: 250, y: 120 },
    connections: ["node-002", "node-009"],
  },
  {
    id: "node-006",
    name: "Smart Meter - Building B",
    type: "meter",
    status: "warning",
    voltage: 475,
    current: 380,
    power: 180500,
    powerFactor: 0.89,
    frequency: 59.8,
    position: { x: 250, y: 180 },
    connections: ["node-003", "node-010"],
  },
  {
    id: "node-007",
    name: "Smart Meter - Building C",
    type: "meter",
    status: "normal",
    voltage: 480,
    current: 300,
    power: 144000,
    powerFactor: 0.94,
    frequency: 60,
    position: { x: 250, y: 220 },
    connections: ["node-003", "node-011"],
  },
  {
    id: "node-008",
    name: "Load Center - A1",
    type: "load",
    status: "normal",
    voltage: 480,
    current: 260,
    power: 124800,
    powerFactor: 0.91,
    frequency: 60,
    position: { x: 350, y: 80 },
    connections: ["node-004"],
  },
  {
    id: "node-009",
    name: "Load Center - A2",
    type: "load",
    status: "normal",
    voltage: 480,
    current: 260,
    power: 124800,
    powerFactor: 0.93,
    frequency: 60,
    position: { x: 350, y: 120 },
    connections: ["node-005"],
  },
  {
    id: "node-010",
    name: "Load Center - B",
    type: "load",
    status: "warning",
    voltage: 475,
    current: 380,
    power: 180500,
    powerFactor: 0.89,
    frequency: 59.8,
    position: { x: 350, y: 180 },
    connections: ["node-006"],
  },
  {
    id: "node-011",
    name: "Load Center - C",
    type: "load",
    status: "normal",
    voltage: 480,
    current: 300,
    power: 144000,
    powerFactor: 0.94,
    frequency: 60,
    position: { x: 350, y: 220 },
    connections: ["node-007"],
  },
]

// Generate smart meter readings
export function generateSmartMeterData(meterId: string, hours = 24): SmartMeterData[] {
  const readings: SmartMeterData[] = []
  const now = new Date()

  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    const baseLoad = 150 + Math.sin((i / 24) * Math.PI * 2) * 50
    const variance = (Math.random() - 0.5) * 20

    const activePower = baseLoad + variance
    const powerFactor = 0.9 + Math.random() * 0.08
    const apparentPower = activePower / powerFactor
    const reactivePower = Math.sqrt(apparentPower ** 2 - activePower ** 2)

    readings.push({
      meterId,
      timestamp,
      activePower,
      reactivePower,
      apparentPower,
      powerFactor,
      voltage: {
        l1: 277 + (Math.random() - 0.5) * 10,
        l2: 277 + (Math.random() - 0.5) * 10,
        l3: 277 + (Math.random() - 0.5) * 10,
      },
      current: {
        l1: activePower / (3 * 277 * powerFactor),
        l2: activePower / (3 * 277 * powerFactor),
        l3: activePower / (3 * 277 * powerFactor),
      },
      frequency: 60 + (Math.random() - 0.5) * 0.2,
      totalEnergy: 1000 + (hours - i) * activePower,
      peakDemand: activePower * 1.2,
      demandWindow: 15,
    })
  }

  return readings
}

// Generate load forecast
export function generateLoadForecast(hours = 48): LoadForecast[] {
  const forecasts: LoadForecast[] = []
  const now = new Date()

  for (let i = 0; i < hours; i++) {
    const timestamp = new Date(now.getTime() + i * 60 * 60 * 1000)
    const hour = timestamp.getHours()

    // Base load pattern (higher during day, lower at night)
    let baseLoad = 100
    if (hour >= 6 && hour < 9)
      baseLoad = 180 // Morning peak
    else if (hour >= 9 && hour < 17)
      baseLoad = 200 // Daytime
    else if (hour >= 17 && hour < 20)
      baseLoad = 220 // Evening peak
    else if (hour >= 20 && hour < 23)
      baseLoad = 150 // Evening
    else baseLoad = 80 // Night

    // Weather impact
    const temperature = 20 + Math.sin((hour / 24) * Math.PI * 2) * 10
    const tempImpact = temperature > 25 ? (temperature - 25) * 5 : 0

    const predictedLoad = baseLoad + tempImpact + (Math.random() - 0.5) * 10

    forecasts.push({
      timestamp,
      predictedLoad,
      confidence: 0.85 + Math.random() * 0.1,
      weather: {
        temperature,
        humidity: 50 + Math.random() * 30,
        cloudCover: Math.random(),
      },
    })
  }

  return forecasts
}

// Mock demand response events
export const demandResponseEvents: DemandResponseEvent[] = [
  {
    id: "dr-001",
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    targetReduction: 50,
    actualReduction: 0,
    incentive: 125,
    status: "scheduled",
    participants: ["dev-001", "dev-002", "dev-005", "dev-009"],
  },
  {
    id: "dr-002",
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    targetReduction: 75,
    actualReduction: 68,
    incentive: 170,
    status: "completed",
    participants: ["dev-001", "dev-002", "dev-005", "dev-009", "dev-015", "dev-017"],
  },
]

// Calculate grid metrics
export function calculateGridMetrics() {
  const totalPower = scadaNodes.reduce((sum, node) => sum + node.power, 0)
  const avgPowerFactor = scadaNodes.reduce((sum, node) => sum + node.powerFactor, 0) / scadaNodes.length
  const nodesWithIssues = scadaNodes.filter((n) => n.status !== "normal").length

  return {
    totalPowerKW: totalPower / 1000,
    avgPowerFactor,
    gridEfficiency: avgPowerFactor * 100,
    nodesOnline: scadaNodes.filter((n) => n.status !== "offline").length,
    totalNodes: scadaNodes.length,
    nodesWithIssues,
    gridHealth: ((scadaNodes.length - nodesWithIssues) / scadaNodes.length) * 100,
  }
}
