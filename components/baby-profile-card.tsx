"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, Mic, Activity } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { EditBabyModal } from "./edit-baby-modal"
import { DeleteBabyModal } from "./delete-baby-modal"
import Link from "next/link"

interface Baby {
  id: string
  name: string
  birth_date: string
  gender: string | null
  photo_url: string | null
  created_at: string
}

interface BabyProfileCardProps {
  baby: Baby
}

export function BabyProfileCard({ baby }: BabyProfileCardProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Calculate age
  const birthDate = new Date(baby.birth_date)
  const today = new Date()
  const ageInDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))
  const ageInMonths = Math.floor(ageInDays / 30)
  const ageInWeeks = Math.floor(ageInDays / 7)

  const getAgeDisplay = () => {
    if (ageInDays < 7) {
      return `${ageInDays} day${ageInDays !== 1 ? "s" : ""} old`
    } else if (ageInDays < 60) {
      return `${ageInWeeks} week${ageInWeeks !== 1 ? "s" : ""} old`
    } else {
      return `${ageInMonths} month${ageInMonths !== 1 ? "s" : ""} old`
    }
  }

  const getGenderEmoji = () => {
    switch (baby.gender) {
      case "male":
        return "👦"
      case "female":
        return "👧"
      default:
        return "👶"
    }
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center">
                {baby.photo_url ? (
                  <img
                    src={baby.photo_url || "/placeholder.svg"}
                    alt={baby.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <span className="text-2xl text-white">{getGenderEmoji()}</span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{baby.name}</h3>
                <p className="text-sm text-gray-600">{getAgeDisplay()}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteModal(true)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Born</span>
              <span className="text-sm font-medium text-gray-900">{birthDate.toLocaleDateString()}</span>
            </div>
            {baby.gender && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Gender</span>
                <Badge variant="secondary" className="capitalize">
                  {baby.gender}
                </Badge>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-2">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              <Link href="/cry-analyzer">
                <Mic className="mr-2 h-4 w-4" />
                Analyze Cry
              </Link>
            </Button>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Link href="/care-tracker">
                <Activity className="mr-2 h-4 w-4" />
                Track Care
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditBabyModal baby={baby} open={showEditModal} onOpenChange={setShowEditModal} />
      <DeleteBabyModal baby={baby} open={showDeleteModal} onOpenChange={setShowDeleteModal} />
    </>
  )
}
