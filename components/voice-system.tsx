"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Square, Play, FileText, Loader2 } from "lucide-react"
import { useVoiceRecorder } from "@/hooks/use-voice-recorder"
import { TranscriptionService } from "@/services/transcription-service"

interface VoiceSystemProps {
  onTranscription: (text: string, targetField?: string) => void
  targetField?: string
  onTargetFieldChange: (field?: string) => void
}

export function VoiceSystem({ onTranscription, targetField, onTargetFieldChange }: VoiceSystemProps) {
  const [status, setStatus] = useState("Presiona el micrófono para iniciar grabación")
  const [transcript, setTranscript] = useState("La transcripción aparecerá aquí...")
  const [isTranscribing, setIsTranscribing] = useState(false)

  const { isRecording, recordedChunks, recordingTime, startRecording, stopRecording, playRecording, clearRecording } =
    useVoiceRecorder()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartRecording = async () => {
    try {
      setStatus("Solicitando acceso al micrófono...")
      await startRecording()
      setStatus("Grabando... Habla claramente")
    } catch (error) {
      console.error("Error starting recording:", error)
      setStatus("Error: No se pudo acceder al micrófono")
    }
  }

  const handleStopRecording = () => {
    stopRecording()
    setStatus("Grabación completada. ¿Reproducir o transcribir?")
  }

  const handleTranscribe = async () => {
    if (recordedChunks.length === 0) return

    setIsTranscribing(true)
    setStatus("Transcribiendo audio...")

    try {
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4"
      const audioBlob = new Blob(recordedChunks, { type: mimeType })

      const transcribedText = await TranscriptionService.transcribeAudio(audioBlob)

      setTranscript(transcribedText)
      setStatus("Transcripción completada exitosamente")

      // Send transcription to parent component
      onTranscription(transcribedText, targetField)

      // Clear target field
      onTargetFieldChange(undefined)

      // Haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate([100, 50, 100])
      }
    } catch (error) {
      console.error("Error transcribing:", error)
      setStatus("Error en la transcripción")
    } finally {
      setIsTranscribing(false)
    }
  }

  return (
    <Card className="mx-4 mb-4 bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-xl">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            <span className="font-semibold">Grabación de Voz</span>
          </div>
          <div className="font-mono text-base font-bold min-w-[60px] text-right">{formatTime(recordingTime)}</div>
        </div>

        <div className="flex gap-3 justify-center mb-3">
          {!isRecording ? (
            <Button
              onClick={handleStartRecording}
              size="lg"
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/30"
            >
              <Mic className="w-6 h-6" />
            </Button>
          ) : (
            <Button
              onClick={handleStopRecording}
              size="lg"
              className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-red-500 animate-pulse"
            >
              <Square className="w-6 h-6" />
            </Button>
          )}

          {recordedChunks.length > 0 && !isRecording && (
            <>
              <Button
                onClick={playRecording}
                size="lg"
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/30"
              >
                <Play className="w-6 h-6" />
              </Button>

              <Button
                onClick={handleTranscribe}
                disabled={isTranscribing}
                size="lg"
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/30"
              >
                {isTranscribing ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileText className="w-6 h-6" />}
              </Button>
            </>
          )}
        </div>

        {/* Audio Visualizer */}
        <div className="h-12 bg-white/10 rounded-lg mb-3 flex items-center justify-center gap-1 px-3">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-white/60 rounded-full transition-all duration-100"
              style={{
                height: isRecording ? `${Math.random() * 40 + 10}px` : "6px",
              }}
            />
          ))}
        </div>

        <div className="text-center text-sm opacity-90 mb-2">
          {targetField && (
            <div className="bg-white/20 rounded-lg p-2 mb-2">
              Campo seleccionado: <strong>{targetField}</strong>
            </div>
          )}
          {status}
        </div>

        <div className="bg-white/10 rounded-lg p-3">
          <div
            className={`text-sm ${transcript !== "La transcripción aparecerá aquí..." ? "opacity-100" : "opacity-70 italic"}`}
          >
            {transcript}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
