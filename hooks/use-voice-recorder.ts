"use client"

import { useState, useRef, useCallback } from "react"

interface VoiceRecorderState {
  isRecording: boolean
  recordedChunks: Blob[]
  recordingTime: number
  audioStream: MediaStream | null
  mediaRecorder: MediaRecorder | null
}

export function useVoiceRecorder() {
  const [state, setState] = useState<VoiceRecorderState>({
    isRecording: false,
    recordedChunks: [],
    recordingTime: 0,
    audioStream: null,
    mediaRecorder: null,
  })

  const timerRef = useRef<NodeJS.Timeout>()
  const startTimeRef = useRef<number>()

  const startRecording = useCallback(async () => {
    try {
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4"
      const recorder = new MediaRecorder(stream, { mimeType })

      const chunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = () => {
        setState((prev) => ({
          ...prev,
          recordedChunks: chunks,
          isRecording: false,
        }))
      }

      recorder.start(1000)
      startTimeRef.current = Date.now()

      // Start timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000)
        setState((prev) => ({ ...prev, recordingTime: elapsed }))
      }, 1000)

      setState((prev) => ({
        ...prev,
        isRecording: true,
        audioStream: stream,
        mediaRecorder: recorder,
        recordingTime: 0,
      }))

      // Haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate(100)
      }
    } catch (error) {
      console.error("Error starting recording:", error)
      throw error
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (state.mediaRecorder && state.isRecording) {
      state.mediaRecorder.stop()

      if (state.audioStream) {
        state.audioStream.getTracks().forEach((track) => track.stop())
      }

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      // Haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate([50, 50, 50])
      }
    }
  }, [state.mediaRecorder, state.isRecording, state.audioStream])

  const playRecording = useCallback(() => {
    if (state.recordedChunks.length > 0) {
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4"
      const audioBlob = new Blob(state.recordedChunks, { type: mimeType })
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      audio.play().catch((error) => {
        console.error("Error playing audio:", error)
      })

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [state.recordedChunks])

  const clearRecording = useCallback(() => {
    setState((prev) => ({
      ...prev,
      recordedChunks: [],
      recordingTime: 0,
    }))
  }, [])

  return {
    ...state,
    startRecording,
    stopRecording,
    playRecording,
    clearRecording,
  }
}
