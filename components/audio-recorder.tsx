"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Square } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Baby {
  id: string
  name: string
}

interface AudioRecorderProps {
  selectedBaby: Baby | null
  onAnalysisStart: () => void
  onAnalysisComplete: (analysis: any) => void
  isAnalyzing: boolean
}

export function AudioRecorder({ selectedBaby, onAnalysisStart, onAnalysisComplete, isAnalyzing }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    // Check microphone permission
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false))
  }, [])

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRecording])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Set up audio analysis for visualization
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 256

      // Start audio level monitoring
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length
          setAudioLevel(average)
        }
        if (isRecording) {
          animationRef.current = requestAnimationFrame(updateAudioLevel)
        }
      }
      updateAudioLevel()

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" })
        await analyzeAudio(audioBlob)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
    } catch (error) {
      console.error("Error starting recording:", error)
      setHasPermission(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Clean up
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      setAudioLevel(0)
    }
  }

  const analyzeAudio = async (audioBlob: Blob) => {
    if (!selectedBaby) return

    onAnalysisStart()

    // Simulate AI analysis with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock analysis results
    const mockResults = [
      { need: "hunger", confidence: 0.85, description: "Baby is likely hungry. Consider feeding." },
      { need: "sleep", confidence: 0.78, description: "Baby seems tired. Try putting them down for a nap." },
      { need: "discomfort", confidence: 0.72, description: "Baby may be uncomfortable. Check diaper or clothing." },
      { need: "attention", confidence: 0.65, description: "Baby wants attention and interaction." },
      { need: "pain", confidence: 0.45, description: "Baby might be in pain. Monitor closely." },
    ]

    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("cry_analyses")
        .insert({
          baby_id: selectedBaby.id,
          user_id: user.id,
          predicted_need: randomResult.need,
          confidence_score: randomResult.confidence,
          analysis_result: {
            description: randomResult.description,
            recommendations: getRecommendations(randomResult.need),
            timestamp: new Date().toISOString(),
          },
        })
        .select(`
        *,
        babies (
          name
        )
      `)
        .single()

      if (error) throw error

      onAnalysisComplete(data)
    } catch (error) {
      console.error("Error saving analysis:", error)
      // Still show results even if saving fails
      onAnalysisComplete({
        id: "temp",
        predicted_need: randomResult.need,
        confidence_score: randomResult.confidence,
        analysis_result: {
          description: randomResult.description,
          recommendations: getRecommendations(randomResult.need),
        },
        created_at: new Date().toISOString(),
        babies: { name: selectedBaby.name },
      })
    }
  }

  const getRecommendations = (need: string) => {
    const recommendations = {
      hunger: [
        "Offer breast or bottle feeding",
        "Check if it's been 2-3 hours since last feeding",
        "Look for hunger cues like rooting or sucking motions",
      ],
      sleep: [
        "Create a calm, dark environment",
        "Try swaddling or gentle rocking",
        "Check if baby has been awake for 1-2 hours",
      ],
      discomfort: [
        "Check and change diaper if needed",
        "Adjust room temperature",
        "Check for tight clothing or hair wrapped around fingers/toes",
      ],
      attention: ["Talk or sing to your baby", "Make eye contact and smile", "Try gentle play or tummy time"],
      pain: [
        "Check for signs of illness or injury",
        "Consider gas or colic remedies",
        "Consult pediatrician if crying persists",
      ],
    }
    return recommendations[need as keyof typeof recommendations] || []
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (hasPermission === false) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <MicOff className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Microphone Access Required</h3>
        <p className="text-gray-600 mb-4">Please allow microphone access to record your baby's cry.</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  if (!selectedBaby) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please select a baby to start recording.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <div className="text-center">
        <div className="mb-6">
          <div
            className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording
                ? "bg-gradient-to-br from-red-500 to-pink-600 animate-pulse"
                : "bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            }`}
          >
            {isRecording ? <Square className="h-12 w-12 text-white" /> : <Mic className="h-12 w-12 text-white" />}
          </div>
        </div>

        {isRecording ? (
          <div className="space-y-4">
            <div className="text-2xl font-bold text-gray-900">{formatTime(recordingTime)}</div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Recording audio level</p>
              <Progress value={audioLevel} className="w-full max-w-xs mx-auto" />
            </div>
            <Button onClick={stopRecording} size="lg" variant="destructive" disabled={isAnalyzing}>
              <Square className="mr-2 h-4 w-4" />
              Stop Recording
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">Tap to start recording {selectedBaby.name}'s cry</p>
            <Button
              onClick={startRecording}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              disabled={isAnalyzing}
            >
              <Mic className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
          </div>
        )}
      </div>

      {/* Recording Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Recording Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Hold your phone close to your baby (6-12 inches away)</li>
          <li>• Record for at least 10-15 seconds for best results</li>
          <li>• Minimize background noise when possible</li>
          <li>• Make sure your baby is actively crying during recording</li>
        </ul>
      </div>
    </div>
  )
}
