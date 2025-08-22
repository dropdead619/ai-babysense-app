"use client"

import { Button } from "@/components/ui/button"
import { Utensils, Moon, Baby, Gamepad2, Pill, Plus } from "lucide-react"

interface QuickActionsProps {
  onQuickAction: (activityType: string) => void
}

export function QuickActions({ onQuickAction }: QuickActionsProps) {
  const actions = [
    {
      type: "feeding",
      label: "Feeding",
      icon: Utensils,
      color: "from-orange-500 to-amber-600",
      description: "Log feeding session",
    },
    {
      type: "sleep",
      label: "Sleep",
      icon: Moon,
      color: "from-indigo-500 to-purple-600",
      description: "Track sleep time",
    },
    {
      type: "diaper",
      label: "Diaper",
      icon: Baby,
      color: "from-green-500 to-emerald-600",
      description: "Record diaper change",
    },
    {
      type: "play",
      label: "Play",
      icon: Gamepad2,
      color: "from-pink-500 to-rose-600",
      description: "Log playtime",
    },
    {
      type: "medicine",
      label: "Medicine",
      icon: Pill,
      color: "from-red-500 to-pink-600",
      description: "Track medication",
    },
    {
      type: "other",
      label: "Other",
      icon: Plus,
      color: "from-gray-500 to-slate-600",
      description: "Custom activity",
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.type}
              onClick={() => onQuickAction(action.type)}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:shadow-md transition-shadow"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">{action.label}</p>
                <p className="text-xs text-gray-600">{action.description}</p>
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
