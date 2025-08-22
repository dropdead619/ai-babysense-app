"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { RemindersList } from "./reminders-list"
import { SmartSuggestions } from "./smart-suggestions"
import { ParentingTips } from "./parenting-tips"
import { AddReminderModal } from "./add-reminder-modal"
import { BabySelector } from "./baby-selector"

interface Baby {
  id: string
  name: string
  birth_date: string
  gender: string | null
}

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

interface CareActivity {
  id: string
  activity_type: string
  start_time: string
  end_time: string | null
  baby_id: string
}

interface SmartRemindersProps {
  babies: Baby[]
  reminders: Reminder[]
  recentActivities: CareActivity[]
}

export function SmartReminders({ babies, reminders, recentActivities }: SmartRemindersProps) {
  const [selectedBaby, setSelectedBaby] = useState<Baby | null>(babies[0] || null)
  const [showAddModal, setShowAddModal] = useState(false)

  if (babies.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mb-6">
          <span className="text-4xl text-white">👶</span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Baby Profiles Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          You need to add at least one baby profile before setting up reminders.
        </p>
      </div>
    )
  }

  // Filter reminders and activities for selected baby
  const babyReminders = selectedBaby
    ? reminders.filter((reminder) => reminder.babies.name === selectedBaby.name)
    : reminders

  const babyActivities = selectedBaby
    ? recentActivities.filter((activity) => activity.baby_id === selectedBaby.id)
    : recentActivities

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">⏰</span>
                  Reminders
                </CardTitle>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reminder
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <BabySelector babies={babies} selectedBaby={selectedBaby} onSelectBaby={setSelectedBaby} />

              <RemindersList reminders={babyReminders} />
            </CardContent>
          </Card>

          <SmartSuggestions
            selectedBaby={selectedBaby}
            recentActivities={babyActivities}
            existingReminders={babyReminders}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ParentingTips selectedBaby={selectedBaby} />
        </div>
      </div>

      <AddReminderModal open={showAddModal} onOpenChange={setShowAddModal} selectedBaby={selectedBaby} />
    </>
  )
}
