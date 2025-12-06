"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, TrendingUp, TrendingDown, Award, Users, Target, Share2 } from "lucide-react"

export default function CommunityPage() {
  // Feature 91: Leaderboard display
  const leaderboard = [
    { rank: 1, name: "EcoWarrior", points: 2450, change: 2, avatar: "🌟", savings: "450 kWh" },
    { rank: 2, name: "GreenGuru", points: 2380, change: -1, avatar: "🌿", savings: "425 kWh" },
    { rank: 3, name: "SolarSage", points: 2290, change: 1, avatar: "☀️", savings: "410 kWh" },
    { rank: 4, name: "PowerSaver", points: 2150, change: 0, avatar: "⚡", savings: "385 kWh" },
    { rank: 5, name: "You", points: 2080, change: 3, avatar: "👤", savings: "370 kWh" },
    { rank: 6, name: "EnergyNinja", points: 1950, change: -2, avatar: "🥷", savings: "350 kWh" },
    { rank: 7, name: "ClimateChamp", points: 1890, change: 1, avatar: "🏆", savings: "340 kWh" },
  ]

  // Feature 92: Active challenges
  const challenges = [
    {
      id: "1",
      name: "10% Reduction Challenge",
      description: "Reduce consumption by 10% this month",
      progress: 65,
      participants: 1247,
      reward: "100 points",
      endsIn: "12 days",
      difficulty: "medium",
    },
    {
      id: "2",
      name: "Peak Hour Hero",
      description: "Shift 50% of load away from peak hours",
      progress: 42,
      participants: 856,
      reward: "150 points + 5% discount",
      endsIn: "18 days",
      difficulty: "hard",
    },
    {
      id: "3",
      name: "Community Solar Sprint",
      description: "Collectively generate 10,000 kWh solar",
      progress: 78,
      participants: 2341,
      reward: "200 points + carbon credits",
      endsIn: "8 days",
      difficulty: "medium",
    },
  ]

  // Feature 93: Achievements showcase
  const achievements = [
    { name: "Week Warrior", icon: "📅", unlocked: true, rarity: "silver" },
    { name: "Energy Saver", icon: "🔋", unlocked: true, rarity: "bronze" },
    { name: "Efficiency Expert", icon: "⚡", unlocked: true, rarity: "gold" },
    { name: "Solar Champion", icon: "☀️", unlocked: false, rarity: "gold" },
    { name: "Community Leader", icon: "🏆", unlocked: false, rarity: "platinum" },
    { name: "Automation Master", icon: "🤖", unlocked: true, rarity: "silver" },
  ]

  // Feature 94: Community stats
  const communityStats = [
    { label: "Total Members", value: "12,847", change: "+234" },
    { label: "Energy Saved", value: "2.4M kWh", change: "+45K" },
    { label: "CO₂ Offset", value: "1,200 tons", change: "+28" },
    { label: "Active Challenges", value: "15", change: "+3" },
  ]

  return (
        <ProtectedRoute>
    
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Community</h1>
          </div>
          <p className="text-muted-foreground">Compete, collaborate, and celebrate energy savings together</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          {communityStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-500 mt-1">{stat.change} this week</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="leaderboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Monthly Leaderboard</CardTitle>
                    <CardDescription>Top energy savers in your community</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center gap-4 p-4 rounded-lg border ${
                        entry.name === "You" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted font-bold">
                        {entry.rank <= 3 ? (
                          <Trophy
                            className={`h-6 w-6 ${
                              entry.rank === 1
                                ? "text-yellow-500"
                                : entry.rank === 2
                                  ? "text-gray-400"
                                  : "text-orange-600"
                            }`}
                          />
                        ) : (
                          <span className="text-muted-foreground">#{entry.rank}</span>
                        )}
                      </div>
                      <div className="text-3xl">{entry.avatar}</div>
                      <div className="flex-1">
                        <div className="font-semibold">{entry.name}</div>
                        <div className="text-sm text-muted-foreground">{entry.savings} saved</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{entry.points.toLocaleString()}</div>
                        <div className="flex items-center gap-1 text-sm">
                          {entry.change > 0 ? (
                            <>
                              <TrendingUp className="h-3 w-3 text-green-500" />
                              <span className="text-green-500">+{entry.change}</span>
                            </>
                          ) : entry.change < 0 ? (
                            <>
                              <TrendingDown className="h-3 w-3 text-red-500" />
                              <span className="text-red-500">{entry.change}</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4">
            {challenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{challenge.name}</CardTitle>
                        <Badge
                          variant={
                            challenge.difficulty === "hard"
                              ? "destructive"
                              : challenge.difficulty === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <CardDescription>{challenge.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Your Progress</span>
                        <span className="text-sm text-muted-foreground">{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">
                          <Users className="h-4 w-4 inline mr-1" />
                          {challenge.participants.toLocaleString()} participants
                        </span>
                        <span className="text-muted-foreground">Ends in {challenge.endsIn}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{challenge.reward}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {achievements.map((achievement) => (
                <Card key={achievement.name} className={achievement.unlocked ? "border-primary" : "opacity-60"}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{achievement.name}</CardTitle>
                        <Badge
                          variant={achievement.unlocked ? "default" : "outline"}
                          className={
                            achievement.rarity === "platinum"
                              ? "bg-purple-500"
                              : achievement.rarity === "gold"
                                ? "bg-yellow-500"
                                : achievement.rarity === "silver"
                                  ? "bg-gray-400"
                                  : "bg-orange-600"
                          }
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {achievement.unlocked ? (
                      <div className="text-sm text-green-500 font-medium">✓ Unlocked</div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Locked</div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
        </ProtectedRoute>
  )
}
