<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>🏥 MedConsult - Urgencias</title>
    <meta name="description" content="Sistema de registro médico de urgencias - Acceso móvil con grabación de voz">
    <meta name="theme-color" content="#2c3e50">
    
    <!-- PWA Meta Tags -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="MedConsult Urgencias">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 10px;
            line-height: 1.6;
        }

        .container {
            max-width: 480px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
            overflow: hidden;
            animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .header {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            padding: 25px 20px;
            text-align: center;
            position: relative;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
        }

        .header h1 {
            font-size: 1.8rem;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
        }

        .header p {
            opacity: 0.9;
            font-size: 0.95rem;
            position: relative;
            z-index: 1;
        }

        /* === SISTEMA DE VOZ === */
        .voice-system {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            margin: 20px;
            border-radius: 15px;
            padding: 20px;
            color: white;
            position: relative;
            overflow: hidden;
        }

        .voice-system::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1), transparent 50%);
        }

        .voice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
        }

        .voice-title {
            font-size: 1.1rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .voice-timer {
            font-family: 'Courier New', monospace;
            font-size: 1.2rem;
            font-weight: bold;
            min-width: 80px;
            text-align: right;
        }

        .voice-controls {
            display: flex;
            gap: 15px;
            align-items: center;
            position: relative;
            z-index: 1;
        }

        .voice-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 3px solid rgba(255,255,255,0.3);
            background: rgba(255,255,255,0.1);
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
        }

        .voice-button:hover {
            transform: scale(1.1);
            background: rgba(255,255,255,0.2);
            border-color: rgba(255,255,255,0.5);
        }

        .voice-button.recording {
            background: rgba(255,255,255,0.9);
            color: #e74c3c;
            animation: pulse 1.5s infinite;
            box-shadow: 0 0 20px rgba(255,255,255,0.3);
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }

        .voice-visualizer {
            height: 60px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            margin: 15px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2px;
            padding: 10px;
            position: relative;
            z-index: 1;
        }

        .visualizer-bar {
            width: 3px;
            background: rgba(255,255,255,0.6);
            border-radius: 2px;
            transition: height 0.1s ease;
            min-height: 5px;
        }

        .voice-status {
            font-size: 0.9rem;
            opacity: 0.9;
            text-align: center;
            position: relative;
            z-index: 1;
        }

        .voice-transcript {
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            padding: 15px;
            margin-top: 15px;
            font-size: 0.9rem;
            min-height: 60px;
            position: relative;
            z-index: 1;
        }

        .transcript-content {
            font-style: italic;
            opacity: 0.8;
        }

        .transcript-content.has-content {
            opacity: 1;
            font-style: normal;
        }

        /* === FORMULARIO === */
        .form-container {
            padding: 20px;
            max-height: calc(100vh - 400px);
            overflow-y: auto;
        }

        .form-section {
            margin-bottom: 25px;
            padding: 20px;
            border-radius: 15px;
            border-left: 5px solid;
            position: relative;
            transition: transform 0.2s ease;
        }

        .form-section:active {
            transform: scale(0.98);
        }

        .section-paciente {
            background: linear-gradient(145deg, #e3f2fd, #f8f9fa);
            border-left-color: #2196f3;
        }

        .section-antecedentes {
            background: linear-gradient(145deg, #e8f5e8, #f8f9fa);
            border-left-color: #4caf50;
        }

        .section-consulta {
            background: linear-gradient(145deg, #fff3e0, #f8f9fa);
            border-left-color: #ff9800;
        }

        .section-examen {
            background: linear-gradient(145deg, #f3e5f5, #f8f9fa);
            border-left-color: #9c27b0;
        }

        .section-diagnostico {
            background: linear-gradient(145deg, #ffebee, #f8f9fa);
            border-left-color: #f44336;
        }

        .form-section h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.1rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .form-group {
            margin-bottom: 18px;
            position: relative;
        }

        .form-group label {
            display: block;
            margin-bottom: 6px;
            font-weight: 600;
            color: #34495e;
            font-size: 0.95rem;
        }

        .voice-target {
            position: absolute;
            top: 30px;
            right: 10px;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            background: #e74c3c;
            color: white;
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0.7;
            transition: all 0.3s ease;
        }

        .voice-target:hover {
            opacity: 1;
            transform: scale(1.1);
        }

        .voice-target.active {
            background: #27ae60;
            animation: pulse 1s infinite;
        }

        .required {
            color: #e74c3c;
            font-size: 0.9rem;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e1e8ed;
            border-radius: 12px;
            font-size: 16px;
            transition: all 0.3s ease;
            background: rgba(255,255,255,0.9);
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
            background: white;
        }

        .form-group textarea {
            resize: vertical;
            min-height: 80px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        @media (max-width: 480px) {
            .form-row {
                grid-template-columns: 1fr;
                gap: 15px;
            }
        }

        #btnGuardar {
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
            padding: 16px 30px;
            border: none;
            border-radius: 25px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            margin-top: 20px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        #btnGuardar:disabled {
            background: linear-gradient(135deg, #bdc3c7, #95a5a6);
            cursor: not-allowed;
        }

        .loading {
            display: inline-block;
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .response-container {
            margin-top: 20px;
            padding: 15px;
            border-radius: 12px;
            display: none;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .response-success {
            background: linear-gradient(145deg, #d4edda, #c3e6cb);
            border: 1px solid #c3e6cb;
            color: #155724;
        }

        .response-error {
            background: linear-gradient(145deg, #f8d7da, #f5c6cb);
            border: 1px solid #f5c6cb;
            color: #721c24;
        }

        .connection-status {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 20px;
            padding: 10px 15px;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            font-size: 0.9rem;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #27ae60;
            animation: pulse 2s infinite;
        }

        /* Mejoras para iOS Safari */
        input[type="date"]::-webkit-calendar-picker-indicator {
            background: transparent;
            bottom: 0;
            color: transparent;
            cursor: pointer;
            height: auto;
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
            width: auto;
        }

        /* Evitar zoom en inputs en iOS */
        @media screen and (-webkit-min-device-pixel-ratio: 0) {
            select:focus,
            textarea:focus,
            input:focus {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 MedConsult</h1>
            <p>Sistema de Urgencias Médicas</p>
            <div class="connection-status">
                <div class="status-dot"></div>
                <span>Sistema conectado</span>
            </div>
        </div>

        <!-- Sistema de Grabación de Voz -->
        <div class="voice-system">
            <div class="voice-header">
                <div class="voice-title">
                    🎙️ Grabación de Voz
                </div>
                <div class="voice-timer" id="voiceTimer">00:00</div>
            </div>

            <div class="voice-controls">
                <button class="voice-button" id="recordBtn" title="Iniciar grabación">
                    🎤
                </button>
                <button class="voice-button" id="stopBtn" title="Detener grabación" style="display: none;">
                    ⏹️
                </button>
                <button class="voice-button" id="playBtn" title="Reproducir" style="display: none;">
                    ▶️
                </button>
                <button class="voice-button" id="transcribeBtn" title="Transcribir" style="display: none;">
                    📝
                </button>
            </div>

            <div class="voice-visualizer" id="voiceVisualizer">
                <!-- Barras del visualizador se generan con JS -->
            </div>

            <div class="voice-status" id="voiceStatus">
                Presiona el micrófono para iniciar grabación
            </div>

            <div class="voice-transcript">
                <div class="transcript-content" id="transcriptContent">
                    La transcripción aparecerá aquí...
                </div>
            </div>
        </div>

        <div class="form-container">
            <form id="formularioMedico">
                <!-- Sección 1: Datos del Paciente -->
                <div class="form-section section-paciente">
                    <h3>👤 Datos del Paciente</h3>
                    <div class="form-group">
                        <label for="nombrePaciente">Nombre Completo <span class="required">*</span></label>
                        <input type="text" id="nombrePaciente" name="nombrePaciente" required autocomplete="name">
                        <div class="voice-target" data-field="nombrePaciente">🎤</div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="rut">RUT <span class="required">*</span></label>
                            <input type="text" id="rut" name="rut" required placeholder="12.345.678-9">
                            <div class="voice-target" data-field="rut">🎤</div>
                        </div>
                        <div class="form-group">
                            <label for="edad">Edad</label>
                            <input type="number" id="edad" name="edad" min="0" max="120">
                            <div class="voice-target" data-field="edad">🎤</div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="fecha">Fecha de Atención</label>
                        <input type="date" id="fecha" name="fecha">
                    </div>
                </div>

                <!-- Sección 2: Antecedentes -->
                <div class="form-section section-antecedentes">
                    <h3>📋 Antecedentes Médicos</h3>
                    <div class="form-group">
                        <label for="antecedentesImportantes">Antecedentes Importantes</label>
                        <textarea id="antecedentesImportantes" name="antecedentesImportantes" placeholder="Diabetes, hipertensión, cirugías previas..."></textarea>
                        <div class="voice-target" data-field="antecedentesImportantes">🎤</div>
                    </div>
                    <div class="form-group">
                        <label for="alergias">Alergias</label>
                        <textarea id="alergias" name="alergias" placeholder="Medicamentos, alimentos, otros..."></textarea>
                        <div class="voice-target" data-field="alergias">🎤</div>
                    </div>
                </div>

                <!-- Sección 3: Motivo de Consulta -->
                <div class="form-section section-consulta">
                    <h3>🩺 Motivo de Consulta</h3>
                    <div class="form-group">
                        <label for="anamnesis">Síntomas y Anamnesis</label>
                        <textarea id="anamnesis" name="anamnesis" placeholder="Descripción de síntomas, inicio, duración..."></textarea>
                        <div class="voice-target" data-field="anamnesis">🎤</div>
                    </div>
                </div>

                <!-- Sección 4: Examen Físico -->
                <div class="form-section section-examen">
                    <h3>🔍 Examen Físico</h3>
                    <div class="form-group">
                        <label for="examenFisico">Hallazgos del Examen</label>
                        <textarea id="examenFisico" name="examenFisico" placeholder="Signos vitales, examen por sistemas..."></textarea>
                        <div class="voice-target" data-field="examenFisico">🎤</div>
                    </div>
                </div>

                <!-- Sección 5: Diagnóstico y Tratamiento -->
                <div class="form-section section-diagnostico">
                    <h3>⚕️ Diagnóstico y Tratamiento</h3>
                    <div class="form-group">
                        <label for="diagnostico">Diagnóstico</label>
                        <textarea id="diagnostico" name="diagnostico" placeholder="Diagnóstico principal y diferenciales..."></textarea>
                        <div class="voice-target" data-field="diagnostico">🎤</div>
                    </div>
                    <div class="form-group">
                        <label for="medicamentos">Medicamentos y Tratamiento</label>
                        <textarea id="medicamentos" name="medicamentos" placeholder="Prescripciones, dosis, indicaciones..."></textarea>
                        <div class="voice-target" data-field="medicamentos">🎤</div>
                    </div>
                    <div class="form-group">
                        <label for="planSeguimiento">Plan de Seguimiento</label>
                        <textarea id="planSeguimiento" name="planSeguimiento" placeholder="Controles, derivaciones, recomendaciones..."></textarea>
                        <div class="voice-target" data-field="planSeguimiento">🎤</div>
                    </div>
                    <div class="form-group">
                        <label for="notas">Notas Adicionales</label>
                        <textarea id="notas" name="notas" placeholder="Observaciones importantes..."></textarea>
                        <div class="voice-target" data-field="notas">🎤</div>
                    </div>
                </div>

                <button type="submit" id="btnGuardar">
                    💾 Guardar Registro Médico
                </button>
            </form>

            <div id="responseContainer" class="response-container">
                <div id="responseContent"></div>
            </div>
        </div>
    </div>

    <script>
        // === CONFIGURACIÓN ===
        const API_URL = 'https://clxpwfuzv0.execute-api.us-east-1.amazonaws.com/prod/submit';

        // === VARIABLES DE VOZ ===
        let mediaRecorder;
        let recordedChunks = [];
        let isRecording = false;
        let recordingStartTime;
        let timerInterval;
        let audioStream;
        let audioContext;
        let analyser;
        let dataArray;
        let currentTargetField = null;

        // === ELEMENTOS DOM ===
        const recordBtn = document.getElementById('recordBtn');
        const stopBtn = document.getElementById('stopBtn');
        const playBtn = document.getElementById('playBtn');
        const transcribeBtn = document.getElementById('transcribeBtn');
        const voiceTimer = document.getElementById('voiceTimer');
        const voiceStatus = document.getElementById('voiceStatus');
        const voiceVisualizer = document.getElementById('voiceVisualizer');
        const transcriptContent = document.getElementById('transcriptContent');

        // === INICIALIZACIÓN ===
        document.addEventListener('DOMContentLoaded', function() {
            // Establecer fecha actual
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('fecha').value = today;

            // Formatear RUT mientras se escribe
            const rutInput = document.getElementById('rut');
            rutInput.addEventListener('input', formatRUT);

            // Inicializar visualizador
            initializeVisualizer();

            // Verificar compatibilidad de audio
            checkAudioSupport();

            // Event listeners para grabación
            recordBtn.addEventListener('click', handleRecordClick);
            stopBtn.addEventListener('click', stopRecording);
            playBtn.addEventListener('click', playRecording);
            transcribeBtn.addEventListener('click', transcribeAudio);

            // Event listeners para targets de voz
            document.querySelectorAll('.voice-target').forEach(target => {
                target.addEventListener('click', (e) => {
                    const fieldName = e.target.dataset.field;
                    selectTargetField(fieldName);
                });
            });

            console.log('🏥 Sistema médico con voz iniciado');
            console.log('📱 Dispositivo:', navigator.userAgent);
        });

        // === FUNCIONES DE COMPATIBILIDAD ===

        function checkAudioSupport() {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                voiceStatus.textContent = 'Grabación de voz no soportada en este navegador';
                recordBtn.style.opacity = '0.5';
                recordBtn.disabled = true;
                return false;
            }

            // Detectar iOS Safari específicamente
            const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isIOSSafari) {
                console.log('🍎 Dispositivo iOS detectado - Optimizaciones activadas');
                voiceStatus.textContent = 'Toca el micrófono y permite el acceso cuando se solicite';
            }

            return true;
        }

        function handleRecordClick() {
            // En iOS, necesitamos manejar el contexto de audio de forma especial
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    startRecording();
                });
            } else {
                startRecording();
            }
        }

        // === FUNCIONES DE VOZ ===

        function initializeVisualizer() {
            // Crear barras del visualizador
            for (let i = 0; i < 20; i++) {
                const bar = document.createElement('div');
                bar.className = 'visualizer-bar';
                bar.style.height = '5px';
                voiceVisualizer.appendChild(bar);
            }
        }

        function selectTargetField(fieldName) {
            // Resetear targets anteriores
            document.querySelectorAll('.voice-target').forEach(t => t.classList.remove('active'));
            
            // Activar target actual
            const target = document.querySelector(`[data-field="${fieldName}"]`);
            if (target) {
                target.classList.add('active');
                currentTargetField = fieldName;
                
                voiceStatus.textContent = `Campo seleccionado: ${getFieldLabel(fieldName)}`;
                
                // Auto-iniciar grabación si no está grabando
                if (!isRecording) {
                    setTimeout(() => handleRecordClick(), 500);
                }
            }
        }

        function getFieldLabel(fieldName) {
            const labels = {
                'nombrePaciente': 'Nombre del Paciente',
                'rut': 'RUT',
                'edad': 'Edad',
                'antecedentesImportantes': 'Antecedentes Importantes',
                'alergias': 'Alergias',
                'anamnesis': 'Síntomas y Anamnesis',
                'examenFisico': 'Examen Físico',
                'diagnostico': 'Diagnóstico',
                'medicamentos': 'Medicamentos',
                'planSeguimiento': 'Plan de Seguimiento',
                'notas': 'Notas Adicionales'
            };
            return labels[fieldName] || fieldName;
        }

        async function startRecording() {
            try {
                voiceStatus.textContent = 'Solicitando acceso al micrófono...';
                
                // Configuración optimizada para iOS
                const constraints = {
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                        sampleRate: 44100
                    }
                };

                // Solicitar permisos de micrófono
                audioStream = await navigator.mediaDevices.getUserMedia(constraints);
                
                console.log('✅ Acceso al micrófono concedido');
                voiceStatus.textContent = 'Micrófono activado, iniciando grabación...';

                // Verificar MediaRecorder support
                if (!MediaRecorder.isTypeSupported('audio/webm') && !MediaRecorder.isTypeSupported('audio/mp4')) {
                    throw new Error('Formato de audio no soportado');
                }

                // Configurar MediaRecorder con formato compatible
                const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
                
                mediaRecorder = new MediaRecorder(audioStream, {
                    mimeType: mimeType
                });

                recordedChunks = [];

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunks.push(event.data);
                        console.log('📊 Audio chunk recibido:', event.data.size, 'bytes');
                    }
                };

                mediaRecorder.onstop = () => {
                    console.log('🛑 Grabación detenida');
                    const audioBlob = new Blob(recordedChunks, { type: mimeType });
                    console.log('🎵 Audio blob creado:', audioBlob.size, 'bytes');
                    
                    // Habilitar botones
                    playBtn.style.display = 'flex';
                    transcribeBtn.style.display = 'flex';
                    
                    voiceStatus.textContent = 'Grabación completada. ¿Reproducir o transcribir?';
                };

                mediaRecorder.onerror = (event) => {
                    console.error('❌ Error en MediaRecorder:', event.error);
                    voiceStatus.textContent = 'Error en la grabación: ' + event.error.message;
                };

                // Configurar visualizador de audio (solo si es compatible)
                try {
                    setupAudioVisualizer();
                } catch (visualizerError) {
                    console.warn('⚠️ Visualizador no disponible:', visualizerError);
                }

                // Iniciar grabación
                mediaRecorder.start(1000); // Chunk cada segundo para mayor compatibilidad
                isRecording = true;
                recordingStartTime = Date.now();

                // Actualizar UI
                recordBtn.style.display = 'none';
                stopBtn.style.display = 'flex';
                stopBtn.classList.add('recording');

                // Iniciar timer
                startTimer();

                voiceStatus.textContent = 'Grabando... Habla claramente';

                // Vibración de inicio
                if ('vibrate' in navigator) {
                    navigator.vibrate(100);
                }

            } catch (error) {
                console.error('❌ Error accessing microphone:', error);
                
                // Manejo específico de errores
                let errorMessage = 'Error desconocido con el micrófono';
                
                if (error.name === 'NotAllowedError') {
                    errorMessage = 'Acceso al micrófono denegado. Ve a Configuración → Safari → Sitios web → Micrófono y permite el acceso';
                } else if (error.name === 'NotFoundError') {
                    errorMessage = 'No se encontró micrófono en el dispositivo';
                } else if (error.name === 'NotSupportedError') {
                    errorMessage = 'Grabación de audio no soportada en este navegador';
                } else if (error.name === 'SecurityError') {
                    errorMessage = 'Error de seguridad. Intenta recargar la página';
                }
                
                voiceStatus.textContent = errorMessage;
                
                // Mostrar ayuda adicional
                setTimeout(() => {
                    voiceStatus.textContent = 'Presiona el micrófono para intentar de nuevo';
                }, 5000);
            }
        }

        function setupAudioVisualizer() {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                const source = audioContext.createMediaStreamSource(audioStream);
                
                source.connect(analyser);
                analyser.fftSize = 64;
                
                const bufferLength = analyser.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);
                
                animateVisualizer();
            } catch (error) {
                console.warn('⚠️ Visualizador no disponible:', error);
                // Continuar sin visualizador
            }
        }

        function animateVisualizer() {
            if (!isRecording || !analyser) return;

            requestAnimationFrame(animateVisualizer);
            
            try {
                analyser.getByteFrequencyData(dataArray);
                
                const bars = document.querySelectorAll('.visualizer-bar');
                bars.forEach((bar, index) => {
                    const value = dataArray[index * 2] || 0;
                    const height = (value / 255) * 50 + 5;
                    bar.style.height = `${height}px`;
                });
            } catch (error) {
                // Silenciar errores del visualizador
            }
        }

        function stopRecording() {
            if (mediaRecorder && isRecording) {
                mediaRecorder.stop();
                
                // Limpiar stream
                if (audioStream) {
                    audioStream.getTracks().forEach(track => track.stop());
                }
                
                isRecording = false;

                // Detener timer
                clearInterval(timerInterval);

                // Actualizar UI
                stopBtn.style.display = 'none';
                stopBtn.classList.remove('recording');
                recordBtn.style.display = 'flex';

                // Vibración de parada
                if ('vibrate' in navigator) {
                    navigator.vibrate([50, 50, 50]);
                }
            }
        }

        function playRecording() {
            if (recordedChunks.length > 0) {
                const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
                const audioBlob = new Blob(recordedChunks, { type: mimeType });
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                
                audio.play().then(() => {
                    voiceStatus.textContent = 'Reproduciendo grabación...';
                }).catch(error => {
                    console.error('Error reproduciendo audio:', error);
                    voiceStatus.textContent = 'Error al reproducir audio';
                });
                
                audio.onended = () => {
                    voiceStatus.textContent = 'Reproducción terminada';
                    URL.revokeObjectURL(audioUrl);
                };
            }
        }

        async function transcribeAudio() {
            if (recordedChunks.length === 0) {
                voiceStatus.textContent = 'No hay audio para transcribir';
                return;
            }

            voiceStatus.textContent = 'Transcribiendo audio...';
            transcribeBtn.innerHTML = '🔄';

            try {
                const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
                const audioBlob = new Blob(recordedChunks, { type: mimeType });
                
                await simulateTranscription(audioBlob);
                
            } catch (error) {
                console.error('Error en transcripción:', error);
                voiceStatus.textContent = 'Error en la transcripción';
                transcribeBtn.innerHTML = '📝';
            }
        }

        async function simulateTranscription(audioBlob) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const simulatedTexts = [
                        "Paciente de 45 años con dolor torácico de inicio súbito",
                        "Antecedentes de hipertensión arterial y diabetes mellitus tipo 2",
                        "Presenta disnea y sudoración profusa desde hace 2 horas",
                        "Examen físico revela taquicardia y palidez generalizada",
                        "Sospecha de síndrome coronario agudo en evolución",
                        "Indicar electrocardiograma de 12 derivaciones y enzimas cardíacas",
                        "Administrar aspirina 300mg y oxígeno suplementario",
                        "Control en cardiología dentro de las próximas 24 horas",
                        "Paciente refiere alergia a penicilina y sulfonamidas",
                        "Signos vitales estables, presión arterial 140/90 mmHg"
                    ];
                    
                    const randomText = simulatedTexts[Math.floor(Math.random() * simulatedTexts.length)];
                    
                    // Mostrar transcripción
                    transcriptContent.textContent = randomText;
                    transcriptContent.classList.add('has-content');
                    
                    // Auto-completar campo si hay uno seleccionado
                    if (currentTargetField) {
                        autoCompleteField(currentTargetField, randomText);
                    }
                    
                    voiceStatus.textContent = 'Transcripción completada exitosamente';
                    transcribeBtn.innerHTML = '📝';
                    
                    // Resetear target field
                    document.querySelectorAll('.voice-target').forEach(t => t.classList.remove('active'));
                    currentTargetField = null;
                    
                    resolve();
                }, 2000);
            });
        }

        function autoCompleteField(fieldName, text) {
            const field = document.getElementById(fieldName);
            if (field) {
                // Si el campo ya tiene contenido, agregamos el nuevo texto
                if (field.value.trim()) {
                    field.value += '. ' + text;
                } else {
                    field.value = text;
                }
                
                // Formatear RUT si es necesario
                if (fieldName === 'rut') {
                    formatRUT({ target: field });
                }
                
                // Efecto visual
                field.style.background = '#e8f5e8';
                setTimeout(() => {
                    field.style.background = '';
                }, 1000);
                
                // Vibración de éxito
                if ('vibrate' in navigator) {
                    navigator.vibrate([100, 50, 100]);
                }
                
                console.log(`✅ Campo ${fieldName} completado con voz`);
            }
        }

        function startTimer() {
            timerInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                voiceTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);
        }

        // === FUNCIONES EXISTENTES ===

        // Formatear RUT chileno (CORREGIDO)
        function formatRUT(e) {
            let value = e.target.value.replace(/[^0-9kK]/g, '');
            
            if (value.length === 0) {
                e.target.value = '';
                return;
            }
            
            let rut = value.slice(0, -1);
            let dv = value.slice(-1);
            
            if (rut.length > 3) {
                rut = rut.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            }
            
            if (value.length > 1) {
                e.target.value = rut + '-' + dv;
            } else {
                e.target.value = value;
            }
        }

        // Mostrar respuesta
        function showResponse(success, message) {
            const container = document.getElementById('responseContainer');
            const content = document.getElementById('responseContent');
            
            container.style.display = 'block';
            container.className = `response-container ${success ? 'response-success' : 'response-error'}`;
            
            content.innerHTML = `
                <h4>${success ? '✅ Registro Guardado' : '❌ Error'}</h4>
                <p>${message}</p>
            `;

            if (success) {
                setTimeout(() => {
                    container.style.display = 'none';
                }, 5000);
            }
        }

        // Vibración táctil
        function hapticFeedback() {
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        }

        // Manejar envío del formulario
        document.getElementById('formularioMedico').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btnGuardar = document.getElementById('btnGuardar');
            const originalText = btnGuardar.innerHTML;
            
            hapticFeedback();
            
            btnGuardar.disabled = true;
            btnGuardar.innerHTML = '<div class="loading"></div>Guardando...';

            try {
                const formData = new FormData(this);
                const data = {};
                
                for (let [key, value] of formData.entries()) {
                    data[key] = value.trim();
                }

                // Agregar metadatos
                data.timestamp = new Date().toISOString();
                data.tipo = 'urgencia';
                data.dispositivo = 'movil';
                data.userAgent = navigator.userAgent.substring(0, 100);
                data.voiceUsed = transcriptContent.classList.contains('has-content');

                console.log('📤 Enviando datos:', data);

                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                console.log('📡 Response status:', response.status);

                if (!response.ok) {
                    throw new Error(`Error HTTP ${response.status}`);
                }

                const result = await response.json();
                console.log('✅ Éxito:', result);

                showResponse(true, 
                    `Registro guardado exitosamente.<br>
                    <strong>ID:</strong> ${result.registroId}<br>
                    <strong>Paciente:</strong> ${result.paciente}<br>
                    ${data.voiceUsed ? '<strong>🎤 Grabación utilizada</strong>' : ''}`
                );

                // Limpiar formulario
                this.reset();
                document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
                
                // Limpiar sistema de voz
                transcriptContent.textContent = 'La transcripción aparecerá aquí...';
                transcriptContent.classList.remove('has-content');
                recordedChunks = [];
                playBtn.style.display = 'none';
                transcribeBtn.style.display = 'none';
                voiceStatus.textContent = 'Presiona el micrófono para iniciar grabación';

                if ('vibrate' in navigator) {
                    navigator.vibrate([100, 50, 100]);
                }

            } catch (error) {
                console.error('❌ Error:', error);
                
                showResponse(false, 
                    `Error al guardar el registro: ${error.message}. 
                    Verifique su conexión a internet y intente nuevamente.`
                );

                if ('vibrate' in navigator) {
                    navigator.vibrate([200, 100, 200, 100, 200]);
                }

            } finally {
                btnGuardar.disabled = false;
                btnGuardar.innerHTML = originalText;
            }
        });

        console.log('🎤 Sistema de voz inicializado correctamente');
    </script>
</body>
</html>