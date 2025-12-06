import { getTimeSeriesDB } from "../data-pipeline/time-series-db"

export interface OptimizationRecommendation {
  id: string
  title: string
  description: string
  potentialSavings: number
  savingsUnit: "kWh" | "USD" | "percent"
  difficulty: "easy" | "medium" | "hard"
  category: "scheduling" | "efficiency" | "behavior" | "equipment"
  priority: number
  estimatedROI: number
  implementationSteps: string[]
}

export class OptimizationEngine {
  private static instance: OptimizationEngine

  private constructor() {}

  public static getInstance(): OptimizationEngine {
    if (!OptimizationEngine.instance) {
      OptimizationEngine.instance = new OptimizationEngine()
    }
    return OptimizationEngine.instance
  }

  // Main recommendation generation method
  async getRecommendations({ deviceId, includeROI = true }: { 
    deviceId: string
    includeROI?: boolean
  }): Promise<OptimizationRecommendation[]> {
    const timeSeriesDB = getTimeSeriesDB()

    // Get last 24 hours of power data
    const powerData = await timeSeriesDB.getMetrics({
      timeRange: "24h", 
      deviceId,
      metrics: ["power"]
    })

    const recommendations: OptimizationRecommendation[] = []

    // Get hourly load data for load shifting analysis
    const hourlyLoad = this.calculateHourlyAverages(powerData.power)
    const loadShiftingRecs = this.generateLoadShiftingRecommendations(hourlyLoad)
    recommendations.push(...loadShiftingRecs)

    // Get efficiency recommendations 
    const efficiencyRecs = this.generateEfficiencyRecommendations(powerData.power)
    recommendations.push(...efficiencyRecs)

    // Get behavioral recommendations
    const behavioralRecs = this.generateBehavioralRecommendations(powerData.power) 
    recommendations.push(...behavioralRecs)

    // Get equipment recommendations
    const equipmentRecs = this.generateEquipmentRecommendations(powerData.power)
    recommendations.push(...equipmentRecs)

    // Calculate ROI if requested
    if (includeROI) {
      recommendations.forEach(rec => {
        if (!rec.estimatedROI) {
          rec.estimatedROI = this.calculateROI(rec.potentialSavings, rec.difficulty)
        }
      })
    }

    // Sort by priority and ROI
    return recommendations.sort((a, b) => {
      if (a.priority === b.priority) {
        return b.estimatedROI - a.estimatedROI
      }
      return b.priority - a.priority
    })
  }

  private calculateHourlyAverages(data: { timestamp: number; value: number }[]): number[] {
    const hourlyTotals = new Array(24).fill(0)
    const hourlyCounts = new Array(24).fill(0)

    data.forEach(record => {
      const hour = new Date(record.timestamp).getHours()
      hourlyTotals[hour] += record.value
      hourlyCounts[hour]++
    })

    return hourlyTotals.map((total, i) => total / (hourlyCounts[i] || 1))
  }

  private calculateROI(savings: number, difficulty: "easy" | "medium" | "hard"): number {
    const implementationCost = {
      easy: 100,
      medium: 500,
      hard: 2000
    }
    const annualSavings = savings * 12 // Assuming savings is monthly
    return (annualSavings / implementationCost[difficulty]) * 100
  }

  private generateLoadShiftingRecommendations(hourlyLoad: number[]): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = []
    const peakHours = hourlyLoad
      .map((load, hour) => ({ hour, load }))
      .sort((a, b) => b.load - a.load)
      .slice(0, 3)
      .map((item) => item.hour)

    if (peakHours.length > 0) {
      recommendations.push({
        id: "load-shift-1",
        title: "Shift High-Power Appliances to Off-Peak Hours",
        description: `Move high-power activities to hours ${peakHours[0] + 6}:00-${peakHours[0] + 8}:00`,
        potentialSavings: 45,
        savingsUnit: "USD",
        difficulty: "easy",
        category: "scheduling",
        priority: 9,
        estimatedROI: 540,
        implementationSteps: [
          "Set washing machine timer for off-peak hours",
          "Schedule dishwasher to run after 10 PM", 
          "Configure EV charging schedule"
        ]
      })
    }
    
    return recommendations
  }

  private generateEfficiencyRecommendations(powerData: { timestamp: number; value: number }[]): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = []
    const avgConsumption = powerData.reduce((sum, record) => sum + record.value, 0) / powerData.length

    if (avgConsumption > 5) { // High consumption threshold
      recommendations.push({
        id: "efficiency-1",
        title: "Upgrade to Energy-Efficient Appliances",
        description: "Replace old appliances with ENERGY STAR certified models",
        potentialSavings: 20,
        savingsUnit: "percent",
        difficulty: "hard",
        category: "efficiency",
        priority: 8,
        estimatedROI: 0, // Will be calculated if includeROI is true
        implementationSteps: [
          "Identify appliances older than 10 years",
          "Research ENERGY STAR alternatives",
          "Calculate potential savings for each replacement",
          "Prioritize replacements based on ROI"
        ]
      })
    }

    return recommendations
  }

  private generateBehavioralRecommendations(powerData: { timestamp: number; value: number }[]): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = []
    const peakUsageHours = this.calculateHourlyAverages(powerData)
      .map((load, hour) => ({ hour, load }))
      .sort((a, b) => b.load - a.load)
      .slice(0, 5)
      .map(x => x.hour)

    recommendations.push({
      id: "behavior-1",
      title: "Optimize Daily Usage Patterns", 
      description: `Reduce energy usage during peak hours (${peakUsageHours.map(h => `${h}:00`).join(", ")})`,
      potentialSavings: 15,
      savingsUnit: "percent",
      difficulty: "medium",
      category: "behavior",
      priority: 7,
      estimatedROI: 0,
      implementationSteps: [
        "Review daily energy consumption patterns",
        "Identify non-essential usage during peak hours",
        "Create a schedule for energy-intensive activities",
        "Set up reminders for peak hours"
      ]
    })

    return recommendations
  }

  private generateEquipmentRecommendations(powerData: { timestamp: number; value: number }[]): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = []
    
    const avgLoad = powerData.reduce((sum, record) => sum + record.value, 0) / powerData.length
    if (avgLoad > 3) { // Threshold for equipment recommendations
      recommendations.push({
        id: "equipment-1",
        title: "Smart Power Strip Installation",
        description: "Install smart power strips to reduce standby power consumption",
        potentialSavings: 10,
        savingsUnit: "percent",
        difficulty: "easy",
        category: "equipment",
        priority: 6,
        estimatedROI: 0,
        implementationSteps: [
          "Identify areas with multiple devices",
          "Purchase smart power strips",
          "Group devices by usage patterns",
          "Configure automatic power-off schedules"
        ]
      })
    }

    return recommendations
  }
}

export const getOptimizationEngine = () => OptimizationEngine.getInstance()
export const optimizationEngine = OptimizationEngine.getInstance()  // Export instance directly

