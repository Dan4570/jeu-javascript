const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
  x: canvas.width / 2 - 15,
  y: canvas.height - 50,
  width: 30,
  height: 30,
  speed: 5,
  dx: 0,
};

let obstacles = [];
let obstacleSpeed = 3;
let obstacleFrequency = 1500;  // Temps en ms entre la création d'obstacles
let lastObstacleTime = 0;
let score = 0;
let gameOver = false;

// Dessine le joueur
function drawPlayer() {
  ctx.fillStyle = "green";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Dessine les obstacles
function drawObstacles() {
  ctx.fillStyle = "red";
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

// Déplace le joueur
function movePlayer() {
  player.x += player.dx;

  // Empêcher le joueur de sortir du canvas
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Crée un obstacle à des intervalles réguliers
function createObstacle() {
  const width = Math.random() * (100 - 30) + 30;
  const x = Math.random() * (canvas.width - width);
  obstacles.push({ x, y: -30, width, height: 30 });
}

// Déplace les obstacles
function moveObstacles() {
  obstacles.forEach(obstacle => {
    obstacle.y += obstacleSpeed;
  });

  // Supprime les obstacles qui sont sortis du canvas
  obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);
}

// Vérifie les collisions entre le joueur et les obstacles
function checkCollision() {
  obstacles.forEach(obstacle => {
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.height + player.y > obstacle.y
    ) {
      gameOver = true;
    }
  });
}

// Affiche le score
function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 25);
}

// Met à jour le jeu
function update(timestamp) {
  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 4, canvas.height / 2);
    return;
  }

  // Efface le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Déplace et dessine le joueur
  movePlayer();
  drawPlayer();

  // Crée un obstacle toutes les obstacleFrequency millisecondes
  if (timestamp - lastObstacleTime > obstacleFrequency) {
    createObstacle();
    lastObstacleTime = timestamp;
    score++;
  }

  // Déplace et dessine les obstacles
  moveObstacles();
  drawObstacles();

  // Vérifie les collisions
  checkCollision();

  // Affiche le score
  drawScore();

  // Met à jour l'animation à chaque frame
  requestAnimationFrame(update);
}

// Gère les touches du clavier pour déplacer le joueur
function keyDown(e) {
  if (e.key === "ArrowRight") {
    player.dx = player.speed;
  } else if (e.key === "ArrowLeft") {
    player.dx = -player.speed;
  }
}

function keyUp(e) {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    player.dx = 0;
  }
}

// Ajoute les écouteurs d'événements pour les touches du clavier
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Lance le jeu
requestAnimationFrame(update);
