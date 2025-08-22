"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuickActions } from "./quick-actions"
import { ActivityTimeline } from "./activity-timeline"
import { CareStats } from "./care-stats"
import { BabySelector } from "./baby-selector"
import { LogActivityModal } from "./log-activity-modal"

interface Baby {
  id: string
  name: string
  birth_date: string
  gender: string | null
}

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

interface CareTrackerProps {
  babies: Baby[]
  recentActivities: CareActivity[]
}

export function CareTracker({ babies, recentActivities }: CareTrackerProps) {
  const [selectedBaby, setSelectedBaby] = useState<Baby | null>(babies[0] || null)
  const [showLogModal, setShowLogModal] = useState(false)
  const [selectedActivityType, setSelectedActivityType] = useState<string>("")

  const handleQuickAction = (activityType: string) => {
    setSelectedActivityType(activityType)
    setShowLogModal(true)
  }

  if (babies.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-6">
          <span className="text-4xl text-white">👶</span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Baby Profiles Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          You need to add at least one baby profile before tracking their care.
        </p>
      </div>
    )
  }

  // Filter activities for selected baby
  const babyActivities = selectedBaby
    ? recentActivities.filter((activity) => activity.babies.name === selectedBaby.name)
    : recentActivities

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Tracker */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📝</span>
                Log Care Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <BabySelector babies={babies} selectedBaby={selectedBaby} onSelectBaby={setSelectedBaby} />

              <QuickActions onQuickAction={handleQuickAction} />
            </CardContent>
          </Card>

          <CareStats activities={babyActivities} selectedBaby={selectedBaby} />
        </div>

        {/* Timeline Sidebar */}
        <div className="space-y-6">
          <ActivityTimeline activities={babyActivities} />
        </div>
      </div>

      <LogActivityModal
        open={showLogModal}
        onOpenChange={setShowLogModal}
        selectedBaby={selectedBaby}
        activityType={selectedActivityType}
      />
    </>
  )
}
