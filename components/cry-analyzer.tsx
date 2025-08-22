"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AudioRecorder } from "./audio-recorder"
import { AnalysisResults } from "./analysis-results"
import { AnalysisHistory } from "./analysis-history"
import { BabySelector } from "./baby-selector"

interface Baby {
  id: string
  name: string
  birth_date: string
  gender: string | null
}

interface CryAnalysis {
  id: string
  predicted_need: string
  confidence_score: number
  analysis_result: any
  created_at: string
  babies: {
    name: string
  }
}

interface CryAnalyzerProps {
  babies: Baby[]
  recentAnalyses: CryAnalysis[]
}

export function CryAnalyzer({ babies, recentAnalyses }: CryAnalyzerProps) {
  const [selectedBaby, setSelectedBaby] = useState<Baby | null>(babies[0] || null)
  const [currentAnalysis, setCurrentAnalysis] = useState<CryAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  if (babies.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mb-6">
          <span className="text-4xl text-white">👶</span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Baby Profiles Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          You need to add at least one baby profile before using the cry analyzer.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Analyzer */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎤</span>
              Record Baby's Cry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <BabySelector babies={babies} selectedBaby={selectedBaby} onSelectBaby={setSelectedBaby} />

            <AudioRecorder
              selectedBaby={selectedBaby}
              onAnalysisStart={() => setIsAnalyzing(true)}
              onAnalysisComplete={(analysis) => {
                setCurrentAnalysis(analysis)
                setIsAnalyzing(false)
              }}
              isAnalyzing={isAnalyzing}
            />
          </CardContent>
        </Card>

        {(currentAnalysis || isAnalyzing) && <AnalysisResults analysis={currentAnalysis} isAnalyzing={isAnalyzing} />}
      </div>

      {/* History Sidebar */}
      <div className="space-y-6">
        <AnalysisHistory analyses={recentAnalyses} />
      </div>
    </div>
  )
}
