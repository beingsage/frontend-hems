export interface TimeSeriesData {
  timestamp: string
  power: string
  voltage: string
  current: string
  frequency: string
  powerFactor: string
  thd: string
}

export interface LoadProfile {
  timestamp: string
  baseLoad: string
  peakLoad: string
  avgLoad: string
}

export interface PowerQualityMetric {
  metric: string
  value: number
  status: string
  threshold: number
}

export interface Pattern {
  id: string
  type: "pattern" | "anomaly" | "opportunity"
  title: string
  description: string
  severity: "low" | "medium" | "high"
  confidence: number
  action: string
}

export interface Anomaly {
  id: string
  type: string
  title: string
  description: string
  severity: string
  confidence: number
  action: string
}

export interface Recommendation {
  id: string
  title: string
  description: string
  impact: string
  roi: string
  implementation: string
}

export interface ApplianceData {
  name: string
  consumption: number
  cost: number
  efficiency: number
}

export interface AnalyticsData {
  timeSeriesData: TimeSeriesData[]
  loadProfiles: LoadProfile[]
  powerQualityData: PowerQualityMetric[]
  mlInsights: {
    patterns: Pattern[]
    anomalies: Anomaly[]
    recommendations: Recommendation[]
  }
  applianceBreakdown: ApplianceData[]
  peakDemandTimes: {
    timestamp: string
    power: string
    cost: string
  }[]
  costAnalysis: {
    totalConsumption: string
    totalCost: string
    averageHourly: string
    projectedMonthlyCost: string
  }
}