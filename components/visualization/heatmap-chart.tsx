"use client"

export function HeatmapChart() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Generate mock heatmap data
  const data = days.map((day, dayIndex) =>
    hours.map((hour) => {
      // Simulate higher usage during work hours (9-18) on weekdays
      const isWeekday = dayIndex < 5
      const isWorkHour = hour >= 9 && hour <= 18
      const baseValue = isWeekday && isWorkHour ? 0.7 : 0.3
      const randomVariation = Math.random() * 0.3
      return Math.min(1, baseValue + randomVariation)
    }),
  )

  const getColor = (value: number) => {
    if (value > 0.8) return "bg-red-500"
    if (value > 0.6) return "bg-orange-500"
    if (value > 0.4) return "bg-yellow-500"
    if (value > 0.2) return "bg-blue-500"
    return "bg-blue-900"
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <div className="w-12" />
        {hours.map((hour) => (
          <div key={hour} className="flex-1 text-center text-xs text-muted-foreground">
            {hour % 6 === 0 ? hour : ""}
          </div>
        ))}
      </div>
      {days.map((day, dayIndex) => (
        <div key={day} className="flex gap-1">
          <div className="w-12 text-xs text-muted-foreground flex items-center">{day}</div>
          {data[dayIndex].map((value, hourIndex) => (
            <div
              key={hourIndex}
              className={`flex-1 h-6 rounded-sm ${getColor(value)}`}
              title={`${day} ${hourIndex}:00 - ${Math.round(value * 100)}%`}
            />
          ))}
        </div>
      ))}
      <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-900" />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span>High</span>
        </div>
      </div>
    </div>
  )
}
