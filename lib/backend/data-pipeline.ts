// Real data processing pipeline
import { getIoTSimulator } from "./iot-simulator"

export interface ProcessedData {
  deviceId: string
  timestamp: string
  metrics: {
    consumption: number
    voltage: number
    current: number
    powerFactor: number
    temperature: number
  }
  analytics: {
    efficiency: number
    costPerHour: number
    co2Emissions: number
    anomalyScore: number
  }
  predictions: {
    nextHourConsumption: number
    dailyCost: number
    maintenanceRisk: number
  }
}

export class DataPipeline {
  private simulator = getIoTSimulator()
  private readonly COST_PER_KWH = 0.12 // $0.12 per kWh
  private readonly CO2_PER_KWH = 0.5 // kg CO2 per kWh

  async processDeviceData(deviceId: string): Promise<ProcessedData | null> {
    const device = this.simulator.getDevice(deviceId)
    if (!device) return null

    const history = this.simulator.getConsumptionHistory(deviceId, 24)

    return {
      deviceId,
      timestamp: new Date().toISOString(),
      metrics: {
        consumption: device.consumption,
        voltage: device.voltage,
        current: device.current,
        powerFactor: device.powerFactor,
        temperature: device.temperature,
      },
      analytics: {
        efficiency: this.calculateEfficiency(device),
        costPerHour: (device.consumption / 1000) * this.COST_PER_KWH,
        co2Emissions: (device.consumption / 1000) * this.CO2_PER_KWH,
        anomalyScore: this.calculateAnomalyScore(device, history),
      },
      predictions: {
        nextHourConsumption: this.predictNextHour(history),
        dailyCost: this.predictDailyCost(history),
        maintenanceRisk: this.calculateMaintenanceRisk(device, history),
      },
    }
  }

  private calculateEfficiency(device: any): number {
    // Efficiency based on power factor and temperature
    const pfEfficiency = device.powerFactor * 100
    const tempEfficiency = device.temperature < 40 ? 100 : Math.max(50, 100 - (device.temperature - 40) * 2)
    return (pfEfficiency + tempEfficiency) / 2
  }

  private calculateAnomalyScore(device: any, history: any[]): number {
    if (history.length < 2) return 0

    const avgConsumption = history.reduce((sum, h) => sum + h.consumption, 0) / history.length
    const deviation = Math.abs(device.consumption - avgConsumption) / avgConsumption

    return Math.min(100, deviation * 100)
  }

  private predictNextHour(history: any[]): number {
    if (history.length < 3) return 0

    // Simple moving average prediction
    const recent = history.slice(-3)
    return recent.reduce((sum, h) => sum + h.consumption, 0) / recent.length
  }

  private predictDailyCost(history: any[]): number {
    const avgConsumption = history.reduce((sum, h) => sum + h.consumption, 0) / history.length
    return (avgConsumption / 1000) * 24 * this.COST_PER_KWH
  }

  private calculateMaintenanceRisk(device: any, history: any[]): number {
    let risk = 0

    // Health-based risk
    if (device.health < 70) risk += 30
    else if (device.health < 85) risk += 15

    // Anomaly-based risk
    if (device.anomaly) risk += 25

    // Temperature-based risk
    if (device.temperature > 45) risk += 20
    else if (device.temperature > 40) risk += 10

    // Voltage stability risk
    const voltageDeviation = Math.abs(device.voltage - 220) / 220
    if (voltageDeviation > 0.05) risk += 15

    return Math.min(100, risk)
  }

  async getAggregatedAnalytics() {
    const devices = this.simulator.getAllDevices()
    const totalConsumption = devices.filter((d) => d.status === "online").reduce((sum, d) => sum + d.consumption, 0)

    const totalCost = (totalConsumption / 1000) * this.COST_PER_KWH
    const totalCO2 = (totalConsumption / 1000) * this.CO2_PER_KWH

    const anomalies = devices.filter((d) => d.anomaly).length
    const offlineDevices = devices.filter((d) => d.status === "offline").length

    return {
      totalConsumption,
      totalCost,
      totalCO2,
      activeDevices: devices.length - offlineDevices,
      totalDevices: devices.length,
      anomalies,
      offlineDevices,
      averageHealth: devices.reduce((sum, d) => sum + d.health, 0) / devices.length,
      efficiency: (devices.reduce((sum, d) => sum + d.powerFactor, 0) / devices.length) * 100,
    }
  }

  async getConsumptionTrends(hours = 24) {
    const devices = this.simulator.getAllDevices()
    const trends = []

    for (let i = hours; i >= 0; i--) {
      const timestamp = new Date(Date.now() - i * 60 * 60 * 1000)
      const hour = timestamp.getHours()
      const isBusinessHours = hour >= 9 && hour <= 18

      const totalConsumption = devices.reduce((sum, device) => {
        const baseConsumption = device.consumption
        const loadFactor = isBusinessHours ? 0.8 : 0.4
        return sum + baseConsumption * loadFactor
      }, 0)

      trends.push({
        timestamp: timestamp.toISOString(),
        consumption: totalConsumption,
        cost: (totalConsumption / 1000) * this.COST_PER_KWH,
        co2: (totalConsumption / 1000) * this.CO2_PER_KWH,
      })
    }

    return trends
  }
}

export const dataPipeline = new DataPipeline()
