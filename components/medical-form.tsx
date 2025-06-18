"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormFieldWithVoice } from "./form-field-with-voice"
import { User, FileText, Stethoscope, Search, Heart, Save, Loader2 } from "lucide-react"

interface MedicalFormProps {
  onTranscription: (text: string, targetField?: string) => void
  targetField?: string
  onTargetFieldChange: (field?: string) => void
}

interface FormData {
  nombrePaciente: string
  rut: string
  edad: string
  fecha: string
  antecedentesImportantes: string
  alergias: string
  anamnesis: string
  examenFisico: string
  diagnostico: string
  medicamentos: string
  planSeguimiento: string
  notas: string
}

export function MedicalForm({ onTranscription, targetField, onTargetFieldChange }: MedicalFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nombrePaciente: "",
    rut: "",
    edad: "",
    fecha: new Date().toISOString().split("T")[0],
    antecedentesImportantes: "",
    alergias: "",
    anamnesis: "",
    examenFisico: "",
    diagnostico: "",
    medicamentos: "",
    planSeguimiento: "",
    notas: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [response, setResponse] = useState<{ success: boolean; message: string } | null>(null)

  const formatRUT = (value: string) => {
    const cleaned = value.replace(/[^0-9kK]/g, "")
    if (cleaned.length === 0) return ""

    const rut = cleaned.slice(0, -1)
    const dv = cleaned.slice(-1)

    if (rut.length > 3) {
      const formatted = rut.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      return cleaned.length > 1 ? `${formatted}-${dv}` : cleaned
    }

    return cleaned.length > 1 ? `${rut}-${dv}` : cleaned
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === "rut") {
      value = formatRUT(value)
    }

    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleVoiceTranscription = (text: string, field?: string) => {
    if (field && field in formData) {
      const currentValue = formData[field as keyof FormData]
      const newValue = currentValue ? `${currentValue}. ${text}` : text

      setFormData((prev) => ({ ...prev, [field]: newValue }))

      // Visual feedback
      const element = document.getElementById(field)
      if (element) {
        element.style.background = "#e8f5e8"
        setTimeout(() => {
          element.style.background = ""
        }, 1000)
      }
    }
  }

  // Set up transcription handler
  React.useEffect(() => {
    onTranscription = handleVoiceTranscription
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResponse(null)

    try {
      const submitData = {
        ...formData,
        timestamp: new Date().toISOString(),
        tipo: "urgencia",
        dispositivo: "movil",
        userAgent: navigator.userAgent.substring(0, 100),
        voiceUsed: true,
      }

      const response = await fetch("https://clxpwfuzv0.execute-api.us-east-1.amazonaws.com/prod/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`)
      }

      const result = await response.json()

      setResponse({
        success: true,
        message: `Registro guardado exitosamente. ID: ${result.registroId}`,
      })

      // Reset form
      setFormData({
        nombrePaciente: "",
        rut: "",
        edad: "",
        fecha: new Date().toISOString().split("T")[0],
        antecedentesImportantes: "",
        alergias: "",
        anamnesis: "",
        examenFisico: "",
        diagnostico: "",
        medicamentos: "",
        planSeguimiento: "",
        notas: "",
      })

      // Haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate([100, 50, 100])
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setResponse({
        success: false,
        message: `Error al guardar: ${error instanceof Error ? error.message : "Error desconocido"}`,
      })

      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200, 100, 200])
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const fieldLabels = {
    nombrePaciente: "Nombre del Paciente",
    rut: "RUT",
    edad: "Edad",
    antecedentesImportantes: "Antecedentes Importantes",
    alergias: "Alergias",
    anamnesis: "Síntomas y Anamnesis",
    examenFisico: "Examen Físico",
    diagnostico: "Diagnóstico",
    medicamentos: "Medicamentos",
    planSeguimiento: "Plan de Seguimiento",
    notas: "Notas Adicionales",
  }

  return (
    <div className="px-4 pb-6 max-h-[calc(100vh-300px)] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Data Section */}
        <Card className="bg-gradient-to-br from-blue-50 to-gray-50 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <User className="w-5 h-5" />
              Datos del Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormFieldWithVoice
              fieldName="nombrePaciente"
              label={fieldLabels.nombrePaciente}
              onVoiceSelect={onTargetFieldChange}
              isVoiceTarget={targetField === "nombrePaciente"}
            >
              <Label htmlFor="nombrePaciente">
                Nombre Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombrePaciente"
                value={formData.nombrePaciente}
                onChange={(e) => handleInputChange("nombrePaciente", e.target.value)}
                required
                className="text-base"
              />
            </FormFieldWithVoice>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormFieldWithVoice
                fieldName="rut"
                label={fieldLabels.rut}
                onVoiceSelect={onTargetFieldChange}
                isVoiceTarget={targetField === "rut"}
              >
                <Label htmlFor="rut">
                  RUT <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="rut"
                  value={formData.rut}
                  onChange={(e) => handleInputChange("rut", e.target.value)}
                  placeholder="12.345.678-9"
                  required
                  className="text-base"
                />
              </FormFieldWithVoice>

              <FormFieldWithVoice
                fieldName="edad"
                label={fieldLabels.edad}
                onVoiceSelect={onTargetFieldChange}
                isVoiceTarget={targetField === "edad"}
              >
                <Label htmlFor="edad">Edad</Label>
                <Input
                  id="edad"
                  type="number"
                  value={formData.edad}
                  onChange={(e) => handleInputChange("edad", e.target.value)}
                  min="0"
                  max="120"
                  className="text-base"
                />
              </FormFieldWithVoice>
            </div>

            <div>
              <Label htmlFor="fecha">Fecha de Atención</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => handleInputChange("fecha", e.target.value)}
                className="text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Medical History Section */}
        <Card className="bg-gradient-to-br from-green-50 to-gray-50 border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <FileText className="w-5 h-5" />
              Antecedentes Médicos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormFieldWithVoice
              fieldName="antecedentesImportantes"
              label={fieldLabels.antecedentesImportantes}
              onVoiceSelect={onTargetFieldChange}
              isVoiceTarget={targetField === "antecedentesImportantes"}
            >
              <Label htmlFor="antecedentesImportantes">Antecedentes Importantes</Label>
              <Textarea
                id="antecedentesImportantes"
                value={formData.antecedentesImportantes}
                onChange={(e) => handleInputChange("antecedentesImportantes", e.target.value)}
                placeholder="Diabetes, hipertensión, cirugías previas..."
                className="min-h-[80px] text-base resize-none"
              />
            </FormFieldWithVoice>

            <FormFieldWithVoice
              fieldName="alergias"
              label={fieldLabels.alergias}
              onVoiceSelect={onTargetFieldChange}
              isVoiceTarget={targetField === "alergias"}
            >
              <Label htmlFor="alergias">Alergias</Label>
              <Textarea
                id="alergias"
                value={formData.alergias}
                onChange={(e) => handleInputChange("alergias", e.target.value)}
                placeholder="Medicamentos, alimentos, otros..."
                className="min-h-[80px] text-base resize-none"
              />
            </FormFieldWithVoice>
          </CardContent>
        </Card>

        {/* Consultation Reason Section */}
        <Card className="bg-gradient-to-br from-orange-50 to-gray-50 border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Stethoscope className="w-5 h-5" />
              Motivo de Consulta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormFieldWithVoice
              fieldName="anamnesis"
              label={fieldLabels.anamnesis}
              onVoiceSelect={onTargetFieldChange}
              isVoiceTarget={targetField === "anamnesis"}
            >
              <Label htmlFor="anamnesis">Síntomas y Anamnesis</Label>
              <Textarea
                id="anamnesis"
                value={formData.anamnesis}
                onChange={(e) => handleInputChange("anamnesis", e.target.value)}
                placeholder="Descripción de síntomas, inicio, duración..."
                className="min-h-[80px] text-base resize-none"
              />
            </FormFieldWithVoice>
          </CardContent>
        </Card>

        {/* Physical Examination Section */}
        <Card className="bg-gradient-to-br from-purple-50 to-gray-50 border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Search className="w-5 h-5" />
              Examen Físico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormFieldWithVoice
              fieldName="examenFisico"
              label={fieldLabels.examenFisico}
              onVoiceSelect={onTargetFieldChange}
              isVoiceTarget={targetField === "examenFisico"}
            >
              <Label htmlFor="examenFisico">Hallazgos del Examen</Label>
              <Textarea
                id="examenFisico"
                value={formData.examenFisico}
                onChange={(e) => handleInputChange("examenFisico", e.target.value)}
                placeholder="Signos vitales, examen por sistemas..."
                className="min-h-[80px] text-base resize-none"
              />
            </FormFieldWithVoice>
          </CardContent>
        </Card>

        {/* Diagnosis and Treatment Section */}
        <Card className="bg-gradient-to-br from-red-50 to-gray-50 border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Heart className="w-5 h-5" />
              Diagnóstico y Tratamiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormFieldWithVoice
              fieldName="diagnostico"
              label={fieldLabels.diagnostico}
              onVoiceSelect={onTargetFieldChange}
              isVoiceTarget={targetField === "diagnostico"}
            >
              <Label htmlFor="diagnostico">Diagnóstico</Label>
              <Textarea
                id="diagnostico"
                value={formData.diagnostico}
                onChange={(e) => handleInputChange("diagnostico", e.target.value)}
                placeholder="Diagnóstico principal y diferenciales..."
                className="min-h-[80px] text-base resize-none"
              />
            </FormFieldWithVoice>

            <FormFieldWithVoice
              fieldName="medicamentos"
              label={fieldLabels.medicamentos}
              onVoiceSelect={onTargetFieldChange}
              isVoiceTarget={targetField === "medicamentos"}
            >
              <Label htmlFor="medicamentos">Medicamentos y Tratamiento</Label>
              <Textarea
                id="medicamentos"
                value={formData.medicamentos}
                onChange={(e) => handleInputChange("medicamentos", e.target.value)}
                placeholder="Prescripciones, dosis, indicaciones..."
                className="min-h-[80px] text-base resize-none"
              />
            </FormFieldWithVoice>

            <FormFieldWithVoice
              fieldName="planSeguimiento"
              label={fieldLabels.planSeguimiento}
              onVoiceSelect={onTargetFieldChange}
              isVoiceTarget={targetField === "planSeguimiento"}
            >
              <Label htmlFor="planSeguimiento">Plan de Seguimiento</Label>
              <Textarea
                id="planSeguimiento"
                value={formData.planSeguimiento}
                onChange={(e) => handleInputChange("planSeguimiento", e.target.value)}
                placeholder="Controles, derivaciones, recomendaciones..."
                className="min-h-[80px] text-base resize-none"
              />
            </FormFieldWithVoice>

            <FormFieldWithVoice
              fieldName="notas"
              label={fieldLabels.notas}
              onVoiceSelect={onTargetFieldChange}
              isVoiceTarget={targetField === "notas"}
            >
              <Label htmlFor="notas">Notas Adicionales</Label>
              <Textarea
                id="notas"
                value={formData.notas}
                onChange={(e) => handleInputChange("notas", e.target.value)}
                placeholder="Observaciones importantes..."
                className="min-h-[80px] text-base resize-none"
              />
            </FormFieldWithVoice>
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 text-lg font-semibold rounded-2xl shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Guardar Registro Médico
            </>
          )}
        </Button>

        {response && (
          <Alert className={response.success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
            <AlertDescription className={response.success ? "text-green-800" : "text-red-800"}>
              {response.message}
            </AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  )
}
