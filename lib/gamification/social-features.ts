export interface UserProfile {
  id: string
  username: string
  avatar: string
  level: number
  points: number
  rank: number
  achievements: string[]
  streak: number
  joinedAt: number
  stats: UserStats
}

export interface UserStats {
  totalSavings: number
  efficiencyRating: number
  renewablePercentage: number
  carbonOffset: number
  challengesCompleted: number
}

export interface LeaderboardEntry {
  rank: number
  user: UserProfile
  score: number
  change: number
}

export class SocialFeatures {
  // Feature 87: Leaderboard generation
  generateLeaderboard(
    users: UserProfile[],
    timeframe: "daily" | "weekly" | "monthly" | "all_time",
  ): LeaderboardEntry[] {
    const sorted = users
      .map((user) => ({
        user,
        score: this.calculateScore(user, timeframe),
      }))
      .sort((a, b) => b.score - a.score)

    return sorted.map((entry, index) => ({
      rank: index + 1,
      user: entry.user,
      score: entry.score,
      change: Math.floor(Math.random() * 10) - 5, // Simulated rank change
    }))
  }

  private calculateScore(user: UserProfile, timeframe: string): number {
    const baseScore = user.points + user.stats.totalSavings * 2 + user.stats.efficiencyRating * 10

    if (timeframe === "weekly" || timeframe === "daily") {
      return baseScore + user.streak * 5
    }

    return baseScore
  }

  // Feature 88: Community comparison
  compareWithCommunity(
    userStats: UserStats,
    communityStats: UserStats,
  ): {
    category: string
    userValue: number
    communityAvg: number
    percentile: number
    better: boolean
  }[] {
    return [
      {
        category: "Energy Savings",
        userValue: userStats.totalSavings,
        communityAvg: communityStats.totalSavings,
        percentile: this.calculatePercentile(userStats.totalSavings, communityStats.totalSavings),
        better: userStats.totalSavings > communityStats.totalSavings,
      },
      {
        category: "Efficiency Rating",
        userValue: userStats.efficiencyRating,
        communityAvg: communityStats.efficiencyRating,
        percentile: this.calculatePercentile(userStats.efficiencyRating, communityStats.efficiencyRating),
        better: userStats.efficiencyRating > communityStats.efficiencyRating,
      },
      {
        category: "Renewable Usage",
        userValue: userStats.renewablePercentage,
        communityAvg: communityStats.renewablePercentage,
        percentile: this.calculatePercentile(userStats.renewablePercentage, communityStats.renewablePercentage),
        better: userStats.renewablePercentage > communityStats.renewablePercentage,
      },
      {
        category: "Carbon Offset",
        userValue: userStats.carbonOffset,
        communityAvg: communityStats.carbonOffset,
        percentile: this.calculatePercentile(userStats.carbonOffset, communityStats.carbonOffset),
        better: userStats.carbonOffset > communityStats.carbonOffset,
      },
    ]
  }

  private calculatePercentile(userValue: number, avgValue: number): number {
    if (avgValue === 0) return 50
    const ratio = userValue / avgValue
    return Math.min(Math.max(ratio * 50, 0), 100)
  }

  // Feature 89: Team/group management
  createTeam(
    name: string,
    description: string,
    members: string[],
  ): {
    id: string
    name: string
    description: string
    members: string[]
    totalPoints: number
    rank: number
  } {
    return {
      id: `team-${Date.now()}`,
      name,
      description,
      members,
      totalPoints: 0,
      rank: 0,
    }
  }

  // Feature 90: Social sharing
  generateShareableStats(user: UserProfile): {
    title: string
    description: string
    stats: Array<{ label: string; value: string }>
    shareUrl: string
  } {
    return {
      title: `${user.username}'s Energy Achievements`,
      description: `Level ${user.level} Energy Champion`,
      stats: [
        { label: "Total Savings", value: `${user.stats.totalSavings} kWh` },
        { label: "Carbon Offset", value: `${user.stats.carbonOffset} kg CO₂` },
        { label: "Current Streak", value: `${user.streak} days` },
        { label: "Achievements", value: `${user.achievements.length}` },
      ],
      shareUrl: `https://energymonitor.app/profile/${user.id}`,
    }
  }
}

export const socialFeatures = new SocialFeatures()
