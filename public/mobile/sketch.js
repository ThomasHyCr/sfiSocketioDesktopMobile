let socket;
const port = 3000;
let lastTouchX = null; 
let lastTouchY = null; 
const threshold = 5;
let showMessage = false;
let messageTimer = 0;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(220);

    // Conectar al servidor de Socket.IO
    let socketUrl = 'https://supreme-space-eureka-x9wpv75jjpf6gpv-3000.app.github.dev/';
    socket = io(socketUrl);

    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('message', (data) => {
        console.log(`Received message: ${data}`);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

    socket.on('connect_error', (error) => {
        console.error('Socket.IO error:', error);
    });
}

function draw() {
    background(220);

    // Dibujar el margen rojo de 30 píxeles
    stroke(255, 0, 0);
    strokeWeight(2);
    noFill();
    rect(30, 30, width - 60, height - 60);

    // Texto de instrucciones
    fill(0, 255, 0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(32);
    text('Touch to move the circle', width / 2, height / 2);

    // Mostrar el mensaje si se toca fuera de los márgenes
    if (showMessage) {
        fill(255, 0, 0);
        textSize(24);
        text("Touch dentro de los márgenes", width / 2, height - 40);

        // Contar el tiempo de visualización
        if (millis() > messageTimer + 1000) {
            showMessage = false;
        }
    }
}

function touchMoved() {
    if (socket && socket.connected) { 
        let dx = abs(mouseX - lastTouchX);
        let dy = abs(mouseY - lastTouchY);

        // Verificar si el toque está dentro de los márgenes
        if (mouseX < 30 || mouseX > width - 30 || mouseY < 30 || mouseY > height - 30) {
            showMessage = true;
            messageTimer = millis(); // Iniciar temporizador para mostrar mensaje
        } else if (dx > threshold || dy > threshold) {
            let touchData = {
                type: 'touch',
                x: mouseX,
                y: mouseY
            };
            socket.emit('Limite superado!', JSON.stringify(touchData));

            lastTouchX = mouseX;
            lastTouchY = mouseY;
        }
    }
    return false;
}

// Redimensiona el canvas cuando se cambia el tamaño de la ventana
function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}
