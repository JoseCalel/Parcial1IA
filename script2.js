function startVoiceRecognition() {
    var recognition = new webkitSpeechRecognition(); // Inicializa el objeto de reconocimiento de voz
    recognition.lang = 'es-ES'; // Establece el idioma (español)
    
    // Maneja los resultados del reconocimiento de voz
    recognition.onresult = function(event) {
        var result = event.results[0][0].transcript; // Obtiene el texto reconocido
        document.getElementById('questionInput').value = result; // Coloca el texto reconocido en el campo de pregunta
        sendQuestion(); // Envía la pregunta automáticamente
    };

    // Inicia el reconocimiento de voz
    recognition.start();
}
