import { getIoTSimulator } from "@/lib/backend/iot-simulator"
import type { DeviceData } from "@/lib/backend/iot-simulator"

export interface TimeSeriesRecord {
  timestamp: number
  deviceId: string
  metric: string
  value: number
  tags: Record<string, string>
}

export class TimeSeriesDB {
  private static instance: TimeSeriesDB
  private data: TimeSeriesRecord[] = []
  private indexes: Map<string, number[]> = new Map()
  private simulator = getIoTSimulator()

  private constructor() {
    // Subscribe to real-time IoT data
    this.simulator.onData((deviceData) => {
      const timestamp = Date.now()
      Object.entries(deviceData).forEach(([deviceId, data]: [string, any]) => {
        // Store each metric as a separate record
        this.insert({
          timestamp,
          deviceId,
          metric: 'power',
          value: data.consumption,
          tags: { type: data.type, location: data.location }
        })
        this.insert({
          timestamp,
          deviceId,
          metric: 'voltage',
          value: data.voltage,
          tags: { type: data.type, location: data.location }
        })
        this.insert({
          timestamp,
          deviceId,
          metric: 'current',
          value: data.current,
          tags: { type: data.type, location: data.location }
        })
        this.insert({
          timestamp,
          deviceId,
          metric: 'powerFactor',
          value: data.powerFactor,
          tags: { type: data.type, location: data.location }
        })
      })
    })
  }

  public static getInstance(): TimeSeriesDB {
    if (!TimeSeriesDB.instance) {
      TimeSeriesDB.instance = new TimeSeriesDB()
    }
    return TimeSeriesDB.instance
  }

  // Feature 12: Efficient time-series storage
  insert(record: TimeSeriesRecord) {
    const index = this.data.length
    this.data.push(record)

    // Feature 13: Multi-dimensional indexing
    const key = `${record.deviceId}:${record.metric}`
    if (!this.indexes.has(key)) {
      this.indexes.set(key, [])
    }
    this.indexes.get(key)!.push(index)
  }

  // Feature 14: Time-range queries
  query(deviceId: string, metric: string, startTime: number, endTime: number): TimeSeriesRecord[] {
    const key = `${deviceId}:${metric}`
    const indexes = this.indexes.get(key) || []

    return indexes.map((i) => this.data[i]).filter((r) => r.timestamp >= startTime && r.timestamp <= endTime)
  }

  // Feature 15: Downsampling for visualization
  downsample(records: TimeSeriesRecord[], targetPoints: number): TimeSeriesRecord[] {
    if (records.length <= targetPoints) return records

    const step = Math.floor(records.length / targetPoints)
    return records.filter((_, i) => i % step === 0)
  }

  // Feature 16: Moving average calculation
  movingAverage(records: TimeSeriesRecord[], windowSize: number): number[] {
    const result: number[] = []
    for (let i = 0; i < records.length; i++) {
      const start = Math.max(0, i - windowSize + 1)
      const window = records.slice(start, i + 1)
      const avg = window.reduce((sum, r) => sum + r.value, 0) / window.length
      result.push(avg)
    }
    return result
  }

  // Feature 17: Data retention policy
  applyRetentionPolicy(retentionDays: number) {
    const cutoffTime = Date.now() - retentionDays * 24 * 60 * 60 * 1000
    this.data = this.data.filter((r) => r.timestamp > cutoffTime)
    this.rebuildIndexes()
  }

  private rebuildIndexes() {
    this.indexes.clear()
    this.data.forEach((record, index) => {
      const key = `${record.deviceId}:${record.metric}`
      if (!this.indexes.has(key)) {
        this.indexes.set(key, [])
      }
      this.indexes.get(key)!.push(index)
    })
  }

  // Feature 18: Export to CSV
  exportToCSV(deviceId: string, metric: string): string {
    const key = `${deviceId}:${metric}`
    const indexes = this.indexes.get(key) || []
    const records = indexes.map((i) => this.data[i])

    let csv = "timestamp,deviceId,metric,value,tags\n"
    records.forEach((r) => {
      csv += `${r.timestamp},${r.deviceId},${r.metric},${r.value},"${JSON.stringify(r.tags)}"\n`
    })
    return csv
  }

  // Feature 19: Data interpolation for missing points
  interpolate(records: TimeSeriesRecord[], interval: number): TimeSeriesRecord[] {
    if (records.length < 2) return records

    const result: TimeSeriesRecord[] = []
    for (let i = 0; i < records.length - 1; i++) {
      result.push(records[i])

      const current = records[i]
      const next = records[i + 1]
      const timeDiff = next.timestamp - current.timestamp

      if (timeDiff > interval) {
        const steps = Math.floor(timeDiff / interval)
        for (let j = 1; j < steps; j++) {
          const ratio = j / steps
          result.push({
            ...current,
            timestamp: current.timestamp + interval * j,
            value: current.value + (next.value - current.value) * ratio,
          })
        }
      }
    }
    result.push(records[records.length - 1])
    return result
  }

  // Feature 20: Percentile calculation
  calculatePercentile(records: TimeSeriesRecord[], percentile: number): number {
    const values = records.map((r) => r.value).sort((a, b) => a - b)
    const index = Math.ceil((percentile / 100) * values.length) - 1
    return values[index] || 0
  }

  // Convert time range string to milliseconds
  private parseTimeRange(timeRange: string): number {
    const value = parseInt(timeRange)
    const unit = timeRange.slice(-1)
    switch (unit) {
      case 'h': return value * 60 * 60 * 1000
      case 'd': return value * 24 * 60 * 60 * 1000
      case 'w': return value * 7 * 24 * 60 * 60 * 1000
      case 'm': return value * 30 * 24 * 60 * 60 * 1000
      default: return 24 * 60 * 60 * 1000 // default to 24h
    }
  }

  // Get peak demand times
  async getPeakDemandTimes({ timeRange, deviceId }: {
    timeRange: string;
    deviceId: string;
  }): Promise<{
    daily: { hour: number; demand: number }[];
    weekly: { day: number; demand: number }[];
    monthly: { month: number; demand: number }[];
  }> {
    const endTime = Date.now()
    const startTime = endTime - this.parseTimeRange(timeRange)
    
    // Get power data
    const powerData = deviceId === 'all'
      ? this.data.filter(r => r.metric === 'power' && r.timestamp >= startTime)
      : this.query(deviceId, 'power', startTime, endTime)

    // Daily peaks (by hour)
    const dailyPeaks = new Array(24).fill(0)
    // Weekly peaks (by day)
    const weeklyPeaks = new Array(7).fill(0)
    // Monthly peaks (by month)
    const monthlyPeaks = new Array(12).fill(0)

    powerData.forEach(record => {
      const date = new Date(record.timestamp)
      const hour = date.getHours()
      const day = date.getDay()
      const month = date.getMonth()

      dailyPeaks[hour] = Math.max(dailyPeaks[hour], record.value)
      weeklyPeaks[day] = Math.max(weeklyPeaks[day], record.value)
      monthlyPeaks[month] = Math.max(monthlyPeaks[month], record.value)
    })

    return {
      daily: dailyPeaks.map((demand, hour) => ({ hour, demand })),
      weekly: weeklyPeaks.map((demand, day) => ({ day, demand })),
      monthly: monthlyPeaks.map((demand, month) => ({ month, demand }))
    }
  }

  // Get cost analysis
  async getCostAnalysis({ timeRange, deviceId }: {
    timeRange: string;
    deviceId: string;
  }): Promise<{
    total: number;
    byTimeOfDay: { offPeak: number; peak: number; shoulder: number };
    projected: number;
    comparison: { amount: number; percentage: number };
  }> {
    const endTime = Date.now()
    const startTime = endTime - this.parseTimeRange(timeRange)
    
    // Get power consumption data
    const powerData = deviceId === 'all'
      ? this.data.filter(r => r.metric === 'power' && r.timestamp >= startTime)
      : this.query(deviceId, 'power', startTime, endTime)

    // Define time-of-use periods (hours)
    const peakHours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    const shoulderHours = [7, 8, 21, 22]
    const rates = { peak: 0.40, shoulder: 0.25, offPeak: 0.15 } // $ per kWh

    let peakCost = 0
    let shoulderCost = 0
    let offPeakCost = 0

    powerData.forEach(record => {
      const hour = new Date(record.timestamp).getHours()
      const consumption = record.value * (5 / 60000) // Convert 5-min kW readings to kWh

      if (peakHours.includes(hour)) {
        peakCost += consumption * rates.peak
      } else if (shoulderHours.includes(hour)) {
        shoulderCost += consumption * rates.shoulder
      } else {
        offPeakCost += consumption * rates.offPeak
      }
    })

    const total = peakCost + shoulderCost + offPeakCost

    // Calculate projected cost (simple linear projection)
    const daysInPeriod = (endTime - startTime) / (24 * 60 * 60 * 1000)
    const dailyAverage = total / daysInPeriod
    const projected = dailyAverage * 30 // Project for a month

    // Compare with previous period
    const prevStartTime = startTime - (endTime - startTime)
    const prevPowerData = deviceId === 'all'
      ? this.data.filter(r => r.metric === 'power' && r.timestamp >= prevStartTime && r.timestamp < startTime)
      : this.query(deviceId, 'power', prevStartTime, startTime)

    let prevTotal = 0
    prevPowerData.forEach(record => {
      const hour = new Date(record.timestamp).getHours()
      const consumption = record.value * (5 / 60000)

      if (peakHours.includes(hour)) {
        prevTotal += consumption * rates.peak
      } else if (shoulderHours.includes(hour)) {
        prevTotal += consumption * rates.shoulder
      } else {
        prevTotal += consumption * rates.offPeak
      }
    })

    const difference = total - prevTotal
    const percentageChange = prevTotal ? (difference / prevTotal) * 100 : 0

    return {
      total,
      byTimeOfDay: {
        peak: peakCost,
        shoulder: shoulderCost,
        offPeak: offPeakCost
      },
      projected,
      comparison: {
        amount: difference,
        percentage: percentageChange
      }
    }
  }

  // Get metrics data for specific device and timerange
  async getMetrics({ timeRange, deviceId, metrics }: {
    timeRange: string
    deviceId: string
    metrics: string[]
  }): Promise<Record<string, TimeSeriesRecord[]>> {
    const endTime = Date.now()
    const startTime = endTime - this.parseTimeRange(timeRange)
    
    const result: Record<string, TimeSeriesRecord[]> = {}
    
    for (const metric of metrics) {
      if (deviceId === 'all') {
        // Get data for all devices
        result[metric] = this.data.filter(r => 
          r.metric === metric &&
          r.timestamp >= startTime &&
          r.timestamp <= endTime
        )
      } else {
        result[metric] = this.query(deviceId, metric, startTime, endTime)
      }
    }

    return result
  }

  // Get load profiles for specific device and timerange
  // Get power quality metrics for a device
  async getPowerQuality({ deviceId }: { deviceId: string }): Promise<{
    powerFactor: { avg: number; min: number; max: number }
    thd: { voltage: number; current: number }
    voltageImbalance: number
    currentImbalance: number
    frequency: { avg: number; deviation: number }
  }> {
    const endTime = Date.now()
    const startTime = endTime - 24 * 60 * 60 * 1000 // Last 24 hours for power quality

    // Get power quality metrics
    const powerFactorData = deviceId === 'all'
      ? this.data.filter(r => r.metric === 'powerFactor' && r.timestamp >= startTime)
      : this.query(deviceId, 'powerFactor', startTime, endTime)

    const thdVoltageData = deviceId === 'all'
      ? this.data.filter(r => r.metric === 'thdVoltage' && r.timestamp >= startTime)
      : this.query(deviceId, 'thdVoltage', startTime, endTime)

    const thdCurrentData = deviceId === 'all'
      ? this.data.filter(r => r.metric === 'thdCurrent' && r.timestamp >= startTime)
      : this.query(deviceId, 'thdCurrent', startTime, endTime)

    const frequencyData = deviceId === 'all'
      ? this.data.filter(r => r.metric === 'frequency' && r.timestamp >= startTime)
      : this.query(deviceId, 'frequency', startTime, endTime)

    // Calculate power factor stats
    const pfValues = powerFactorData.map(r => r.value)
    const powerFactor = {
      avg: pfValues.reduce((a, b) => a + b, 0) / (pfValues.length || 1),
      min: Math.min(...pfValues, 1),
      max: Math.max(...pfValues, 0)
    }

    // Calculate THD averages
    const thd = {
      voltage: thdVoltageData.reduce((sum, r) => sum + r.value, 0) / (thdVoltageData.length || 1),
      current: thdCurrentData.reduce((sum, r) => sum + r.value, 0) / (thdCurrentData.length || 1)
    }

    // Calculate frequency metrics
    const freqValues = frequencyData.map(r => r.value)
    const freqAvg = freqValues.reduce((a, b) => a + b, 0) / (freqValues.length || 1)
    const frequency = {
      avg: freqAvg,
      deviation: Math.sqrt(freqValues.reduce((sum, val) => sum + Math.pow(val - freqAvg, 2), 0) / (freqValues.length || 1))
    }

    // Calculate voltage and current imbalance (using latest values)
    const voltageImbalance = this.calculateImbalance(deviceId, 'voltage', startTime, endTime)
    const currentImbalance = this.calculateImbalance(deviceId, 'current', startTime, endTime)

    return {
      powerFactor,
      thd,
      voltageImbalance,
      currentImbalance,
      frequency
    }
  }

  // Helper method to calculate three-phase imbalance
  private calculateImbalance(deviceId: string, metric: string, startTime: number, endTime: number): number {
    const phases = ['A', 'B', 'C']
    const latestValues = phases.map(phase => {
      const data = deviceId === 'all'
        ? this.data.filter(r => r.metric === `${metric}${phase}` && r.timestamp >= startTime)
        : this.query(deviceId, `${metric}${phase}`, startTime, endTime)
      
      // Get the latest value
      return data.length > 0 ? data[data.length - 1].value : 0
    })

    const avg = latestValues.reduce((a, b) => a + b, 0) / 3
    const maxDeviation = Math.max(...latestValues.map(v => Math.abs(v - avg)))
    return (maxDeviation / avg) * 100 // Return as percentage
  }

  async getLoadProfiles({ timeRange, deviceId }: {
    timeRange: string
    deviceId: string
  }): Promise<{
    daily: number[]
    weekly: number[]
    monthly: number[]
  }> {
    const endTime = Date.now()
    const startTime = endTime - this.parseTimeRange(timeRange)
    
    // Get power consumption data
    const powerData = deviceId === 'all'
      ? this.data.filter(r => 
          r.metric === 'power' &&
          r.timestamp >= startTime &&
          r.timestamp <= endTime
        )
      : this.query(deviceId, 'power', startTime, endTime)

    // Calculate daily averages
    const daily = Array(24).fill(0)
    const dailyCounts = Array(24).fill(0)
    
    // Calculate weekly averages
    const weekly = Array(7).fill(0)
    const weeklyCounts = Array(7).fill(0)
    
    // Calculate monthly averages
    const monthly = Array(12).fill(0)
    const monthlyCounts = Array(12).fill(0)

    powerData.forEach(record => {
      const date = new Date(record.timestamp)
      
      // Daily
      const hour = date.getHours()
      daily[hour] += record.value
      dailyCounts[hour]++
      
      // Weekly
      const day = date.getDay()
      weekly[day] += record.value
      weeklyCounts[day]++
      
      // Monthly
      const month = date.getMonth()
      monthly[month] += record.value
      monthlyCounts[month]++
    })

    return {
      daily: daily.map((sum, i) => sum / (dailyCounts[i] || 1)),
      weekly: weekly.map((sum, i) => sum / (weeklyCounts[i] || 1)),
      monthly: monthly.map((sum, i) => sum / (monthlyCounts[i] || 1))
    }
  }
}

export const getTimeSeriesDB = () => TimeSeriesDB.getInstance()
