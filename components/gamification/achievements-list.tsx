import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"

export function AchievementsList({ achievements = [] }: { achievements: any[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {achievements.map((achievement) => (
        <Card key={achievement.id} className={achievement.unlocked ? "" : "opacity-50"}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                    {achievement.unlocked ? "Unlocked" : "Locked"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                {achievement.unlocked && (
                  <p className="text-sm text-muted-foreground">
                    Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}