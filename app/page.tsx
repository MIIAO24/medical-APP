"use client"

import { useState } from "react"
import { VoiceSystem } from "@/components/voice-system"
import { MedicalForm } from "@/components/medical-form"

export default function MedConsultApp() {
  const [targetField, setTargetField] = useState<string>()

  const handleTranscription = (text: string, field?: string) => {
    // This will be handled by the MedicalForm component
    console.log("Transcription received:", text, "for field:", field)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600">
      <div className="max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6 rounded-t-3xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-50">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)" />
              <circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)" />
              <circle cx="40" cy="80" r="1.5" fill="rgba(255,255,255,0.1)" />
            </svg>
          </div>

          <div className="relative z-10 text-center">
            <h1 className="text-2xl font-bold mb-2">🏥 MedConsult</h1>
            <p className="text-slate-200 text-sm mb-4">Sistema de Urgencias Médicas</p>

            <div className="flex items-center justify-center gap-2 bg-white/10 rounded-lg p-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Sistema conectado</span>
            </div>
          </div>
        </div>

        {/* Voice System */}
        <VoiceSystem
          onTranscription={handleTranscription}
          targetField={targetField}
          onTargetFieldChange={setTargetField}
        />

        {/* Medical Form */}
        <MedicalForm
          onTranscription={handleTranscription}
          targetField={targetField}
          onTargetFieldChange={setTargetField}
        />
      </div>
    </div>
  )
}
