"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Trash2, Clock, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Reminder {
  id: string
  title: string
  message: string
  reminder_type: string
  scheduled_for: string | null
  is_completed: boolean
  created_at: string
  babies: {
    name: string
  }
}

interface RemindersListProps {
  reminders: Reminder[]
}

export function RemindersList({ reminders }: RemindersListProps) {
  const [updatingReminders, setUpdatingReminders] = useState<Set<string>>(new Set())
  const router = useRouter()

  const toggleComplete = async (reminderId: string, isCompleted: boolean) => {
    setUpdatingReminders((prev) => new Set(prev).add(reminderId))

    const supabase = createClient()
    try {
      const { error } = await supabase.from("reminders").update({ is_completed: !isCompleted }).eq("id", reminderId)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error updating reminder:", error)
    } finally {
      setUpdatingReminders((prev) => {
        const newSet = new Set(prev)
        newSet.delete(reminderId)
        return newSet
      })
    }
  }

  const deleteReminder = async (reminderId: string) => {
    const supabase = createClient()
    try {
      const { error } = await supabase.from("reminders").delete().eq("id", reminderId)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error deleting reminder:", error)
    }
  }

  const getReminderTypeColor = (type: string) => {
    switch (type) {
      case "feeding":
        return "bg-orange-100 text-orange-800"
      case "sleep":
        return "bg-indigo-100 text-indigo-800"
      case "medicine":
        return "bg-red-100 text-red-800"
      case "appointment":
        return "bg-blue-100 text-blue-800"
      case "milestone":
        return "bg-purple-100 text-purple-800"
      case "tip":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "No due date"
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 0) {
      return `Overdue by ${Math.abs(diffInHours)}h`
    } else if (diffInHours < 24) {
      return `Due in ${diffInHours}h`
    } else {
      return date.toLocaleDateString()
    }
  }

  const isOverdue = (dateString: string | null) => {
    if (!dateString) return false
    return new Date(dateString) < new Date()
  }

  // Separate completed and pending reminders
  const pendingReminders = reminders.filter((r) => !r.is_completed)
  const completedReminders = reminders.filter((r) => r.is_completed)

  if (reminders.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-sm">No reminders set</p>
        <p className="text-gray-500 text-xs">Add your first reminder to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Pending Reminders */}
      {pendingReminders.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Upcoming</h3>
          <div className="space-y-3">
            {pendingReminders.map((reminder) => (
              <Card key={reminder.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={reminder.is_completed}
                      onCheckedChange={() => toggleComplete(reminder.id, reminder.is_completed)}
                      disabled={updatingReminders.has(reminder.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{reminder.title}</h4>
                          <p className="text-sm text-gray-600">{reminder.message}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => deleteReminder(reminder.id)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getReminderTypeColor(reminder.reminder_type)} text-xs capitalize`}>
                          {reminder.reminder_type}
                        </Badge>
                        {reminder.scheduled_for && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${isOverdue(reminder.scheduled_for) ? "border-red-500 text-red-600" : ""}`}
                          >
                            {formatDateTime(reminder.scheduled_for)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Completed
          </h3>
          <div className="space-y-3">
            {completedReminders.slice(0, 5).map((reminder) => (
              <Card key={reminder.id} className="border border-gray-100 bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={reminder.is_completed}
                      onCheckedChange={() => toggleComplete(reminder.id, reminder.is_completed)}
                      disabled={updatingReminders.has(reminder.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-600 line-through">{reminder.title}</h4>
                          <p className="text-sm text-gray-500">{reminder.message}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => deleteReminder(reminder.id)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <Badge className={`${getReminderTypeColor(reminder.reminder_type)} text-xs capitalize`}>
                        {reminder.reminder_type}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
