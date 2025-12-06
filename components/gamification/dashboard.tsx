import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Target, Users, Flame } from "lucide-react"

export function GamificationDashboard({ data }: { data: any }) {
  const stats = [
    {
      title: "Total Points",
      value: data?.socialStats?.totalPoints || 0,
      icon: Trophy,
      color: "text-yellow-500",
    },
    {
      title: "Active Challenges",
      value: data?.challenges?.filter((c: any) => c.status === "active").length || 0,
      icon: Target,
      color: "text-blue-500",
    },
    {
      title: "Achievements",
      value: data?.achievements?.length || 0,
      icon: Flame,
      color: "text-orange-500",
    },
    {
      title: "Leaderboard Position",
      value: `#${data?.socialStats?.rank || "-"}`,
      icon: Users,
      color: "text-green-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h2 className="text-2xl font-bold mt-1">{stat.value}</h2>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}