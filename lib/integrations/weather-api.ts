export interface WeatherData {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  condition: string
  icon: string
  forecast: WeatherForecast[]
  solarRadiation: number
  cloudCover: number
}

export interface WeatherForecast {
  date: string
  high: number
  low: number
  condition: string
  precipitation: number
  solarPotential: number
}

export class WeatherAPI {
  private apiKey: string
  private baseUrl = "https://api.weather.com/v1"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // Feature 102: Current weather data
  async getCurrentWeather(location: { lat: number; lon: number }): Promise<WeatherData> {
    console.log(`[v0] Fetching weather for ${location.lat}, ${location.lon}`)

    // Simulate weather data
    return {
      temperature: 22,
      feelsLike: 20,
      humidity: 65,
      windSpeed: 12,
      condition: "Partly Cloudy",
      icon: "partly-cloudy",
      solarRadiation: 850,
      cloudCover: 35,
      forecast: this.generateForecast(),
    }
  }

  // Feature 103: Weather-based energy predictions
  async getEnergyImpact(weatherData: WeatherData): Promise<{
    heatingLoad: number
    coolingLoad: number
    solarGeneration: number
    recommendations: string[]
  }> {
    const heatingLoad = Math.max(0, (18 - weatherData.temperature) * 50)
    const coolingLoad = Math.max(0, (weatherData.temperature - 24) * 60)
    const solarGeneration = (weatherData.solarRadiation / 1000) * (1 - weatherData.cloudCover / 100) * 5

    const recommendations: string[] = []

    if (weatherData.temperature < 15) {
      recommendations.push("Pre-heat home during off-peak hours")
    }
    if (weatherData.temperature > 28) {
      recommendations.push("Pre-cool home before peak hours")
    }
    if (weatherData.solarRadiation > 800) {
      recommendations.push("Optimal time for solar-powered appliances")
    }

    return {
      heatingLoad,
      coolingLoad,
      solarGeneration,
      recommendations,
    }
  }

  private generateForecast(): WeatherForecast[] {
    return Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      high: 20 + Math.random() * 10,
      low: 10 + Math.random() * 8,
      condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
      precipitation: Math.random() * 100,
      solarPotential: 3 + Math.random() * 4,
    }))
  }

  // Feature 104: Severe weather alerts
  async getWeatherAlerts(location: { lat: number; lon: number }): Promise<
    Array<{
      type: string
      severity: "low" | "medium" | "high"
      description: string
      startTime: number
      endTime: number
    }>
  > {
    // Simulate weather alerts
    return [
      {
        type: "Heat Wave",
        severity: "medium",
        description: "Temperatures expected to exceed 35°C for 3 consecutive days",
        startTime: Date.now() + 24 * 60 * 60 * 1000,
        endTime: Date.now() + 4 * 24 * 60 * 60 * 1000,
      },
    ]
  }
}

const weatherAPIInstance = new WeatherAPI(process.env.WEATHER_API_KEY || "demo-key")
export const weatherAPI = weatherAPIInstance
