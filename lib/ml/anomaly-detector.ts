import { getTimeSeriesDB } from "../data-pipeline/time-series-db"
import { TimeSeriesRecord } from "../data-pipeline/time-series-db"

export interface Anomaly {
  timestamp: number
  deviceId: string
  value: number
  expectedValue: number
  severity: "low" | "medium" | "high" | "critical"
  type: "spike" | "drop" | "drift" | "pattern"
  confidence: number
}

export class AnomalyDetector {
  private static instance: AnomalyDetector

  private constructor() {}

  public static getInstance(): AnomalyDetector {
    if (!AnomalyDetector.instance) {
      AnomalyDetector.instance = new AnomalyDetector()
    }
    return AnomalyDetector.instance
  }

  // Feature 31: Z-Score based anomaly detection
  detectZScore(data: number[], threshold = 3): number[] {
    const mean = data.reduce((a, b) => a + b, 0) / data.length
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
    const stdDev = Math.sqrt(variance)

    return data
      .map((value, index) => {
        const zScore = Math.abs((value - mean) / stdDev)
        return zScore > threshold ? index : -1
      })
      .filter((i) => i !== -1)
  }

  // Feature 32: IQR (Interquartile Range) method
  detectIQR(data: number[]): number[] {
    const sorted = [...data].sort((a, b) => a - b)
    const q1Index = Math.floor(sorted.length * 0.25)
    const q3Index = Math.floor(sorted.length * 0.75)
    const q1 = sorted[q1Index]
    const q3 = sorted[q3Index]
    const iqr = q3 - q1
    const lowerBound = q1 - 1.5 * iqr
    const upperBound = q3 + 1.5 * iqr

    return data.map((value, index) => (value < lowerBound || value > upperBound ? index : -1)).filter((i) => i !== -1)
  }

  // Feature 33: Moving average deviation
  detectMovingAverageDeviation(data: number[], windowSize = 10, threshold = 2): number[] {
    const anomalies: number[] = []

    for (let i = windowSize; i < data.length; i++) {
      const window = data.slice(i - windowSize, i)
      const avg = window.reduce((a, b) => a + b, 0) / windowSize
      const stdDev = Math.sqrt(window.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / windowSize)

      if (Math.abs(data[i] - avg) > threshold * stdDev) {
        anomalies.push(i)
      }
    }

    return anomalies
  }

  // Feature 34: CUSUM (Cumulative Sum) algorithm
  detectCUSUM(data: number[], threshold = 5, drift = 0.5): number[] {
    const mean = data.reduce((a, b) => a + b, 0) / data.length
    let cumSum = 0
    const anomalies: number[] = []

    data.forEach((value, index) => {
      cumSum += value - mean - drift
      if (Math.abs(cumSum) > threshold) {
        anomalies.push(index)
        cumSum = 0
      }
    })

    return anomalies
  }

  // Feature 35: Pattern-based anomaly detection
  detectPatternAnomalies(data: number[], patternLength = 24): Anomaly[] {
    const anomalies: Anomaly[] = []

    for (let i = patternLength; i < data.length; i++) {
      const currentPattern = data.slice(i - patternLength, i)
      const historicalPattern = data.slice(i - patternLength * 2, i - patternLength)

      const correlation = this.calculateCorrelation(currentPattern, historicalPattern)

      if (correlation < 0.7) {
        anomalies.push({
          timestamp: Date.now() - (data.length - i) * 3600000,
          deviceId: "device-001",
          value: data[i],
          expectedValue: historicalPattern[historicalPattern.length - 1],
          severity: correlation < 0.5 ? "high" : "medium",
          type: "pattern",
          confidence: 1 - correlation,
        })
      }
    }

    return anomalies
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length)
    const meanX = x.reduce((a, b) => a + b, 0) / n
    const meanY = y.reduce((a, b) => a + b, 0) / n

    let numerator = 0
    let denomX = 0
    let denomY = 0

    for (let i = 0; i < n; i++) {
      const dx = x[i] - meanX
      const dy = y[i] - meanY
      numerator += dx * dy
      denomX += dx * dx
      denomY += dy * dy
    }

    return numerator / Math.sqrt(denomX * denomY)
  }

  // Feature 36: Real-time anomaly scoring
  scoreAnomaly(value: number, expected: number, historicalStdDev: number): number {
    const deviation = Math.abs(value - expected)
    return Math.min(100, (deviation / historicalStdDev) * 10)
  }

  // Main anomaly detection method
  async detectAnomalies({ timeRange, deviceId }: { timeRange: string; deviceId: string }): Promise<Anomaly[]> {
    const timeSeriesDB = getTimeSeriesDB()
    
    // Get metrics data
    const metricsData = await timeSeriesDB.getMetrics({
      timeRange,
      deviceId,
      metrics: ["power", "voltage", "current", "frequency", "powerFactor"]
    })

    const anomalies: Anomaly[] = []

    // Check each metric for anomalies
    for (const [metric, data] of Object.entries(metricsData)) {
      const values = (data as TimeSeriesRecord[]).map(r => r.value)
      
      // Detect using Z-Score method
      const zScoreAnomalies = this.detectZScore(values)
      zScoreAnomalies.forEach(index => {
        const record = (data as TimeSeriesRecord[])[index]
        anomalies.push({
          timestamp: record.timestamp,
          deviceId: record.deviceId,
          value: record.value,
          expectedValue: this.calculateExpectedValue(values, index),
          severity: this.determineSeverity(values[index], values),
          type: this.determineAnomalyType(values, index),
          confidence: 0.85
        })
      })

      // Detect using IQR method
      const iqrAnomalies = this.detectIQR(values)
      iqrAnomalies.forEach(index => {
        if (!zScoreAnomalies.includes(index)) {
          const record = (data as TimeSeriesRecord[])[index]
          anomalies.push({
            timestamp: record.timestamp,
            deviceId: record.deviceId,
            value: record.value,
            expectedValue: this.calculateExpectedValue(values, index),
            severity: this.determineSeverity(values[index], values),
            type: this.determineAnomalyType(values, index),
            confidence: 0.75
          })
        }
      })
    }

    return anomalies
  }

  private calculateExpectedValue(values: number[], index: number): number {
    const window = 5
    const start = Math.max(0, index - window)
    const end = Math.min(values.length, index + window + 1)
    const windowValues = [...values.slice(start, index), ...values.slice(index + 1, end)]
    return windowValues.reduce((a, b) => a + b, 0) / windowValues.length
  }

  private determineSeverity(value: number, values: number[]): "low" | "medium" | "high" | "critical" {
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const deviation = Math.abs(value - mean) / mean

    if (deviation > 0.5) return "critical"
    if (deviation > 0.3) return "high"
    if (deviation > 0.2) return "medium"
    return "low"
  }

  private determineAnomalyType(values: number[], index: number): "spike" | "drop" | "drift" | "pattern" {
    const value = values[index]
    const prevValue = index > 0 ? values[index - 1] : value
    const nextValue = index < values.length - 1 ? values[index + 1] : value

    if (value > prevValue && value > nextValue) return "spike"
    if (value < prevValue && value < nextValue) return "drop"
    
    const window = values.slice(Math.max(0, index - 5), Math.min(values.length, index + 6))
    const trend = this.calculateTrend(window)
    
    return Math.abs(trend) > 0.1 ? "drift" : "pattern"
  }

  private calculateTrend(values: number[]): number {
    const n = values.length
    const xMean = (n - 1) / 2
    const yMean = values.reduce((a, b) => a + b, 0) / n

    let numerator = 0
    let denominator = 0

    for (let i = 0; i < n; i++) {
      const x = i - xMean
      const y = values[i] - yMean
      numerator += x * y
      denominator += x * x
    }

    return numerator / denominator
  }
}

export const getAnomalyDetector = () => AnomalyDetector.getInstance()
