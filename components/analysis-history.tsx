"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, TrendingUp } from "lucide-react"

interface CryAnalysis {
  id: string
  predicted_need: string
  confidence_score: number
  created_at: string
  babies: {
    name: string
  }
}

interface AnalysisHistoryProps {
  analyses: CryAnalysis[]
}

export function AnalysisHistory({ analyses }: AnalysisHistoryProps) {
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const getNeedColor = (need: string) => {
    switch (need) {
      case "hunger":
        return "bg-orange-100 text-orange-800"
      case "sleep":
        return "bg-indigo-100 text-indigo-800"
      case "discomfort":
        return "bg-yellow-100 text-yellow-800"
      case "attention":
        return "bg-pink-100 text-pink-800"
      case "pain":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Analyses
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analyses.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-sm">No analyses yet</p>
            <p className="text-gray-500 text-xs">Your cry analysis history will appear here</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <div key={analysis.id} className="border border-gray-100 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{analysis.babies.name}</p>
                      <p className="text-xs text-gray-500">{getTimeAgo(analysis.created_at)}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(analysis.confidence_score * 100)}%
                    </Badge>
                  </div>
                  <Badge className={`${getNeedColor(analysis.predicted_need)} text-xs capitalize`}>
                    {analysis.predicted_need}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
