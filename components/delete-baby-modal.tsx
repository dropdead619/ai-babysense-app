"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface Baby {
  id: string
  name: string
  birth_date: string
  gender: string | null
  photo_url: string | null
}

interface DeleteBabyModalProps {
  baby: Baby
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteBabyModal({ baby, open, onOpenChange }: DeleteBabyModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("babies").delete().eq("id", baby.id)

      if (error) throw error

      onOpenChange(false)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Delete Baby Profile</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {baby.name}'s profile? This action cannot be undone and will remove all
            associated care records.
          </DialogDescription>
        </DialogHeader>
        {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleDelete} disabled={isLoading} variant="destructive" className="flex-1">
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
