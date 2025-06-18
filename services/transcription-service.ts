// Simulated transcription service
export class TranscriptionService {
  private static simulatedTexts = [
    "Paciente de 45 años con dolor torácico de inicio súbito",
    "Antecedentes de hipertensión arterial y diabetes mellitus tipo 2",
    "Presenta disnea y sudoración profusa desde hace 2 horas",
    "Examen físico revela taquicardia y palidez generalizada",
    "Sospecha de síndrome coronario agudo en evolución",
    "Indicar electrocardiograma de 12 derivaciones y enzimas cardíacas",
    "Administrar aspirina 300mg y oxígeno suplementario",
    "Control en cardiología dentro de las próximas 24 horas",
    "Paciente refiere alergia a penicilina y sulfonamidas",
    "Signos vitales estables, presión arterial 140/90 mmHg",
  ]

  static async transcribeAudio(audioBlob: Blob): Promise<string> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Return random medical text for demo
    const randomIndex = Math.floor(Math.random() * this.simulatedTexts.length)
    return this.simulatedTexts[randomIndex]
  }
}
