import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Trophy, TrendingUp, TrendingDown } from "lucide-react"

export function SocialLeaderboard({ data = { leaderboard: [] } }: { data: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Energy Champions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.leaderboard.map((user: any, index: number) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <span className="font-bold text-primary">#{index + 1}</span>
                </div>
                <Avatar className="h-10 w-10" />
                <div>
                  <h4 className="font-semibold">{user.name}</h4>
                  <p className="text-sm text-muted-foreground">{user.points} points</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {user.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">{user.changePercent}%</span>
                </div>
                <Badge variant="outline">{user.level}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}