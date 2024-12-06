// game object with snake, direction, score, food, tile size, tile count, and speed
let game = {
  snake: [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ],
  direction: { x: 1, y: 0 },
  score: 0,
  food: {},
  tileSize: 20,
  tileCountX: 0,
  tileCountY: 0,
  speed: 100, // ms per update, 100 ms => 10 frames/sec
  directionChanged: false,
  highlightEnabled: false // flag to control higlights for direction
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(1000 / game.speed);
  calculateTileCounts();
  game.food = generateFood();
}

function draw() {
  drawGame();
  updateGame();
  game.directionChanged = false; // reset the flag at the start of each frame
}

function updateGame() {
  const head = {
    x: game.snake[0].x + game.direction.x,
    y: game.snake[0].y + game.direction.y,
  };
  game.snake.unshift(head);

  // check if snake eats the food
  if (head.x === game.food.x && head.y === game.food.y) {
    game.score++;
    game.food = generateFood();
  } else {
    game.snake.pop();
  }

  // check wall collision
  if (
    head.x < 0 ||
    head.x >= game.tileCountX ||
    head.y < 0 ||
    head.y >= game.tileCountY
  ) {
    resetGame();
  }

  // check self collision
  for (let i = 1; i < game.snake.length; i++) {
    if (game.snake[i].x === head.x && game.snake[i].y === head.y) {
      resetGame();
      break;
    }
  }
}

function drawGame() {
  background(0);

  // Determine the row or column to highlight based on the snake's direction
  let highlightRow = game.direction.x !== 0 ? game.snake[0].y : null;
  let highlightCol = game.direction.y !== 0 ? game.snake[0].x : null;

  // Draw field tiles
  stroke(50); // Set the color of the grid lines
  for (let x = 0; x < width; x += game.tileSize) {
    for (let y = 0; y < height; y += game.tileSize) {
      let highlight = false;
      let distance = 0;

      if (game.highlightEnabled) {
        if (highlightRow !== null && y / game.tileSize === highlightRow) {
          if (game.direction.x > 0 && x / game.tileSize > game.snake[0].x) {
            highlight = true; // Highlight tiles to the right of the snake's head
            distance = (x / game.tileSize) - game.snake[0].x;
          } else if (game.direction.x < 0 && x / game.tileSize < game.snake[0].x) {
            highlight = true; // Highlight tiles to the left of the snake's head
            distance = game.snake[0].x - (x / game.tileSize);
          }
        } else if (highlightCol !== null && x / game.tileSize === highlightCol) {
          if (game.direction.y > 0 && y / game.tileSize > game.snake[0].y) {
            highlight = true; // Highlight tiles below the snake's head
            distance = (y / game.tileSize) - game.snake[0].y;
          } else if (game.direction.y < 0 && y / game.tileSize < game.snake[0].y) {
            highlight = true; // Highlight tiles above the snake's head
            distance = game.snake[0].y - (y / game.tileSize);
          }
        }
      }

      if (highlight && distance <= 10) {
        let alpha = map(distance, 0, 10, 255, 50); // Fade out with distance
        fill(30 + (50 - 30) * (alpha / 255), 30 + (50 - 30) * (alpha / 255), 30 + (50 - 30) * (alpha / 255)); // Blend highlight color with general tile color
      } else {
        fill(30); // Set the color of the tiles
      }
      rect(x, y, game.tileSize, game.tileSize);
    }
  }

  // draw snake
  fill(0, 255, 0);
  for (let segment of game.snake) {
    rect(
      segment.x * game.tileSize,
      segment.y * game.tileSize,
      game.tileSize,
      game.tileSize
    );
  }

  // draw food
  fill(255, 0, 0);
  rect(
    game.food.x * game.tileSize,
    game.food.y * game.tileSize,
    game.tileSize,
    game.tileSize
  );

    // Draw the clickable text
    fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
    text(`Headlights: ${game.highlightEnabled ? 'ON' : 'OFF'}`, 10, 10);

  // scale text size proportionally to window size and draw it
  textSize(min(width, height) * 0.03);
  fill(255);
  textAlign(LEFT, BOTTOM);
  text("Score: " + game.score, 10, height - 10);
}

function generateFood() {
  let newFood;
  let isOnSnake;

  // generate new food item and ensure food is not on the snake
  do {
    newFood = {
      x: floor(random(game.tileCountX)),
      y: floor(random(game.tileCountY)),
    };
    isOnSnake = game.snake.some(
      (segment) => segment.x === newFood.x && segment.y === newFood.y
    );
  } while (isOnSnake);

  return newFood;
}

// reset game state
function resetGame() {
  game.snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  game.direction = { x: 1, y: 0 };
  game.score = 0;
  game.food = generateFood();
}

// handle keyboard input for directions
function keyPressed() {
  if (!game.directionChanged) {
    if (keyCode === UP_ARROW && game.direction.y === 0) {
      game.direction = { x: 0, y: -1 };
      game.directionChanged = true;
    } else if (keyCode === DOWN_ARROW && game.direction.y === 0) {
      game.direction = { x: 0, y: 1 };
      game.directionChanged = true;
    } else if (keyCode === LEFT_ARROW && game.direction.x === 0) {
      game.direction = { x: -1, y: 0 };
      game.directionChanged = true;
    } else if (keyCode === RIGHT_ARROW && game.direction.x === 0) {
      game.direction = { x: 1, y: 0 };
      game.directionChanged = true;
    }
  }
}

function mousePressed() {
  // Check if the mouse is over the "Headlights" text
  if (mouseX >= 10 && mouseX <= 150 && mouseY >= 10 && mouseY <= 30) {
    game.highlightEnabled = !game.highlightEnabled;
  }
}

// handle touch input for directions
// to support touch based input on mobile devices
function touchMoved() {
  if (!game.directionChanged) {
    let deltaX = winMouseX - pwinMouseX;
    let deltaY = winMouseY - pwinMouseY;

    if (abs(deltaX) > abs(deltaY)) {
      // Horizontal movement
      if (deltaX > 0 && game.direction.x === 0) {
        game.direction = { x: 1, y: 0 }; // Move right
        game.directionChanged = true;
      } else if (deltaX < 0 && game.direction.x === 0) {
        game.direction = { x: -1, y: 0 }; // Move left
        game.directionChanged = true;
      }
    } else {
      // Vertical movement
      if (deltaY > 0 && game.direction.y === 0) {
        game.direction = { x: 0, y: 1 }; // Move down
        game.directionChanged = true;
      } else if (deltaY < 0 && game.direction.y === 0) {
        game.direction = { x: 0, y: -1 }; // Move up
        game.directionChanged = true;
      }
    }
  }
  return false; // Prevent default behavior
}

// handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateTileCounts();
}

function calculateTileCounts() {
  game.tileCountX = floor(width / game.tileSize);
  game.tileCountY = floor(height / game.tileSize);
}
