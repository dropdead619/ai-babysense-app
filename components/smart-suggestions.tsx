"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Plus } from "lucide-react"
import { useState } from "react"
import { AddReminderModal } from "./add-reminder-modal"

interface Baby {
  id: string
  name: string
  birth_date: string
}

interface CareActivity {
  id: string
  activity_type: string
  start_time: string
  end_time: string | null
  baby_id: string
}

interface Reminder {
  id: string
  reminder_type: string
  is_completed: boolean
}

interface SmartSuggestionsProps {
  selectedBaby: Baby | null
  recentActivities: CareActivity[]
  existingReminders: Reminder[]
}

export function SmartSuggestions({ selectedBaby, recentActivities, existingReminders }: SmartSuggestionsProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null)

  if (!selectedBaby) return null

  const generateSuggestions = () => {
    const suggestions = []
    const now = new Date()
    const babyAge = Math.floor((now.getTime() - new Date(selectedBaby.birth_date).getTime()) / (1000 * 60 * 60 * 24))

    // Analyze recent feeding patterns
    const recentFeedings = recentActivities
      .filter((a) => a.activity_type === "feeding")
      .slice(0, 10)
      .map((a) => new Date(a.start_time))

    if (recentFeedings.length >= 2) {
      const avgFeedingInterval =
        recentFeedings.reduce((sum, feeding, index) => {
          if (index === 0) return sum
          return sum + (recentFeedings[index - 1].getTime() - feeding.getTime())
        }, 0) /
        (recentFeedings.length - 1)

      const avgHours = Math.round(avgFeedingInterval / (1000 * 60 * 60))
      const nextFeedingTime = new Date(recentFeedings[0].getTime() + avgFeedingInterval)

      if (nextFeedingTime > now) {
        suggestions.push({
          type: "feeding",
          title: "Next Feeding Reminder",
          message: `Based on recent patterns, next feeding is due around ${nextFeedingTime.toLocaleTimeString()}`,
          scheduledFor: nextFeedingTime.toISOString().slice(0, 16),
          priority: "high",
        })
      }
    }

    // Age-based milestone suggestions
    if (babyAge >= 30 && babyAge <= 35) {
      suggestions.push({
        type: "milestone",
        title: "1-Month Milestone Check",
        message: "Time to check if baby is lifting their head during tummy time",
        priority: "medium",
      })
    }

    if (babyAge >= 60 && babyAge <= 70) {
      suggestions.push({
        type: "milestone",
        title: "2-Month Milestone Check",
        message: "Look for social smiles and better head control",
        priority: "medium",
      })
    }

    // Medicine reminders based on age
    if (babyAge >= 60) {
      const hasMedicineReminder = existingReminders.some((r) => r.reminder_type === "medicine" && !r.is_completed)
      if (!hasMedicineReminder) {
        suggestions.push({
          type: "medicine",
          title: "Vitamin D Supplement",
          message: "Daily vitamin D drops for breastfed babies",
          priority: "medium",
        })
      }
    }

    // Sleep pattern suggestions
    const recentSleep = recentActivities.filter((a) => a.activity_type === "sleep").slice(0, 5)
    if (recentSleep.length < 3) {
      suggestions.push({
        type: "tip",
        title: "Sleep Tracking Tip",
        message: "Track sleep patterns to identify your baby's natural rhythm",
        priority: "low",
      })
    }

    return suggestions.slice(0, 3) // Limit to 3 suggestions
  }

  const suggestions = generateSuggestions()

  const handleCreateFromSuggestion = (suggestion: any) => {
    setSelectedSuggestion(suggestion)
    setShowAddModal(true)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (suggestions.length === 0) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-sm">No suggestions at the moment</p>
            <p className="text-gray-500 text-xs">Keep tracking activities to get personalized suggestions</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Smart Suggestions for {selectedBaby.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{suggestion.message}</p>
                  </div>
                  <Badge className={`${getPriorityColor(suggestion.priority)} text-xs capitalize ml-2`}>
                    {suggestion.priority}
                  </Badge>
                </div>
                <Button
                  onClick={() => handleCreateFromSuggestion(suggestion)}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="mr-2 h-3 w-3" />
                  Create Reminder
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddReminderModal
        open={showAddModal}
        onOpenChange={(open) => {
          setShowAddModal(open)
          if (!open) setSelectedSuggestion(null)
        }}
        selectedBaby={selectedBaby}
      />
    </>
  )
}
