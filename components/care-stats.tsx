"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Clock, Target } from "lucide-react"

interface CareActivity {
  id: string
  activity_type: string
  start_time: string
  end_time: string | null
  metadata: any
}

interface Baby {
  id: string
  name: string
}

interface CareStatsProps {
  activities: CareActivity[]
  selectedBaby: Baby | null
}

export function CareStats({ activities, selectedBaby }: CareStatsProps) {
  if (!selectedBaby) return null

  // Get today's activities
  const today = new Date()
  const todayActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.start_time)
    return activityDate.toDateString() === today.toDateString()
  })

  // Calculate stats
  const feedingCount = todayActivities.filter((a) => a.activity_type === "feeding").length
  const sleepActivities = todayActivities.filter((a) => a.activity_type === "sleep" && a.end_time)
  const totalSleepMinutes = sleepActivities.reduce((total, activity) => {
    if (activity.end_time) {
      const start = new Date(activity.start_time)
      const end = new Date(activity.end_time)
      return total + Math.floor((end.getTime() - start.getTime()) / (1000 * 60))
    }
    return total
  }, 0)
  const diaperCount = todayActivities.filter((a) => a.activity_type === "diaper").length

  const formatSleepTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const stats = [
    {
      label: "Feedings Today",
      value: feedingCount,
      target: 8,
      icon: "🍼",
      color: "from-orange-500 to-amber-600",
    },
    {
      label: "Sleep Today",
      value: totalSleepMinutes,
      target: 720, // 12 hours in minutes
      icon: "😴",
      color: "from-indigo-500 to-purple-600",
      formatter: formatSleepTime,
    },
    {
      label: "Diaper Changes",
      value: diaperCount,
      target: 6,
      icon: "👶",
      color: "from-green-500 to-emerald-600",
    },
  ]

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Today's Summary for {selectedBaby.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const percentage = Math.min((stat.value / stat.target) * 100, 100)
            const displayValue = stat.formatter ? stat.formatter(stat.value) : stat.value

            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className="font-medium text-gray-900">{stat.label}</span>
                  </div>
                  <Target className="h-4 w-4 text-gray-400" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">{displayValue}</span>
                    <span className="text-sm text-gray-600">
                      / {stat.formatter ? stat.formatter(stat.target) : stat.target}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <p className="text-xs text-gray-500">{Math.round(percentage)}% of daily target</p>
                </div>
              </div>
            )
          })}
        </div>

        {todayActivities.length === 0 && (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-sm">No activities logged today</p>
            <p className="text-gray-500 text-xs">Start tracking {selectedBaby.name}'s care activities</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
