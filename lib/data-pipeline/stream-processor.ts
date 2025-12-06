export interface DataPoint {
  deviceId: string
  timestamp: number
  value: number
  unit: string
  quality: "good" | "fair" | "poor"
}

export interface AggregatedData {
  deviceId: string
  timeWindow: string
  avg: number
  min: number
  max: number
  sum: number
  count: number
  stdDev: number
}

export class StreamProcessor {
  private buffer: Map<string, DataPoint[]> = new Map()
  private readonly bufferSize = 1000
  private readonly flushInterval = 5000 // 5 seconds

  constructor() {
    this.startAutoFlush()
  }

  // Feature 1: Real-time data ingestion
  ingest(dataPoint: DataPoint) {
    const key = dataPoint.deviceId
    if (!this.buffer.has(key)) {
      this.buffer.set(key, [])
    }

    const deviceBuffer = this.buffer.get(key)!
    deviceBuffer.push(dataPoint)

    // Feature 2: Automatic buffer management
    if (deviceBuffer.length > this.bufferSize) {
      deviceBuffer.shift()
    }
  }

  // Feature 3: Time-window aggregation
  aggregate(deviceId: string, windowMinutes: number): AggregatedData | null {
    const data = this.buffer.get(deviceId)
    if (!data || data.length === 0) return null

    const now = Date.now()
    const windowMs = windowMinutes * 60 * 1000
    const windowData = data.filter((d) => now - d.timestamp < windowMs)

    if (windowData.length === 0) return null

    const values = windowData.map((d) => d.value)
    const sum = values.reduce((a, b) => a + b, 0)
    const avg = sum / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)

    // Feature 4: Statistical analysis
    const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length
    const stdDev = Math.sqrt(variance)

    return {
      deviceId,
      timeWindow: `${windowMinutes}m`,
      avg,
      min,
      max,
      sum,
      count: values.length,
      stdDev,
    }
  }

  // Feature 5: Data quality monitoring
  getDataQuality(deviceId: string): { good: number; fair: number; poor: number } {
    const data = this.buffer.get(deviceId) || []
    const quality = { good: 0, fair: 0, poor: 0 }

    data.forEach((d) => {
      quality[d.quality]++
    })

    return quality
  }

  // Feature 6: Anomaly detection using Z-score
  detectAnomalies(deviceId: string, threshold = 3): DataPoint[] {
    const aggregated = this.aggregate(deviceId, 60)
    if (!aggregated) return []

    const data = this.buffer.get(deviceId) || []
    return data.filter((d) => {
      const zScore = Math.abs((d.value - aggregated.avg) / aggregated.stdDev)
      return zScore > threshold
    })
  }

  private startAutoFlush() {
    setInterval(() => {
      // Feature 7: Automatic data persistence simulation
      this.buffer.forEach((data, deviceId) => {
        if (data.length > this.bufferSize * 0.8) {
          console.log(`[v0] Flushing ${data.length} records for device ${deviceId}`)
        }
      })
    }, this.flushInterval)
  }

  // Feature 8: Data compression for historical storage
  compress(deviceId: string, compressionRatio = 10): DataPoint[] {
    const data = this.buffer.get(deviceId) || []
    return data.filter((_, index) => index % compressionRatio === 0)
  }

  // Feature 9: Real-time rate calculation
  getConsumptionRate(deviceId: string, minutes = 5): number {
    const aggregated = this.aggregate(deviceId, minutes)
    return aggregated ? aggregated.sum / minutes : 0
  }

  // Feature 10: Peak detection
  detectPeaks(deviceId: string, windowMinutes = 60): DataPoint[] {
    const aggregated = this.aggregate(deviceId, windowMinutes)
    if (!aggregated) return []

    const data = this.buffer.get(deviceId) || []
    const threshold = aggregated.avg + aggregated.stdDev

    return data.filter((d) => d.value > threshold)
  }
}

// Feature 11: Global stream processor instance
export const streamProcessor = new StreamProcessor()
