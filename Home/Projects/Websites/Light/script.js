const canvas = document.getElementById('light');
const video = document.getElementById('video');
const ctx = canvas.getContext('2d');
const btn_a = document.getElementById('activateBtn');
const btn_d = document.getElementById('deactivateBtn');
const fileInput = document.getElementById('videoFile');
const fileName = document.getElementById('fileName');
const player = document.getElementById('player');
const controls = document.getElementById('controls');
const loading = document.getElementById('loading');

let animationId = null;
let isAmbientActive = false;

// Funzione per aggiornare le dimensioni del canvas
function updateCanvasSize() {
    canvas.width = video.videoWidth || video.offsetWidth;
    canvas.height = video.videoHeight || video.offsetHeight;
}

// Funzione per disegnare l'effetto ambient light
function drawAmbientLight() {
    if (!isAmbientActive || video.paused || video.ended) return;
    
    updateCanvasSize();
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    if (isAmbientActive) {
        animationId = requestAnimationFrame(drawAmbientLight);
    }
}

// Gestione del caricamento file
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Verifica che sia un file video
    if (!file.type.startsWith('video/')) {
        alert('Per favore seleziona un file video valido.');
        return;
    }

    loading.classList.add('active');
    fileName.textContent = `📹 ${file.name}`;

    // Crea URL del file
    const videoURL = URL.createObjectURL(file);
    video.src = videoURL;

    // Quando il video è caricato
    video.addEventListener('loadeddata', function() {
        loading.classList.remove('active');
        player.classList.add('active');
        controls.classList.add('active');
        updateCanvasSize();
    }, { once: true });

    video.addEventListener('error', function() {
        loading.classList.remove('active');
        alert('Errore nel caricamento del video. Prova con un altro file.');
    }, { once: true });
});

// Attiva ambient light
btn_a.addEventListener('click', () => {
    isAmbientActive = true;
    drawAmbientLight();
    btn_a.style.display = "none";
    btn_d.style.display = "block";
});

// Disattiva ambient light
btn_d.addEventListener('click', () => {
    isAmbientActive = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    btn_d.style.display = "none";
    btn_a.style.display = "block";
});

// Aggiorna dimensioni quando il video cambia dimensioni
video.addEventListener('loadedmetadata', updateCanvasSize);
video.addEventListener('resize', updateCanvasSize);

// Pause ambient light quando il video è in pausa
video.addEventListener('pause', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
});

// Riprendi ambient light quando il video riprende
video.addEventListener('play', () => {
    if (isAmbientActive) {
        drawAmbientLight();
    }
});

// Pulizia quando la pagina viene chiusa
window.addEventListener('beforeunload', () => {
    if (video.src && video.src.startsWith('blob:')) {
        URL.revokeObjectURL(video.src);
    }
});
