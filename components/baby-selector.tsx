"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Baby {
  id: string
  name: string
  birth_date: string
  gender: string | null
}

interface BabySelectorProps {
  babies: Baby[]
  selectedBaby: Baby | null
  onSelectBaby: (baby: Baby) => void
}

export function BabySelector({ babies, selectedBaby, onSelectBaby }: BabySelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Select Baby</Label>
      <Select
        value={selectedBaby?.id || ""}
        onValueChange={(value) => {
          const baby = babies.find((b) => b.id === value)
          if (baby) onSelectBaby(baby)
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choose which baby to analyze" />
        </SelectTrigger>
        <SelectContent>
          {babies.map((baby) => (
            <SelectItem key={baby.id} value={baby.id}>
              {baby.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
