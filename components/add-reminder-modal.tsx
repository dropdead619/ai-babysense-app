"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface Baby {
  id: string
  name: string
}

interface AddReminderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedBaby: Baby | null
}

export function AddReminderModal({ open, onOpenChange, selectedBaby }: AddReminderModalProps) {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [reminderType, setReminderType] = useState("")
  const [scheduledFor, setScheduledFor] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (open) {
      // Reset form
      setTitle("")
      setMessage("")
      setReminderType("")
      setScheduledFor("")
      setError(null)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBaby) return

    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const reminderData = {
        baby_id: selectedBaby.id,
        user_id: user.id,
        title,
        message,
        reminder_type: reminderType,
        scheduled_for: scheduledFor ? new Date(scheduledFor).toISOString() : null,
        is_completed: false,
      }

      const { error } = await supabase.from("reminders").insert(reminderData)

      if (error) throw error

      onOpenChange(false)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const reminderTypes = [
    { value: "feeding", label: "Feeding" },
    { value: "sleep", label: "Sleep" },
    { value: "medicine", label: "Medicine" },
    { value: "appointment", label: "Appointment" },
    { value: "milestone", label: "Milestone" },
    { value: "tip", label: "Parenting Tip" },
  ]

  const getPresetReminders = (type: string) => {
    const presets = {
      feeding: {
        title: "Feeding Time",
        message: "Time for baby's next feeding session",
      },
      sleep: {
        title: "Nap Time",
        message: "Put baby down for their scheduled nap",
      },
      medicine: {
        title: "Medicine Time",
        message: "Give baby their prescribed medication",
      },
      appointment: {
        title: "Doctor Appointment",
        message: "Upcoming pediatrician visit",
      },
      milestone: {
        title: "Development Milestone",
        message: "Check baby's developmental progress",
      },
      tip: {
        title: "Parenting Tip",
        message: "Remember to practice tummy time daily",
      },
    }
    return presets[type as keyof typeof presets] || { title: "", message: "" }
  }

  const handleTypeChange = (type: string) => {
    setReminderType(type)
    const preset = getPresetReminders(type)
    setTitle(preset.title)
    setMessage(preset.message)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Reminder</DialogTitle>
          <DialogDescription>Create a reminder for {selectedBaby?.name || "your baby"}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reminderType">Reminder Type</Label>
            <Select value={reminderType} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select reminder type" />
              </SelectTrigger>
              <SelectContent>
                {reminderTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Reminder title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Reminder details..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduledFor">Scheduled For (Optional)</Label>
            <Input
              id="scheduledFor"
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
            />
          </div>

          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              {isLoading ? "Creating..." : "Create Reminder"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
