import { NextResponse } from "next/server"
import { getIoTSimulator } from "@/lib/backend/iot-simulator"
import type { DeviceData, ConsumptionRecord } from "@/lib/backend/iot-simulator"
import { getPatternRecognition } from "@/lib/ml/pattern-recognition"
import { getAnomalyDetector } from "@/lib/ml/anomaly-detector"
import { getOptimizationEngine } from "@/lib/ml/optimization-engine"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "24h"
    const deviceId = searchParams.get("deviceId") || "all"

    const simulator = getIoTSimulator()
    const patternRecognition = getPatternRecognition()
    const anomalyDetector = getAnomalyDetector()
    const optimizationEngine = getOptimizationEngine()

    // Get current and historical data from IoT simulator
    const devices = deviceId === "all" ? simulator.getAllDevices() : [simulator.getDevice(deviceId)].filter(Boolean)
    
    // Generate time series data from consumption history
    const timeSeriesData = devices.flatMap(device => {
      if (!device) return []
      const history = simulator.getConsumptionHistory(device.id, 24)
      return history.map(record => ({
        timestamp: record.timestamp,
        power: record.consumption.toString(),
        voltage: record.voltage.toString(),
        current: record.current.toString(),
        frequency: "50",
        powerFactor: record.powerFactor.toString(),
        thd: (Math.random() * 2 + 1).toString() // Typical THD 1-3%
      }))
    })
    
    // Run pattern recognition on the time series data
    const patterns = await patternRecognition.detectPatterns({
      timeRange,
      deviceId: deviceId === "all" ? devices[0]?.id || "" : deviceId
    })

    // Detect anomalies in the data
    const anomalies = await anomalyDetector.detectAnomalies({
      timeRange,
      deviceId: deviceId === "all" ? devices[0]?.id || "" : deviceId
    })

    // Process load profiles from time series data
    const loadProfiles = timeSeriesData.map((record, index) => {
      const timestamp = record.timestamp
      const power = parseFloat(record.power)
      
      // Calculate base load as 30% of power
      const baseLoad = (power * 0.3).toFixed(2)
      
      // Calculate peak load using a daily pattern
      const hour = new Date(timestamp).getHours()
      const peakFactor = 1 + Math.sin(hour * Math.PI / 12) * 0.5 // Peak at noon and low at midnight
      const peakLoad = (power * peakFactor).toFixed(2)
      
      // Calculate average load between base and peak
      const avgLoad = ((parseFloat(baseLoad) + parseFloat(peakLoad)) / 2).toFixed(2)

      return {
        timestamp,
        baseLoad,
        peakLoad,
        avgLoad
      }
    })

    // Calculate power quality metrics
    const powerQualityData = [
      {
        metric: "voltageQuality",
        value: parseFloat(((timeSeriesData.reduce((sum, record) => 
          sum + Math.abs(parseFloat(record.voltage) - 230), 0) / timeSeriesData.length) / 230 * 100).toFixed(2)),
        status: "normal",
        threshold: 5
      },
      {
        metric: "currentQuality",
        value: parseFloat(((timeSeriesData.reduce((sum, record) => 
          sum + Math.abs(parseFloat(record.current) - 10), 0) / timeSeriesData.length) / 10 * 100).toFixed(2)),
        status: "normal",
        threshold: 10
      },
      {
        metric: "thd",
        value: parseFloat((timeSeriesData.reduce((sum, record) => 
          sum + parseFloat(record.thd), 0) / timeSeriesData.length).toFixed(2)),
        status: "normal",
        threshold: 3
      },
      {
        metric: "powerFactor",
        value: parseFloat((timeSeriesData.reduce((sum, record) => 
          sum + parseFloat(record.powerFactor), 0) / timeSeriesData.length).toFixed(2)),
        status: "normal",
        threshold: 0.9
      }
    ]

    powerQualityData.forEach(metric => {
      metric.status = metric.value < metric.threshold ? "normal" : "warning"
    })

    // Calculate device type breakdown for appliance analysis
    const applianceBreakdown = Array.from(devices.entries())
      .reduce((acc, [_, device]) => {
        const existingType = acc.find(a => a.name === device.type)
        if (existingType) {
          existingType.consumption += device.consumption
          existingType.cost += device.consumption * 0.12 // Assuming $0.12 per kWh
        } else {
          acc.push({
            name: device.type,
            consumption: device.consumption,
            cost: device.consumption * 0.12,
            efficiency: device.efficiency || 85
          })
        }
        return acc
      }, [] as Array<{ name: string; consumption: number; cost: number; efficiency: number }>)
      
    // Convert consumption to percentages
    const totalConsumption = applianceBreakdown.reduce((sum, app) => sum + app.consumption, 0)
    applianceBreakdown.forEach(app => {
      app.consumption = parseFloat(((app.consumption / totalConsumption) * 100).toFixed(2))
      app.cost = parseFloat(app.cost.toFixed(2))
    })

    // Get optimization recommendations based on analysis
    const recommendations = await optimizationEngine.getRecommendations({
      deviceId: deviceId === "all" ? devices[0]?.id || "" : deviceId,
      includeROI: true
    })

    // Calculate peak demand times from time series data
    const peakDemandTimes = timeSeriesData
      .sort((a, b) => parseFloat(b.power) - parseFloat(a.power))
      .slice(0, 5)
      .map(record => ({
        timestamp: record.timestamp,
        power: parseFloat(record.power).toFixed(2),
        cost: (parseFloat(record.power) * 0.12).toFixed(2) // Cost during peak times
      }))

    // Calculate cost analysis
    const costPerKwh = 0.12 // Standard rate
    const totalPowerConsumption = timeSeriesData.reduce((sum, record) => 
      sum + parseFloat(record.power), 0)
    const hourlyAvg = totalPowerConsumption / timeSeriesData.length
    
    const costAnalysis = {
      totalConsumption: totalPowerConsumption.toFixed(2),
      totalCost: (totalPowerConsumption * costPerKwh).toFixed(2),
      averageHourly: hourlyAvg.toFixed(2),
      projectedMonthlyCost: (hourlyAvg * 24 * 30 * costPerKwh).toFixed(2)
    }

    return NextResponse.json({
      success: true,
      data: {
        timeSeriesData,
        loadProfiles,
        powerQualityData,
        mlInsights: {
          patterns,
          anomalies,
          recommendations
        },
        applianceBreakdown,
        peakDemandTimes,
        costAnalysis
      }
    })
  } catch (error) {
    console.error("Error in analytics API:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}