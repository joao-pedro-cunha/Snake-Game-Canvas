let snake, food;
let grid = 20;
let cols, rows;
let score = 0;
let speed = 6;
let running = false;

function setup() {
  let canvas = createCanvas(420, 420);
  canvas.parent("game-container");
  frameRate(speed);

  cols = width / grid;
  rows = height / grid;

  snake = new Snake();
  spawnFood();
}

function draw() {
  if (!running) return;

  background(15, 15, 30);
  drawGrid();

  snake.update();
  snake.show();

  drawFood();

  if (snake.eat(food)) {
    score++;
    speed += 0.3; 
    frameRate(speed);
    spawnFood();
  }

  drawUI();

  if (snake.dead()) {
    endGame();
  }
}

function startGame() {
  document.getElementById("menu").classList.add("hidden");
  running = true;
  loop();
}

function restartGame() {
  score = 0;
  speed = 6;
  snake = new Snake();
  spawnFood();

  document.getElementById("game-over").classList.add("hidden");
  running = true;
  loop();
}

function endGame() {
  running = false;
  noLoop();

  document.getElementById("final-score").innerText = "Score: " + score;
  document.getElementById("game-over").classList.remove("hidden");
}

function keyPressed() {
  if (key === 'w' || key === 'W') snake.dir(0, -1);
  if (key === 's' || key === 'S') snake.dir(0, 1);
  if (key === 'a' || key === 'A') snake.dir(-1, 0);
  if (key === 'd' || key === 'D') snake.dir(1, 0);
}

function spawnFood() {
  food = createVector(
    floor(random(cols)) * grid,
    floor(random(rows)) * grid
  );
}

function drawGrid() {
  stroke(40);
  for (let x = 0; x < width; x += grid) line(x, 0, x, height);
  for (let y = 0; y < height; y += grid) line(0, y, width, y);
}

function drawFood() {
  noStroke();
  fill(255, 80, 80);
  rect(food.x, food.y, grid, grid, 6);
}

function drawUI() {
  fill(255);
  textSize(16);
  text("Score: " + score, 10, 20);
}

class Snake {
  constructor() {
    this.body = [createVector(200, 200)];
    this.xdir = 1;
    this.ydir = 0;
    this.grow = false;
  }

  dir(x, y) {
    if (this.xdir === -x && this.ydir === -y) return;
    this.xdir = x;
    this.ydir = y;
  }

  update() {
    let head = this.body[this.body.length - 1].copy();
    head.x += this.xdir * grid;
    head.y += this.ydir * grid;

    this.body.push(head);

    if (!this.grow) {
      this.body.shift();
    } else {
      this.grow = false;
    }
  }

  eat(pos) {
    let head = this.body[this.body.length - 1];
    if (head.x === pos.x && head.y === pos.y) {
      this.grow = true;
      return true;
    }
    return false;
  }

  dead() {
    let head = this.body[this.body.length - 1];

    if (head.x < 0 || head.y < 0 || head.x >= width || head.y >= height) {
      return true;
    }

    for (let i = 0; i < this.body.length - 1; i++) {
      let part = this.body[i];
      if (head.x === part.x && head.y === part.y) {
        return true;
      }
    }

    return false;
  }

  show() {
    noStroke();

    for (let i = 0; i < this.body.length; i++) {
      if (i === this.body.length - 1) {
        fill(0, 255, 150);
      } else {
        fill(0, 200, 100);
      }
      rect(this.body[i].x, this.body[i].y, grid, grid, 6);
    }
  }
}