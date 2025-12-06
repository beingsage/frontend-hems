import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Target, Clock } from "lucide-react"

export function ChallengesList({ challenges = [] }: { challenges: any[] }) {
  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <Card key={challenge.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{challenge.title}</h3>
                  <Badge variant={challenge.status === "active" ? "default" : "secondary"}>
                    {challenge.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{challenge.description}</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <span>{challenge.points} points</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{challenge.timeLeft} remaining</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}