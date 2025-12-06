export interface Challenge {
  id: string
  name: string
  description: string
  type: "individual" | "community" | "team"
  category: "savings" | "efficiency" | "renewable" | "behavior"
  startDate: number
  endDate: number
  goal: ChallengeGoal
  reward: ChallengeReward
  participants: number
  status: "upcoming" | "active" | "completed"
  difficulty: "easy" | "medium" | "hard"
}

export interface ChallengeGoal {
  type: "reduce" | "achieve" | "maintain" | "compete"
  metric: string
  target: number
  unit: string
}

export interface ChallengeReward {
  points: number
  badge?: string
  discount?: number
  carbonCredits?: number
}

export class ChallengeSystem {
  private challenges: Map<string, Challenge> = new Map()

  // Feature 83: Challenge creation
  createChallenge(challenge: Omit<Challenge, "id" | "participants" | "status">): Challenge {
    const now = Date.now()
    const status = challenge.startDate > now ? "upcoming" : challenge.endDate < now ? "completed" : "active"

    const newChallenge: Challenge = {
      ...challenge,
      id: `challenge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      participants: 0,
      status: status as "upcoming" | "active" | "completed",
    }

    this.challenges.set(newChallenge.id, newChallenge)
    return newChallenge
  }

  // Feature 84: Predefined challenges
  createMonthlyChallenge(): Challenge[] {
    const now = Date.now()
    const monthStart = new Date(new Date().setDate(1)).getTime()
    const monthEnd = new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).getTime()

    return [
      this.createChallenge({
        name: "10% Reduction Challenge",
        description: "Reduce your energy consumption by 10% compared to last month",
        type: "individual",
        category: "savings",
        startDate: monthStart,
        endDate: monthEnd,
        goal: {
          type: "reduce",
          metric: "consumption",
          target: 10,
          unit: "percent",
        },
        reward: {
          points: 100,
          badge: "energy-saver",
        },
        difficulty: "medium",
      }),
      this.createChallenge({
        name: "Peak Hour Hero",
        description: "Shift 50% of your load away from peak hours",
        type: "individual",
        category: "behavior",
        startDate: monthStart,
        endDate: monthEnd,
        goal: {
          type: "achieve",
          metric: "peak_avoidance",
          target: 50,
          unit: "percent",
        },
        reward: {
          points: 150,
          discount: 5,
        },
        difficulty: "hard",
      }),
      this.createChallenge({
        name: "Community Solar Sprint",
        description: "Collectively generate 10,000 kWh of solar energy",
        type: "community",
        category: "renewable",
        startDate: monthStart,
        endDate: monthEnd,
        goal: {
          type: "achieve",
          metric: "solar_generation",
          target: 10000,
          unit: "kWh",
        },
        reward: {
          points: 200,
          carbonCredits: 50,
        },
        difficulty: "medium",
      }),
    ]
  }

  // Feature 85: Challenge progress tracking
  trackProgress(challengeId: string, userId: string, currentValue: number): { progress: number; completed: boolean } {
    const challenge = this.challenges.get(challengeId)
    if (!challenge) return { progress: 0, completed: false }

    const progress = (currentValue / challenge.goal.target) * 100
    const completed = progress >= 100

    return { progress: Math.min(progress, 100), completed }
  }

  // Feature 86: Challenge recommendations
  recommendChallenges(userProfile: {
    skillLevel: "beginner" | "intermediate" | "advanced"
    interests: string[]
    pastPerformance: number
  }): Challenge[] {
    const allChallenges = Array.from(this.challenges.values()).filter((c) => c.status === "active")

    return allChallenges
      .filter((challenge) => {
        if (userProfile.skillLevel === "beginner" && challenge.difficulty === "hard") return false
        if (userProfile.skillLevel === "advanced" && challenge.difficulty === "easy") return false
        return userProfile.interests.includes(challenge.category)
      })
      .sort((a, b) => b.reward.points - a.reward.points)
      .slice(0, 5)
  }
}

export const challengeSystem = new ChallengeSystem()
