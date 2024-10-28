let socket;
let figureX = 200;
let figureY = 200;
let currentShape = 0; // 0: elipse, 1: rectángulo, 2: triángulo
let currentColor = 0; // 0 a 4 para cinco colores

// Array de colores
const colors = [
    [255, 0, 0],   // Rojo
    [0, 255, 0],   // Verde
    [0, 0, 255],   // Azul
    [255, 255, 0], // Amarillo
    [255, 0, 255]  // Magenta
];

function setup() {
    createCanvas(400, 400);
    background(220);

    // Conexión con el servidor
    let socketUrl = 'https://supreme-space-eureka-x9wpv75jjpf6gpv-3000.app.github.dev/';
    socket = io(socketUrl);

    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('message', (data) => {
        console.log(`Received message: ${data}`);
        let parsedData = JSON.parse(data);
        if (parsedData.type === 'touch') {
            figureX = parsedData.x;
            figureY = parsedData.y;
        }
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

    // Establece el color actual
    fill(colors[currentColor][0], colors[currentColor][1], colors[currentColor][2]);

    // Cambia el dibujo según el estado actual
    if (currentShape === 0) {
        ellipse(figureX, figureY, 50, 50);
    } else if (currentShape === 1) {
        rect(figureX - 25, figureY - 25, 50, 50);
    } else if (currentShape === 2) {
        triangle(
            figureX, figureY - 30,
            figureX - 25, figureY + 20,
            figureX + 25, figureY + 20
        );
    }
}

// Cambiar de figura al presionar la tecla "a"
function keyPressed() {
    if (key === 'a' || key === 'A') {
        currentShape = (currentShape + 1) % 3; // Rota entre 0, 1 y 2 para las figuras
    } else if (key === 'b' || key === 'B') {
        currentColor = (currentColor + 1) % colors.length; // Rota entre 0 y 4 para los colores
    }
}
