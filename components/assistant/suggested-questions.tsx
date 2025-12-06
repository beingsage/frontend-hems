"use client"

import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void
}

const questions = [
  "Which devices are consuming the most energy?",
  "How can I save 20% on energy costs this month?",
  "Show me devices with anomalies",
  "What's the total CO₂ emissions today?",
  "Suggest an optimal schedule for AC units",
  "Which rooms have the highest consumption?",
]

export function SuggestedQuestions({ onQuestionClick }: SuggestedQuestionsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lightbulb className="h-4 w-4" />
        <span>Suggested questions:</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            className="justify-start text-left h-auto py-3 px-4 whitespace-normal bg-transparent"
            onClick={() => onQuestionClick(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  )
}
