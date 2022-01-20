var canvas = document.querySelector('#myCanvas');
var ctx = canvas.getContext('2d');
var x = canvas.width / 2;
var y = canvas.height - 32;
var dx = 2;
var dy = -2;
var widthCanvas = canvas.width;
var heightCanvas = canvas.height;
var ballRadius = 15;
var paddleHeight = 17;
var paddleWidth = 120;
var paddleX = (widthCanvas - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 8;
var brickWidth = 90;
var brickHeight = 25;
var brickPadding = 17;
var brickOffsetTop = 60;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;
var level = 1;
var maxLevel = 5;
var time = 10;

var bricks = [];

function createBricks() {
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {
      x: (c * (brickWidth + brickPadding) + brickOffsetLeft),
      y: (r * (brickHeight + brickPadding) + brickOffsetTop),
      status: 1
    };
  }
}
}

LIFE_IMG.onload = function() {
  ctx.drawImage(LIFE_IMG, widthCanvas-130, 15, 30, 30);
}

heart_img.onload = function() {
  ctx.drawImage(heart_img, 30, 15, 30, 30);
}

flag_img.onload = function() {
  ctx.drawImage(flag_img, 430, 15, 30, 30);
}

createBricks();

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        ctx.beginPath();
        ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function levelUp() {
  if(level > maxLevel) {
    alert("Game Over. You won");
    return ;
  }
  level++;
  score = 0;
  lives = 3;
  brickRowCount++;
  createBricks();
  time--;
  alert('you win');
  clearInterval(interval);
  reset();
  draw();
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score += 100;
          if (score == brickColumnCount * brickRowCount * 100) {
            levelUp();
            // alert('you win');
            // document.location.reload();
            // clearInterval(interval);
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.drawImage(LIFE_IMG, widthCanvas-130, 15, 30, 30);
  ctx.font = '30px Germania One';
  ctx.fillStyle = 'black';
  ctx.fillText(score, widthCanvas - 90, 40);
}

function drawLives() {
  ctx.drawImage(heart_img, 30, 15, 30, 30);
  ctx.font = '30px Germania One';
  ctx.fillStyle = 'black';
  ctx.fillText(lives, 70, 40);
}

function drawLevel() {
  ctx.drawImage(flag_img, 430, 15, 30, 30);
  ctx.font = '30px Germania One';
  ctx.fillStyle = 'black';
  ctx.fillText( level, 470, 40);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

function reset() {
  x = widthCanvas / 2;
  y = heightCanvas - 32;
  dx = 2;
  dy = -2;
  paddleX = (canvas.width - paddleWidth) / 2;
  clearInterval(interval);
}

function draw() {
  ctx.clearRect(0, 0, widthCanvas, heightCanvas);
  x = x + dx;
  y = y + dy;
  if (x + dx + ballRadius > widthCanvas || x + dx - ballRadius < 0) {
    dx = -dx;
  } else if (y + dy - ballRadius < 0) {
    dy = -dy;
  } else if (y + dy + ballRadius > heightCanvas) {
    if (x > paddleX && x < paddleWidth + paddleX) {
      dy = -dy;
    } else {
      if (y + dy > heightCanvas) {
        lives--;
        if (!lives) {
          alert('game over');
          document.location.reload();
          clearInterval(interval);
        } else {
          reset();
        }
      }
    }
  }
  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > widthCanvas) {
      paddleX = widthCanvas - paddleWidth;
    }
  }
  if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
  drawScore();
  drawLives();
  drawBricks();
  drawLevel();
  drawPaddle();
  drawBall();
  collisionDetection();
}
drawScore();
drawLives();
drawLevel();
drawBricks();
drawPaddle();
drawBall();

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, heightCanvas - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = 'blue';
  ctx.fill();
  ctx.closePath();
}

document.addEventListener('keydown', keydownHandler);
document.addEventListener('keyup', keyupHandler);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keydownHandler(event) {
  if (event.key == 'Right' || event.key == 'ArrowRight') {
    rightPressed = true;
  } else if (event.key == 'Left' || event.key == 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyupHandler(event) {
  if (event.key == 'Right' || event.key == 'ArrowRight') {
    rightPressed = false;
  } else if (event.key == 'Left' || event.key == 'ArrowLeft') {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  console.log(relativeX);
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
}

var interval;
document.body.addEventListener('click', function() {
  interval = setInterval(draw, time);
})
