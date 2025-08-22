"use client"

import { BabyProfileCard } from "./baby-profile-card"

interface Baby {
  id: string
  name: string
  birth_date: string
  gender: string | null
  photo_url: string | null
  created_at: string
}

interface BabyProfileGridProps {
  babies: Baby[]
}

export function BabyProfileGrid({ babies }: BabyProfileGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {babies.map((baby) => (
        <BabyProfileCard key={baby.id} baby={baby} />
      ))}
    </div>
  )
}
