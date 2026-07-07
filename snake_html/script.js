const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("scoreText");
const bestText = document.getElementById("bestText");
const difficultyText = document.getElementById("difficultyText");
const lengthText = document.getElementById("lengthText");
const menuBestText = document.getElementById("menuBestText");
const currentDifficultyText = document.getElementById("currentDifficultyText");
const finalScoreText = document.getElementById("finalScoreText");
const finalBestText = document.getElementById("finalBestText");

const menuLayer = document.getElementById("menuLayer");
const difficultyLayer = document.getElementById("difficultyLayer");
const pauseLayer = document.getElementById("pauseLayer");
const gameOverLayer = document.getElementById("gameOverLayer");
const soundBtn = document.getElementById("soundBtn");

const CELL_SIZE = 20;
const COLS = canvas.width / CELL_SIZE;
const ROWS = canvas.height / CELL_SIZE;
const NORMAL_SCORE = 10;
const SPECIAL_SCORE = 50;
const SPECIAL_LIFETIME = 5;
const SPECIAL_FLASH_TIME = 1.5;
const SPEED_UP_EVERY_SCORE = 50;
const MAX_SPEED = 16;

const difficulties = {
  // 这里控制蛇的基础速度，数字表示每秒移动多少格。
  // 想让蛇更慢就把数字调小，想更快就调大。
  "简单": { speed: 4 },
  "普通": { speed: 6 },
  "困难": { speed: 8 },
};

let state = "MENU";
let difficulty = "普通";
let baseSpeed = difficulties[difficulty].speed;
let currentSpeed = baseSpeed;
let score = 0;
let normalFoodCount = 0;
let moveTimer = 0;
let lastTime = 0;
let bestScore = readBestScore();
let soundEnabled = true;

let snake = [];
let previousSnake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let growPending = 0;
let normalFood = null;
let specialFood = null;
let specialTimer = 0;

// 使用 Web Audio 生成简单提示音，不依赖外部音频文件。
let audioContext = null;

function readBestScore() {
  const value = Number(localStorage.getItem("snake_best_score") || "0");
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function saveBestScore(value) {
  localStorage.setItem("snake_best_score", String(value));
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const map = {
      click: [420, 0.05],
      eat: [680, 0.08],
      special: [900, 0.16],
      over: [170, 0.28],
    };
    const [frequency, duration] = map[type] || map.click;
    oscillator.frequency.value = frequency;
    oscillator.type = type === "over" ? "sawtooth" : "sine";
    gain.gain.setValueAtTime(0.09, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    soundEnabled = false;
    soundBtn.textContent = "音效：关";
  }
}

function resetGame() {
  const centerX = Math.floor(COLS / 2);
  const centerY = Math.floor(ROWS / 2);
  snake = [
    { x: centerX, y: centerY },
    { x: centerX - 1, y: centerY },
    { x: centerX - 2, y: centerY },
  ];
  previousSnake = snake.map((part) => ({ ...part }));
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  growPending = 0;
  score = 0;
  normalFoodCount = 0;
  currentSpeed = baseSpeed;
  moveTimer = 0;
  specialFood = null;
  specialTimer = 0;
  normalFood = randomEmptyCell();
  updateHud();
}

function startGame() {
  playSound("click");
  resetGame();
  state = "PLAYING";
  setLayerVisibility();
}

function openMenu() {
  playSound("click");
  state = "MENU";
  setLayerVisibility();
  updateHud();
}

function openDifficulty() {
  playSound("click");
  state = "DIFFICULTY";
  setLayerVisibility();
}

function setDifficulty(name) {
  playSound("click");
  difficulty = name;
  baseSpeed = difficulties[name].speed;
  currentSpeed = baseSpeed;
  state = "MENU";
  setLayerVisibility();
  updateHud();
}

function togglePause() {
  if (state === "PLAYING") {
    state = "PAUSED";
  } else if (state === "PAUSED") {
    state = "PLAYING";
  }
  setLayerVisibility();
}

function endGame() {
  state = "GAME_OVER";
  playSound("over");
  if (score > bestScore) {
    bestScore = score;
    saveBestScore(bestScore);
  }
  finalScoreText.textContent = score;
  finalBestText.textContent = bestScore;
  setLayerVisibility();
  updateHud();
}

function updateHud() {
  scoreText.textContent = score;
  bestText.textContent = bestScore;
  menuBestText.textContent = bestScore;
  difficultyText.textContent = difficulty;
  currentDifficultyText.textContent = difficulty;
  lengthText.textContent = snake.length || 3;
  soundBtn.textContent = soundEnabled ? "音效：开" : "音效：关";
}

function setLayerVisibility() {
  menuLayer.classList.toggle("hidden", state !== "MENU");
  difficultyLayer.classList.toggle("hidden", state !== "DIFFICULTY");
  pauseLayer.classList.toggle("hidden", state !== "PAUSED");
  gameOverLayer.classList.toggle("hidden", state !== "GAME_OVER");
  updateHud();
}

function cellsEqual(a, b) {
  return a && b && a.x === b.x && a.y === b.y;
}

function isCellOnSnake(cell) {
  return snake.some((part) => cellsEqual(part, cell));
}

function randomEmptyCell() {
  const emptyCells = [];
  for (let x = 0; x < COLS; x += 1) {
    for (let y = 0; y < ROWS; y += 1) {
      const cell = { x, y };
      if (!isCellOnSnake(cell) && !cellsEqual(cell, normalFood) && !cellsEqual(cell, specialFood)) {
        emptyCells.push(cell);
      }
    }
  }
  if (emptyCells.length === 0) return null;
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function setDirection(newDirection) {
  if (newDirection.x === -direction.x && newDirection.y === -direction.y) return;
  if (newDirection.x === -nextDirection.x && newDirection.y === -nextDirection.y) return;
  nextDirection = newDirection;
}

function moveSnake() {
  // 保存移动前的位置，只用于画面平滑插值；碰撞仍然使用 snake 的真实网格坐标。
  previousSnake = snake.map((part) => ({ ...part }));
  direction = nextDirection;
  const head = snake[0];
  const newHead = { x: head.x + direction.x, y: head.y + direction.y };
  snake.unshift(newHead);
  if (growPending > 0) {
    growPending -= 1;
  } else {
    snake.pop();
  }
}

function update(deltaSeconds) {
  if (state !== "PLAYING") return;

  if (specialFood) {
    specialTimer -= deltaSeconds;
    if (specialTimer <= 0) {
      specialFood = null;
      specialTimer = 0;
    }
  }

  moveTimer += deltaSeconds;
  const moveInterval = 1 / currentSpeed;
  if (moveTimer >= moveInterval) {
    moveTimer -= moveInterval;
    moveSnake();
    checkCollisions();
  }
}

function checkCollisions() {
  const head = snake[0];
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    endGame();
    return;
  }

  for (let i = 1; i < snake.length; i += 1) {
    if (cellsEqual(head, snake[i])) {
      endGame();
      return;
    }
  }

  if (cellsEqual(head, normalFood)) {
    score += NORMAL_SCORE;
    normalFoodCount += 1;
    growPending += 1;
    normalFood = randomEmptyCell();
    playSound("eat");
    if (normalFoodCount % 5 === 0) {
      specialFood = randomEmptyCell();
      specialTimer = specialFood ? SPECIAL_LIFETIME : 0;
    }
    updateSpeed();
  }

  if (specialFood && cellsEqual(head, specialFood)) {
    score += SPECIAL_SCORE;
    growPending += 2;
    specialFood = null;
    specialTimer = 0;
    playSound("special");
    updateSpeed();
  }

  updateHud();
}

function updateSpeed() {
  const bonus = Math.floor(score / SPEED_UP_EVERY_SCORE);
  currentSpeed = Math.min(MAX_SPEED, baseSpeed + bonus);
}

function draw() {
  drawBoard();
  drawFood();
  drawSnake(getMoveProgress());
  requestAnimationFrame(loop);
}

function getMoveProgress() {
  // 视觉进度只影响绘制，不改变蛇的网格坐标和碰撞体积。
  if (state !== "PLAYING") return 1;
  const moveInterval = 1 / currentSpeed;
  return Math.min(1, moveTimer / moveInterval);
}

function drawBoard() {
  ctx.fillStyle = "#e2f1e8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#d3e5da";
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += CELL_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += CELL_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawFood() {
  if (normalFood) {
    const center = cellCenter(normalFood);
    ctx.fillStyle = "#e14646";
    ctx.beginPath();
    ctx.arc(center.x, center.y, CELL_SIZE / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ff8a8a";
    ctx.beginPath();
    ctx.arc(center.x - 3, center.y - 4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#5c7d36";
    roundRect(center.x + 2, center.y - 11, 4, 7, 2);
  }

  if (specialFood) {
    const center = cellCenter(specialFood);
    const flashing = specialTimer <= SPECIAL_FLASH_TIME && Math.floor(specialTimer * 8) % 2 === 0;
    ctx.fillStyle = flashing ? "#ffee7f" : "#f6b42d";
    ctx.strokeStyle = "#966018";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const points = [
      [0, -9], [5, -2], [9, -2], [6, 3], [8, 9],
      [0, 6], [-8, 9], [-6, 3], [-9, -2], [-5, -2],
    ];
    points.forEach(([dx, dy], index) => {
      const x = center.x + dx;
      const y = center.y + dy;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

function drawSnake(progress) {
  snake.forEach((part, index) => {
    const previousPart = previousSnake[index] || part;
    const visualX = previousPart.x + (part.x - previousPart.x) * progress;
    const visualY = previousPart.y + (part.y - previousPart.y) * progress;
    const x = visualX * CELL_SIZE + 1;
    const y = visualY * CELL_SIZE + 1;
    ctx.fillStyle = index === 0 ? "#217d58" : "#3fac7b";
    roundRect(x, y, CELL_SIZE - 2, CELL_SIZE - 2, 6);
    ctx.strokeStyle = "#175c41";
    ctx.lineWidth = 1;
    strokeRoundRect(x, y, CELL_SIZE - 2, CELL_SIZE - 2, 6);
  });
  drawEyes(progress);
}

function drawEyes(progress) {
  if (!snake.length) return;
  const head = snake[0];
  const previousHead = previousSnake[0] || head;
  const visualX = previousHead.x + (head.x - previousHead.x) * progress;
  const visualY = previousHead.y + (head.y - previousHead.y) * progress;
  const x = visualX * CELL_SIZE;
  const y = visualY * CELL_SIZE;
  const eyes = direction.x !== 0
    ? direction.x > 0 ? [[12, 6], [12, 14]] : [[8, 6], [8, 14]]
    : direction.y > 0 ? [[6, 12], [14, 12]] : [[6, 8], [14, 8]];
  eyes.forEach(([dx, dy]) => {
    ctx.fillStyle = "#f5faf7";
    ctx.beginPath();
    ctx.arc(x + dx, y + dy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#141e19";
    ctx.beginPath();
    ctx.arc(x + dx, y + dy, 1, 0, Math.PI * 2);
    ctx.fill();
  });
}

function cellCenter(cell) {
  return {
    x: cell.x * CELL_SIZE + CELL_SIZE / 2,
    y: cell.y * CELL_SIZE + CELL_SIZE / 2,
  };
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  buildRoundRectPath(x, y, width, height, radius);
  ctx.fill();
}

function strokeRoundRect(x, y, width, height, radius) {
  ctx.beginPath();
  buildRoundRectPath(x, y, width, height, radius);
  ctx.stroke();
}

function buildRoundRectPath(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, width, height, r);
    return;
  }
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function loop(timestamp) {
  const deltaSeconds = Math.min((timestamp - lastTime) / 1000 || 0, 0.1);
  lastTime = timestamp;
  update(deltaSeconds);
  draw();
}

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("restartBtn").addEventListener("click", startGame);
document.getElementById("difficultyBtn").addEventListener("click", openDifficulty);
document.getElementById("backMenuBtn").addEventListener("click", openMenu);
document.getElementById("gameOverMenuBtn").addEventListener("click", openMenu);
document.getElementById("exitBtn").addEventListener("click", () => {
  playSound("click");
  window.close();
  alert("浏览器可能会阻止关闭页面，可以直接关闭当前标签页。");
});

soundBtn.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundBtn.textContent = soundEnabled ? "音效：开" : "音效：关";
  playSound("click");
});

document.querySelectorAll(".difficulty-option").forEach((button) => {
  button.addEventListener("click", () => setDifficulty(button.dataset.difficulty));
});

document.addEventListener("keydown", (event) => {
  const keyMap = {
    ArrowUp: { x: 0, y: -1 },
    KeyW: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    KeyS: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    KeyA: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    KeyD: { x: 1, y: 0 },
  };

  if (event.code in keyMap && state === "PLAYING") {
    event.preventDefault();
    setDirection(keyMap[event.code]);
  }

  if (event.code === "Space" || event.code === "KeyP") {
    event.preventDefault();
    togglePause();
  }

  if (event.code === "Enter" && state === "MENU") {
    startGame();
  }
});

resetGame();
setLayerVisibility();
requestAnimationFrame(loop);
