export interface ChartConfig {
  type: "line" | "bar" | "area" | "pie" | "scatter" | "heatmap" | "sankey" | "radar"
  data: any[]
  xAxis?: string
  yAxis?: string | string[]
  colors?: string[]
  title?: string
  legend?: boolean
}

export class ChartBuilder {
  // Feature 52: Dynamic chart configuration
  buildChart(config: ChartConfig) {
    return {
      ...config,
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 750 },
    }
  }

  // Feature 53: Heatmap data transformation
  transformToHeatmap(data: Array<{ x: number; y: number; value: number }>) {
    const matrix: number[][] = []
    const maxX = Math.max(...data.map((d) => d.x))
    const maxY = Math.max(...data.map((d) => d.y))

    for (let y = 0; y <= maxY; y++) {
      matrix[y] = []
      for (let x = 0; x <= maxX; x++) {
        const point = data.find((d) => d.x === x && d.y === y)
        matrix[y][x] = point ? point.value : 0
      }
    }

    return matrix
  }

  // Feature 54: Sankey diagram data preparation
  prepareSankeyData(flows: Array<{ source: string; target: string; value: number }>) {
    const nodes = new Set<string>()
    flows.forEach((f) => {
      nodes.add(f.source)
      nodes.add(f.target)
    })

    return {
      nodes: Array.from(nodes).map((name) => ({ name })),
      links: flows,
    }
  }

  // Feature 55: Time-series aggregation
  aggregateTimeSeries(data: Array<{ timestamp: number; value: number }>, interval: "hour" | "day" | "week" | "month") {
    const intervalMs = {
      hour: 3600000,
      day: 86400000,
      week: 604800000,
      month: 2592000000,
    }

    const buckets = new Map<number, number[]>()

    data.forEach((point) => {
      const bucket = Math.floor(point.timestamp / intervalMs[interval]) * intervalMs[interval]
      if (!buckets.has(bucket)) {
        buckets.set(bucket, [])
      }
      buckets.get(bucket)!.push(point.value)
    })

    return Array.from(buckets.entries()).map(([timestamp, values]) => ({
      timestamp,
      value: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
    }))
  }

  // Feature 56: Color palette generation
  generateColorPalette(count: number, baseHue = 210): string[] {
    const colors: string[] = []
    for (let i = 0; i < count; i++) {
      const hue = (baseHue + (i * 360) / count) % 360
      colors.push(`hsl(${hue}, 70%, 50%)`)
    }
    return colors
  }
}

export const chartBuilder = new ChartBuilder()
