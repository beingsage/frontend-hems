import { getIoTSimulator } from "../backend/iot-simulator"
import { getTimeSeriesDB } from "../data-pipeline/time-series-db"

export interface Pattern {
  id: string
  type: "pattern" | "anomaly" | "opportunity"
  title: string
  description: string
  severity: "low" | "medium" | "high"
  confidence: number
  action: string
  data?: {
    peakHours?: number[]
    offPeakHours?: number[]
    metrics?: Record<string, number>
  }
}

export class PatternRecognition {
  private static instance: PatternRecognition
  private simulator = getIoTSimulator()
  private timeSeriesDB = getTimeSeriesDB()

  private constructor() {
  }

  static getInstance(): PatternRecognition {
    if (!PatternRecognition.instance) {
      PatternRecognition.instance = new PatternRecognition()
    }
    return PatternRecognition.instance
  }

  // Analyzes time series data to find usage patterns
  private analyzeDailyPattern(hourlyData: Array<{ timestamp: string; power: string }>) {
    const avgByHour = Array(24).fill(0)
    const countByHour = Array(24).fill(0)

    hourlyData.forEach(data => {
      const hour = new Date(data.timestamp).getHours()
      avgByHour[hour] += Number(data.power)
      countByHour[hour]++
    })

    const normalizedAvg = avgByHour.map((sum, i) => sum / countByHour[i])
    const mean = normalizedAvg.reduce((a, b) => a + b, 0) / 24
    const peakHours = normalizedAvg
      .map((val, hour) => ({ hour, val }))
      .filter((item) => item.val > mean * 1.2)
      .map((item) => item.hour)

    const offPeakHours = normalizedAvg
      .map((val, hour) => ({ hour, val }))
      .filter((item) => item.val < mean * 0.8)
      .map((item) => item.hour)

    return {
      name: "Daily Usage Pattern",
      type: "daily",
      confidence: 0.85,
      description: `Peak usage during hours: ${peakHours.join(", ")}`,
      peakHours,
      offPeakHours,
    }
  }

  // Feature 38: Weekly pattern detection
  detectWeeklyPattern(dailyData: number[]): Pattern {
    const avgByDay = Array(7).fill(0)
    const countByDay = Array(7).fill(0)

    dailyData.forEach((value, index) => {
      const day = index % 7
      avgByDay[day] += value
      countByDay[day]++
    })

    const normalizedAvg = avgByDay.map((sum, i) => sum / countByDay[i])
    const mean = normalizedAvg.reduce((a, b) => a + b, 0) / 7
    const peakDays = normalizedAvg
      .map((val, day) => ({ day, val }))
      .filter((item) => item.val > mean * 1.1)
      .map((item) => item.day)

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    return {
      id: "weekly-pattern",
      type: "pattern",
      confidence: 0.78,
      severity: "medium",
      title: "Weekly Usage Pattern",
      description: `Higher usage on: ${peakDays.map((d) => dayNames[d]).join(", ")}`,
      action: "Consider shifting loads to off-peak days",
      data: {
        peakHours: peakDays,
        offPeakHours: []
      }
    }
  }

  // Feature 39: Seasonal trend detection
  detectSeasonalTrend(monthlyData: number[]): Pattern {
    const seasons = [
      { name: "Winter", months: [11, 0, 1] },
      { name: "Spring", months: [2, 3, 4] },
      { name: "Summer", months: [5, 6, 7] },
      { name: "Fall", months: [8, 9, 10] },
    ]

    const seasonalAvg = seasons.map((season) => {
      const values = season.months.map((m) => monthlyData[m] || 0)
      return {
        season: season.name,
        avg: values.reduce((a, b) => a + b, 0) / values.length,
      }
    })

    const maxSeason = seasonalAvg.reduce((max, curr) => (curr.avg > max.avg ? curr : max))

    return {
      id: "seasonal-pattern",
      type: "pattern",
      confidence: 0.72,
      severity: "medium",
      title: "Seasonal Pattern",
      description: `Highest consumption in ${maxSeason.season}`,
      action: "Consider seasonal energy efficiency measures",
      data: {
        peakHours: [],
        offPeakHours: []
      }
    }
  }

  // Feature 40: Appliance usage pattern clustering
  clusterApplianceUsage(
    usageData: Array<{ hour: number; power: number }>,
  ): Array<{ cluster: string; hours: number[] }> {
    const clusters = [
      { cluster: "Morning", hours: [] as number[] },
      { cluster: "Afternoon", hours: [] as number[] },
      { cluster: "Evening", hours: [] as number[] },
      { cluster: "Night", hours: [] as number[] },
    ]

    usageData.forEach(({ hour, power }) => {
      if (power > 2) {
        if (hour >= 6 && hour < 12) clusters[0].hours.push(hour)
        else if (hour >= 12 && hour < 17) clusters[1].hours.push(hour)
        else if (hour >= 17 && hour < 22) clusters[2].hours.push(hour)
        else clusters[3].hours.push(hour)
      }
    })

    return clusters.filter((c) => c.hours.length > 0)
  }

  // Feature 41: Behavior change detection
  detectBehaviorChange(recentData: number[], historicalData: number[]): { changed: boolean; changePercent: number } {
    const recentAvg = recentData.reduce((a, b) => a + b, 0) / recentData.length
    const historicalAvg = historicalData.reduce((a, b) => a + b, 0) / historicalData.length

    const changePercent = ((recentAvg - historicalAvg) / historicalAvg) * 100
    const changed = Math.abs(changePercent) > 15

    return { changed, changePercent }
  }

  // Main pattern detection method
  async detectPatterns({ timeRange, deviceId }: { timeRange: string; deviceId: string }): Promise<Pattern[]> {
    const timeSeriesDB = getTimeSeriesDB()
    
    // Get historical power data
    const powerData = (await timeSeriesDB.getMetrics({
      timeRange,
      deviceId,
      metrics: ["power"]
    })).power

    const patterns: Pattern[] = []

    // Convert data for processing
    const values = powerData.map(r => r.value)
    const hourlyData = this.aggregateToHourly(values)
    const dailyData = this.aggregateTo24Hours(values)
    const monthlyData = this.aggregateToMonthly(values)

    // Detect peak load times
    patterns.push({
      id: "peak-load",
      type: "pattern",
      title: "Peak Load Pattern",
      description: this.detectPeakLoadTimes(dailyData),
      severity: "medium",
      confidence: 0.85,
      action: "Consider load shifting to off-peak hours",
      data: {
        peakHours: dailyData
          .map((val, hour) => ({ hour, val }))
          .filter(({ val }) => val > Math.max(...dailyData) * 0.8)
          .map(({ hour }) => hour)
      }
    })

    // Detect weekly patterns
    const weeklyPattern = this.detectWeeklyPattern(values)
    if (weeklyPattern) {
      patterns.push(weeklyPattern)
    }

    // Detect seasonal patterns
    const seasonalPattern = this.detectSeasonalTrend(monthlyData)
    if (seasonalPattern) {
      patterns.push(seasonalPattern)
    }

    // Detect behavior changes
    const recentData = values.slice(-24) // Last 24 hours
    const historicalData = values.slice(-168, -24) // Previous week excluding last 24 hours
    const behaviorChange = this.detectBehaviorChange(recentData, historicalData)
    if (behaviorChange.changed) {
      patterns.push({
        id: "behavior-change",
        type: "pattern",
        title: "Usage Behavior Change",
        description: `Energy usage has changed by ${behaviorChange.changePercent.toFixed(1)}% compared to historical patterns`,
        severity: behaviorChange.changePercent > 25 ? "high" : "medium",
        confidence: 0.9,
        action: behaviorChange.changePercent > 0 
          ? "Investigate causes of increased consumption"
          : "Maintain current optimization strategies",
        data: { metrics: { changePercent: behaviorChange.changePercent } }
      })
    }

    return patterns
  }

  private aggregateToHourly(values: number[]): number[] {
    const hourly = new Array(24).fill(0)
    const counts = new Array(24).fill(0)
    
    values.forEach((val, i) => {
      const hour = new Date(Date.now() - (values.length - i) * 60000).getHours()
      hourly[hour] += val
      counts[hour]++
    })
    
    return hourly.map((sum, i) => sum / (counts[i] || 1))
  }

  private aggregateTo24Hours(values: number[]): number[] {
    const hours = new Array(24).fill(0)
    const counts = new Array(24).fill(0)
    
    values.forEach((val, i) => {
      const hour = i % 24
      hours[hour] += val
      counts[hour]++
    })
    
    return hours.map((sum, i) => sum / (counts[i] || 1))
  }

  private aggregateToMonthly(values: number[]): number[] {
    const monthly = new Array(12).fill(0)
    const counts = new Array(12).fill(0)
    
    values.forEach((val, i) => {
      const month = new Date(Date.now() - (values.length - i) * 60000).getMonth()
      monthly[month] += val
      counts[month]++
    })
    
    return monthly.map((sum, i) => sum / (counts[i] || 1))
  }

  private detectPeakLoadTimes(hourlyData: number[]): string {
    const maxLoad = Math.max(...hourlyData)
    const peakHours = hourlyData
      .map((val, hour) => ({ hour, val }))
      .filter(({ val }) => val > maxLoad * 0.8)
      .map(({ hour }) => hour)
      .sort((a, b) => a - b)

    const formatHour = (h: number) => {
      const period = h >= 12 ? 'PM' : 'AM'
      const hour = h === 0 ? 12 : h > 12 ? h - 12 : h
      return `${hour}${period}`
    }

    return `Peak loads typically occur between ${formatHour(peakHours[0])} and ${formatHour(peakHours[peakHours.length - 1])}`
  }
}

export const getPatternRecognition = () => PatternRecognition.getInstance()
