"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { GamificationDashboard } from "@/components/gamification/dashboard"
import { ChallengesList } from "@/components/gamification/challenges-list"
import { AchievementsList } from "@/components/gamification/achievements-list"
import { SocialLeaderboard } from "@/components/gamification/social-leaderboard"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Target, Users, Share2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function GamificationPage() {
  const { user } = useAuth()
  const [gamificationData, setGamificationData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGamificationData() {
      try {
        const response = await fetch(`/api/gamification?userId=${user?.id}`)
        const data = await response.json()
        setGamificationData(data)
      } catch (error) {
        console.error("Error fetching gamification data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchGamificationData()
    }
  }, [user?.id])

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </main>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="border-b border-border bg-card px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Energy Champions</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete challenges, earn achievements, and compete with others
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share Progress
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <GamificationDashboard data={gamificationData} />

            <Tabs defaultValue="challenges">
              <TabsList>
                <TabsTrigger value="challenges" className="gap-2">
                  <Target className="h-4 w-4" />
                  Challenges
                </TabsTrigger>
                <TabsTrigger value="achievements" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Achievements
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="gap-2">
                  <Users className="h-4 w-4" />
                  Leaderboard
                </TabsTrigger>
              </TabsList>

              <TabsContent value="challenges" className="mt-6">
                <ChallengesList challenges={gamificationData?.challenges} />
              </TabsContent>

              <TabsContent value="achievements" className="mt-6">
                <AchievementsList achievements={gamificationData?.achievements} />
              </TabsContent>

              <TabsContent value="leaderboard" className="mt-6">
                <SocialLeaderboard data={gamificationData?.socialStats} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}