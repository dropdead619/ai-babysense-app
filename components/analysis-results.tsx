"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Heart, Baby, AlertCircle, Moon, Utensils } from "lucide-react"

interface AnalysisResultsProps {
  analysis: any
  isAnalyzing: boolean
}

export function AnalysisResults({ analysis, isAnalyzing }: AnalysisResultsProps) {
  if (isAnalyzing) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900">Analyzing Cry Pattern...</h3>
            <p className="text-gray-600">Our AI is processing the audio to understand your baby's needs</p>
            <div className="max-w-xs mx-auto">
              <Progress value={75} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) return null

  const getIcon = (need: string) => {
    switch (need) {
      case "hunger":
        return <Utensils className="h-6 w-6" />
      case "sleep":
        return <Moon className="h-6 w-6" />
      case "discomfort":
        return <AlertCircle className="h-6 w-6" />
      case "attention":
        return <Heart className="h-6 w-6" />
      case "pain":
        return <AlertCircle className="h-6 w-6" />
      default:
        return <Baby className="h-6 w-6" />
    }
  }

  const getColor = (need: string) => {
    switch (need) {
      case "hunger":
        return "from-orange-500 to-amber-600"
      case "sleep":
        return "from-indigo-500 to-purple-600"
      case "discomfort":
        return "from-yellow-500 to-orange-600"
      case "attention":
        return "from-pink-500 to-rose-600"
      case "pain":
        return "from-red-500 to-pink-600"
      default:
        return "from-blue-500 to-indigo-600"
    }
  }

  const confidencePercentage = Math.round(analysis.confidence_score * 100)

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Result */}
        <div className="text-center space-y-4">
          <div
            className={`mx-auto w-20 h-20 bg-gradient-to-br ${getColor(analysis.predicted_need)} rounded-2xl flex items-center justify-center text-white`}
          >
            {getIcon(analysis.predicted_need)}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 capitalize mb-2">{analysis.predicted_need}</h3>
            <p className="text-gray-600 mb-4">{analysis.analysis_result?.description}</p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {confidencePercentage}% confidence
              </Badge>
            </div>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Confidence Level</span>
            <span className="font-medium">{confidencePercentage}%</span>
          </div>
          <Progress value={confidencePercentage} className="h-3" />
        </div>

        {/* Recommendations */}
        {analysis.analysis_result?.recommendations && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Recommended Actions</h4>
            <ul className="space-y-2">
              {analysis.analysis_result.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Timestamp */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Analysis completed at {new Date(analysis.created_at).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
