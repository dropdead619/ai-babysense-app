"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Baby {
  id: string
  name: string
  birth_date: string
}

interface ParentingTipsProps {
  selectedBaby: Baby | null
}

export function ParentingTips({ selectedBaby }: ParentingTipsProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  const getAgeInDays = (birthDate: string) => {
    const now = new Date()
    const birth = new Date(birthDate)
    return Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getTipsForAge = (ageInDays: number) => {
    if (ageInDays < 30) {
      return [
        {
          title: "Newborn Sleep",
          tip: "Newborns sleep 14-17 hours per day in short bursts. This is completely normal!",
          category: "sleep",
        },
        {
          title: "Feeding Frequency",
          tip: "Breastfed babies typically feed every 2-3 hours, while formula-fed babies may go 3-4 hours.",
          category: "feeding",
        },
        {
          title: "Tummy Time",
          tip: "Start with 2-3 minutes of tummy time several times a day to strengthen neck muscles.",
          category: "development",
        },
        {
          title: "Crying is Normal",
          tip: "Babies cry 1-3 hours per day on average. Peak crying usually occurs around 6 weeks.",
          category: "behavior",
        },
      ]
    } else if (ageInDays < 90) {
      return [
        {
          title: "Social Smiles",
          tip: "Around 6-8 weeks, your baby will start smiling in response to your voice and face.",
          category: "development",
        },
        {
          title: "Longer Sleep Stretches",
          tip: "By 2-3 months, many babies can sleep for 4-6 hour stretches at night.",
          category: "sleep",
        },
        {
          title: "Increased Tummy Time",
          tip: "Gradually increase tummy time to 15-20 minutes per day to build strength.",
          category: "development",
        },
        {
          title: "Growth Spurts",
          tip: "Expect growth spurts around 2-3 weeks, 6 weeks, and 3 months with increased feeding.",
          category: "feeding",
        },
      ]
    } else if (ageInDays < 180) {
      return [
        {
          title: "Rolling Over",
          tip: "Most babies start rolling from tummy to back around 4 months, then back to tummy.",
          category: "development",
        },
        {
          title: "Sleep Regression",
          tip: "The 4-month sleep regression is common as sleep patterns mature. Stay consistent!",
          category: "sleep",
        },
        {
          title: "Introducing Solids",
          tip: "Around 6 months, look for signs of readiness: sitting up, showing interest in food.",
          category: "feeding",
        },
        {
          title: "Babbling Begins",
          tip: "Your baby will start making consonant sounds like 'ba-ba' and 'da-da' around 4-6 months.",
          category: "development",
        },
      ]
    } else {
      return [
        {
          title: "Sitting Up",
          tip: "Most babies can sit without support by 6-8 months. Provide a safe space to practice.",
          category: "development",
        },
        {
          title: "Solid Food Exploration",
          tip: "Let your baby explore different textures and flavors. Mess is part of learning!",
          category: "feeding",
        },
        {
          title: "Stranger Anxiety",
          tip: "Stranger anxiety around 6-12 months is a normal sign of healthy attachment.",
          category: "behavior",
        },
        {
          title: "Crawling Preparation",
          tip: "Encourage crawling by placing toys just out of reach during tummy time.",
          category: "development",
        },
      ]
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "sleep":
        return "bg-indigo-100 text-indigo-800"
      case "feeding":
        return "bg-orange-100 text-orange-800"
      case "development":
        return "bg-green-100 text-green-800"
      case "behavior":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!selectedBaby) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Parenting Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-sm">Select a baby to see age-appropriate tips</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const ageInDays = getAgeInDays(selectedBaby.birth_date)
  const tips = getTipsForAge(ageInDays)
  const currentTip = tips[currentTipIndex]

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length)
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Parenting Tips
          </CardTitle>
          <Button onClick={nextTip} size="sm" variant="outline">
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">{currentTip.title}</h4>
            <Badge className={`${getCategoryColor(currentTip.category)} text-xs capitalize`}>
              {currentTip.category}
            </Badge>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{currentTip.tip}</p>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Tip {currentTipIndex + 1} of {tips.length}
            </span>
            <span>Age: {Math.floor(ageInDays / 30)} months</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
