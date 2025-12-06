export interface ForecastResult {
  timestamp: number
  predicted: number
  confidence: { lower: number; upper: number }
  trend: "increasing" | "decreasing" | "stable"
}

export class ForecastingEngine {
  // Feature 21: Simple moving average forecast
  simpleMovingAverage(data: number[], periods: number, forecastSteps: number): ForecastResult[] {
    const results: ForecastResult[] = []
    let lastValue = data[data.length - 1]

    for (let i = 0; i < forecastSteps; i++) {
      const windowStart = Math.max(0, data.length - periods + i)
      const window = data.slice(windowStart)
      const avg = window.reduce((a, b) => a + b, 0) / window.length

      const timestamp = Date.now() + (i + 1) * 3600000 // 1 hour intervals
      results.push({
        timestamp,
        predicted: avg,
        confidence: {
          lower: avg * 0.9,
          upper: avg * 1.1,
        },
        trend: avg > lastValue ? "increasing" : avg < lastValue ? "decreasing" : "stable",
      })
      lastValue = avg
    }

    return results
  }

  // Feature 22: Exponential smoothing
  exponentialSmoothing(data: number[], alpha: number, forecastSteps: number): ForecastResult[] {
    let smoothed = data[0]
    const results: ForecastResult[] = []

    // Calculate smoothed values
    for (let i = 1; i < data.length; i++) {
      smoothed = alpha * data[i] + (1 - alpha) * smoothed
    }

    // Generate forecasts
    for (let i = 0; i < forecastSteps; i++) {
      const timestamp = Date.now() + (i + 1) * 3600000
      results.push({
        timestamp,
        predicted: smoothed,
        confidence: {
          lower: smoothed * 0.85,
          upper: smoothed * 1.15,
        },
        trend: "stable",
      })
    }

    return results
  }

  // Feature 23: Linear regression forecast
  linearRegression(data: number[], forecastSteps: number): ForecastResult[] {
    const n = data.length
    const x = Array.from({ length: n }, (_, i) => i)
    const y = data

    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    const results: ForecastResult[] = []
    for (let i = 0; i < forecastSteps; i++) {
      const x = n + i
      const predicted = slope * x + intercept
      const timestamp = Date.now() + (i + 1) * 3600000

      results.push({
        timestamp,
        predicted: Math.max(0, predicted),
        confidence: {
          lower: Math.max(0, predicted * 0.8),
          upper: predicted * 1.2,
        },
        trend: slope > 0 ? "increasing" : slope < 0 ? "decreasing" : "stable",
      })
    }

    return results
  }

  // Feature 24: Seasonal decomposition
  detectSeasonality(data: number[], period: number): { seasonal: number[]; trend: number[]; residual: number[] } {
    const n = data.length
    const seasonal: number[] = []
    const trend: number[] = []
    const residual: number[] = []

    // Calculate trend using moving average
    for (let i = 0; i < n; i++) {
      const start = Math.max(0, i - Math.floor(period / 2))
      const end = Math.min(n, i + Math.floor(period / 2) + 1)
      const window = data.slice(start, end)
      trend.push(window.reduce((a, b) => a + b, 0) / window.length)
    }

    // Calculate seasonal component
    const detrended = data.map((val, i) => val - trend[i])
    for (let i = 0; i < period; i++) {
      const seasonalValues = []
      for (let j = i; j < n; j += period) {
        seasonalValues.push(detrended[j])
      }
      const avgSeasonal = seasonalValues.reduce((a, b) => a + b, 0) / seasonalValues.length
      seasonal.push(avgSeasonal)
    }

    // Extend seasonal pattern to match data length
    const fullSeasonal = Array.from({ length: n }, (_, i) => seasonal[i % period])

    // Calculate residual
    for (let i = 0; i < n; i++) {
      residual.push(data[i] - trend[i] - fullSeasonal[i])
    }

    return { seasonal: fullSeasonal, trend, residual }
  }

  // Feature 25: Confidence interval calculation
  calculateConfidenceInterval(data: number[], confidence = 0.95): { lower: number; upper: number } {
    const mean = data.reduce((a, b) => a + b, 0) / data.length
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
    const stdDev = Math.sqrt(variance)

    const zScore = confidence === 0.95 ? 1.96 : confidence === 0.99 ? 2.576 : 1.645
    const margin = (zScore * stdDev) / Math.sqrt(data.length)

    return {
      lower: mean - margin,
      upper: mean + margin,
    }
  }
}

export const forecastingEngine = new ForecastingEngine()
