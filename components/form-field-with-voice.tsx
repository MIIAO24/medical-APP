"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Mic } from "lucide-react"

interface FormFieldWithVoiceProps {
  children: ReactNode
  fieldName: string
  label: string
  onVoiceSelect: (fieldName: string) => void
  isVoiceTarget: boolean
}

export function FormFieldWithVoice({
  children,
  fieldName,
  label,
  onVoiceSelect,
  isVoiceTarget,
}: FormFieldWithVoiceProps) {
  return (
    <div className="relative">
      {children}
      <Button
        type="button"
        size="sm"
        onClick={() => onVoiceSelect(fieldName)}
        className={`absolute top-8 right-3 w-7 h-7 rounded-full p-0 ${
          isVoiceTarget ? "bg-green-500 hover:bg-green-600 animate-pulse" : "bg-red-500 hover:bg-red-600"
        } text-white shadow-lg`}
        title={`Grabar por voz: ${label}`}
      >
        <Mic className="w-3 h-3" />
      </Button>
    </div>
  )
}
