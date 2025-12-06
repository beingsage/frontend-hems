export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: "savings" | "efficiency" | "renewable" | "consistency" | "social" | "milestone"
  tier: "bronze" | "silver" | "gold" | "platinum"
  points: number
  requirement: AchievementRequirement
  unlocked: boolean
  unlockedAt?: number
  progress: number
  maxProgress: number
}

export interface AchievementRequirement {
  type: "total_savings" | "streak" | "reduction" | "solar_usage" | "community" | "automation"
  value: number
  timeframe?: "day" | "week" | "month" | "year" | "all_time"
}

export class AchievementSystem {
  private achievements: Map<string, Achievement> = new Map()

  // Feature 79: Achievement definitions
  initializeAchievements(): Achievement[] {
    const achievementDefs = [
      {
        id: "first-steps",
        name: "First Steps",
        description: "Complete your first day of energy monitoring",
        icon: "footprints",
        category: "milestone" as const,
        tier: "bronze" as const,
        points: 10,
        requirement: { type: "streak" as const, value: 1 },
      },
      {
        id: "week-warrior",
        name: "Week Warrior",
        description: "Maintain 7-day monitoring streak",
        icon: "calendar",
        category: "consistency" as const,
        tier: "silver" as const,
        points: 50,
        requirement: { type: "streak" as const, value: 7 },
      },
      {
        id: "energy-saver",
        name: "Energy Saver",
        description: "Save 100 kWh total",
        icon: "battery",
        category: "savings" as const,
        tier: "bronze" as const,
        points: 25,
        requirement: { type: "total_savings" as const, value: 100 },
      },
      {
        id: "efficiency-expert",
        name: "Efficiency Expert",
        description: "Achieve 90% efficiency rating",
        icon: "zap",
        category: "efficiency" as const,
        tier: "gold" as const,
        points: 100,
        requirement: { type: "reduction" as const, value: 90 },
      },
      {
        id: "solar-champion",
        name: "Solar Champion",
        description: "Use 50% renewable energy for a month",
        icon: "sun",
        category: "renewable" as const,
        tier: "gold" as const,
        points: 150,
        requirement: { type: "solar_usage" as const, value: 50, timeframe: "month" },
      },
      {
        id: "community-leader",
        name: "Community Leader",
        description: "Rank in top 10% of your community",
        icon: "trophy",
        category: "social" as const,
        tier: "platinum" as const,
        points: 200,
        requirement: { type: "community" as const, value: 10 },
      },
      {
        id: "automation-master",
        name: "Automation Master",
        description: "Create 10 active automation rules",
        icon: "robot",
        category: "efficiency" as const,
        tier: "silver" as const,
        points: 75,
        requirement: { type: "automation" as const, value: 10 },
      },
    ]

    return achievementDefs.map((def) =>
      this.createAchievement({
        ...def,
        unlocked: false,
        progress: 0,
        maxProgress: def.requirement.value,
      }),
    )
  }

  private createAchievement(achievement: Omit<Achievement, "id"> & { id: string }): Achievement {
    this.achievements.set(achievement.id, achievement as Achievement)
    return achievement as Achievement
  }

  // Feature 80: Progress tracking
  updateProgress(achievementId: string, progress: number): Achievement | null {
    const achievement = this.achievements.get(achievementId)
    if (!achievement || achievement.unlocked) return null

    achievement.progress = Math.min(progress, achievement.maxProgress)

    if (achievement.progress >= achievement.maxProgress && !achievement.unlocked) {
      achievement.unlocked = true
      achievement.unlockedAt = Date.now()
    }

    return achievement
  }

  // Feature 81: Achievement notifications
  checkForNewAchievements(userStats: any): Achievement[] {
    const newlyUnlocked: Achievement[] = []

    this.achievements.forEach((achievement) => {
      if (achievement.unlocked) return

      const meetsRequirement = this.checkRequirement(achievement.requirement, userStats)
      if (meetsRequirement) {
        achievement.unlocked = true
        achievement.unlockedAt = Date.now()
        achievement.progress = achievement.maxProgress
        newlyUnlocked.push(achievement)
      }
    })

    return newlyUnlocked
  }

  private checkRequirement(requirement: AchievementRequirement, stats: any): boolean {
    switch (requirement.type) {
      case "total_savings":
        return stats.totalSavings >= requirement.value
      case "streak":
        return stats.currentStreak >= requirement.value
      case "reduction":
        return stats.efficiencyRating >= requirement.value
      case "solar_usage":
        return stats.renewablePercentage >= requirement.value
      case "community":
        return stats.communityRank <= requirement.value
      case "automation":
        return stats.activeAutomations >= requirement.value
      default:
        return false
    }
  }

  // Feature 82: Leaderboard calculation
  calculateLeaderboardScore(stats: any): number {
    return (
      stats.totalSavings * 2 +
      stats.efficiencyRating * 10 +
      stats.renewablePercentage * 5 +
      stats.currentStreak * 3 +
      stats.achievementPoints
    )
  }
}

export const achievementSystem = new AchievementSystem()
