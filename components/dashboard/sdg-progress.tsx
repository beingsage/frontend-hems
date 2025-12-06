"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Leaf, Zap } from "lucide-react"

interface SDGProgressProps {
  sdg7Progress: number
  sdg13Progress: number
}

export function SDGProgress({ sdg7Progress, sdg13Progress }: SDGProgressProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SDG Progress</CardTitle>
        <CardDescription>Sustainable Development Goals Progress Tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">SDG 7: Affordable and Clean Energy</span>
            </div>
            <span className="text-sm text-muted-foreground">{sdg7Progress}%</span>
          </div>
          <Progress value={sdg7Progress} className="h-2" />
          <p className="text-sm text-muted-foreground">Energy efficiency and renewable adoption</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-500" />
              <span className="font-medium">SDG 13: Climate Action</span>
            </div>
            <span className="text-sm text-muted-foreground">{sdg13Progress}%</span>
          </div>
          <Progress value={sdg13Progress} className="h-2" />
          <p className="text-sm text-muted-foreground">Carbon footprint reduction progress</p>
        </div>
      </CardContent>
    </Card>
  )
}