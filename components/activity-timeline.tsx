"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Utensils, Moon, Baby, Gamepad2, Pill, Plus } from "lucide-react"

interface CareActivity {
  id: string
  activity_type: string
  start_time: string
  end_time: string | null
  notes: string | null
  metadata: any
  babies: {
    name: string
  }
}

interface ActivityTimelineProps {
  activities: CareActivity[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "feeding":
        return <Utensils className="h-4 w-4" />
      case "sleep":
        return <Moon className="h-4 w-4" />
      case "diaper":
        return <Baby className="h-4 w-4" />
      case "play":
        return <Gamepad2 className="h-4 w-4" />
      case "medicine":
        return <Pill className="h-4 w-4" />
      default:
        return <Plus className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "feeding":
        return "bg-orange-100 text-orange-800"
      case "sleep":
        return "bg-indigo-100 text-indigo-800"
      case "diaper":
        return "bg-green-100 text-green-800"
      case "play":
        return "bg-pink-100 text-pink-800"
      case "medicine":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  const getDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return "Ongoing"

    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffInMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`
    } else {
      const hours = Math.floor(diffInMinutes / 60)
      const minutes = diffInMinutes % 60
      return `${hours}h ${minutes}m`
    }
  }

  // Group activities by date
  const groupedActivities = activities.reduce(
    (groups, activity) => {
      const date = formatDate(activity.start_time)
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(activity)
      return groups
    },
    {} as Record<string, CareActivity[]>,
  )

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-sm">No activities logged yet</p>
            <p className="text-gray-500 text-xs">Your care activities will appear here</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-6">
              {Object.entries(groupedActivities).map(([date, dateActivities]) => (
                <div key={date} className="space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm sticky top-0 bg-white py-1">{date}</h4>
                  <div className="space-y-3">
                    {dateActivities.map((activity) => (
                      <div key={activity.id} className="border border-gray-100 rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getActivityColor(activity.activity_type)}`}>
                              {getActivityIcon(activity.activity_type)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 capitalize">{activity.activity_type}</p>
                              <p className="text-xs text-gray-500">
                                {formatTime(activity.start_time)} •{" "}
                                {getDuration(activity.start_time, activity.end_time)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {activity.metadata && (
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(activity.metadata).map(([key, value]) => (
                              <Badge key={key} variant="secondary" className="text-xs">
                                {key}: {String(value)}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {activity.notes && <p className="text-sm text-gray-600 italic">"{activity.notes}"</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
