// Game setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let score = 0;
let gameOver = false;
const shipWidth = 50;
const shipHeight = 30;
const bulletWidth = 5;
const bulletHeight = 10;
const invaderWidth = 40;
const invaderHeight = 40;

let shipX = canvas.width / 2 - shipWidth / 2;
let shipY = canvas.height - shipHeight - 10;
let shipSpeed = 5;

let bullets = [];
let invaders = [];
let invaderSpeed = 1;

// Create invaders
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 10; j++) {
        invaders.push({
            x: 70 + j * (invaderWidth + 10),
            y: 30 + i * (invaderHeight + 10),
            width: invaderWidth,
            height: invaderHeight,
            alive: true,
        });
    }
}

// Draw the ship
function drawShip() {
    ctx.fillStyle = "white";
    ctx.fillRect(shipX, shipY, shipWidth, shipHeight);
}

// Draw bullets
function drawBullets() {
    ctx.fillStyle = "yellow";
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
    });
}

// Draw invaders
function drawInvaders() {
    invaders.forEach(invader => {
        if (invader.alive) {
            ctx.fillStyle = "green";
            ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
        }
    });
}

// Move the ship
function moveShip() {
    if (leftPressed && shipX > 0) {
        shipX -= shipSpeed;
    }
    if (rightPressed && shipX + shipWidth < canvas.width) {
        shipX += shipSpeed;
    }
}

// Bullet movement
function moveBullets() {
    bullets.forEach(bullet => {
        bullet.y -= 4;
    });
    // Remove bullets that go off screen
    bullets = bullets.filter(bullet => bullet.y > 0);
}

// Check collision with invaders
function checkCollision() {
    bullets.forEach(bullet => {
        invaders.forEach(invader => {
            if (invader.alive && bullet.x < invader.x + invader.width && bullet.x + bulletWidth > invader.x &&
                bullet.y < invader.y + invader.height && bullet.y + bulletHeight > invader.y) {
                invader.alive = false;
                bullet.y = -1;  // Remove the bullet after collision
                score += 10;
            }
        });
    });
}

// Draw score
function drawScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

// Move invaders
function moveInvaders() {
    invaders.forEach(invader => {
        if (invader.alive) {
            invader.y += invaderSpeed;
            if (invader.y + invaderHeight > canvas.height) {
                gameOver = true;
            }
        }
    });
}

// Draw the game over screen
function drawGameOver() {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2);
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShip();
    drawBullets();
    drawInvaders();
    drawScore();

    if (gameOver) {
        drawGameOver();
        return;
    }

    moveShip();
    moveBullets();
    moveInvaders();
    checkCollision();

    requestAnimationFrame(gameLoop);
}

// Control the ship
let leftPressed = false;
let rightPressed = false;
document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") {
        leftPressed = true;
    }
    if (event.key === "ArrowRight") {
        rightPressed = true;
    }
    if (event.key === " ") {
        bullets.push({ x: shipX + shipWidth / 2 - bulletWidth / 2, y: shipY });
    }
});
document.addEventListener("keyup", event => {
    if (event.key === "ArrowLeft") {
        leftPressed = false;
    }
    if (event.key === "ArrowRight") {
        rightPressed = false;
    }
});

// Start the game
gameLoop();
