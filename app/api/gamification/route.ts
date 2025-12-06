import { NextResponse } from "next/server"
import { achievementSystem } from "@/lib/gamification/achievement-system"
import { challengeSystem } from "@/lib/gamification/challenge-system"
import { socialFeatures } from "@/lib/gamification/social-features"

// Get user achievements and challenges
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const achievements = await achievementSystem.getUserAchievements(userId)
    const challenges = await challengeSystem.getActiveChallenges(userId)
    const socialStats = await socialFeatures.getUserStats(userId)

    return NextResponse.json({
      achievements,
      challenges,
      socialStats,
    })
  } catch (error) {
    console.error("Error fetching gamification data:", error)
    return NextResponse.json(
      { error: "Failed to fetch gamification data" },
      { status: 500 }
    )
  }
}

// Create new achievement or challenge completion
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, type, achievementId, challengeId } = body

    if (!userId || !type || (!achievementId && !challengeId)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    let result
    if (type === "achievement") {
      result = await achievementSystem.unlockAchievement(userId, achievementId)
    } else if (type === "challenge") {
      result = await challengeSystem.completeChallenge(userId, challengeId)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error processing gamification action:", error)
    return NextResponse.json(
      { error: "Failed to process gamification action" },
      { status: 500 }
    )
  }
}