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
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"

interface Baby {
  id: string
  name: string
}

interface LogActivityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedBaby: Baby | null
  activityType: string
}

export function LogActivityModal({ open, onOpenChange, selectedBaby, activityType }: LogActivityModalProps) {
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [notes, setNotes] = useState("")
  const [isOngoing, setIsOngoing] = useState(false)
  const [metadata, setMetadata] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (open) {
      // Set default start time to now
      const now = new Date()
      const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      setStartTime(localDateTime)
      setEndTime("")
      setNotes("")
      setIsOngoing(false)
      setMetadata({})
      setError(null)
    }
  }, [open, activityType])

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

      const activityData = {
        baby_id: selectedBaby.id,
        user_id: user.id,
        activity_type: activityType,
        start_time: new Date(startTime).toISOString(),
        end_time: isOngoing || !endTime ? null : new Date(endTime).toISOString(),
        notes: notes || null,
        metadata: Object.keys(metadata).length > 0 ? metadata : null,
      }

      const { error } = await supabase.from("care_activities").insert(activityData)

      if (error) throw error

      onOpenChange(false)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const renderActivitySpecificFields = () => {
    switch (activityType) {
      case "feeding":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={metadata.type || ""}
                  onValueChange={(value) => setMetadata({ ...metadata, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breast">Breast</SelectItem>
                    <SelectItem value="bottle">Bottle</SelectItem>
                    <SelectItem value="solid">Solid Food</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount (ml/oz)</Label>
                <Input
                  type="number"
                  placeholder="120"
                  value={metadata.amount || ""}
                  onChange={(e) => setMetadata({ ...metadata, amount: e.target.value })}
                />
              </div>
            </div>
          </div>
        )

      case "diaper":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={metadata.type || ""}
                  onValueChange={(value) => setMetadata({ ...metadata, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wet">Wet</SelectItem>
                    <SelectItem value="dirty">Dirty</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Condition</Label>
                <Select
                  value={metadata.condition || ""}
                  onValueChange={(value) => setMetadata({ ...metadata, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="loose">Loose</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="unusual">Unusual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case "medicine":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Medicine Name</Label>
                <Input
                  placeholder="Medicine name"
                  value={metadata.name || ""}
                  onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Dosage</Label>
                <Input
                  placeholder="5ml"
                  value={metadata.dosage || ""}
                  onChange={(e) => setMetadata({ ...metadata, dosage: e.target.value })}
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getActivityTitle = () => {
    const titles = {
      feeding: "Log Feeding",
      sleep: "Log Sleep",
      diaper: "Log Diaper Change",
      play: "Log Playtime",
      medicine: "Log Medicine",
      other: "Log Activity",
    }
    return titles[activityType as keyof typeof titles] || "Log Activity"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{getActivityTitle()}</DialogTitle>
          <DialogDescription>
            Record {selectedBaby?.name}'s {activityType} activity.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={isOngoing}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="ongoing" checked={isOngoing} onCheckedChange={setIsOngoing} />
            <Label htmlFor="ongoing" className="text-sm">
              Activity is ongoing
            </Label>
          </div>

          {renderActivitySpecificFields()}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
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
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              {isLoading ? "Saving..." : "Save Activity"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
