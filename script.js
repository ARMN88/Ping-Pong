/*
           +--------------------------------------------------+
           |  ******************   TODO   ******************  |
           |                                                  |
           |  X add a player paddle                           | 
           |  X add movement and bouncing off paddle          |
           |  X add enemy paddle                              |
           |  X make predicting ai (nothing too fancy tho)    |
           |  X make center line                              |
           |  X make scoring and add scoreboard               |
           |  * add settings and pause                        |
           |  X (optional) MAKE IT MOBILE COMPATABLE          |
           |                                                  |
           +--------------------------------------------------+
*/

document.addEventListener("touchmove", function(e) {
  e.preventDefault();
});

// Settings
let sensitivity = 15;
let ballSpeed = 10;
let ballSize = 30;

// ~~~~~~~~~ Settings HTML ~~~~~~~~~~~~~~~
// sensitivity
const sensitSlider = document.querySelector("#sensitSlider");
const sensit = document.getElementById("sensit");

sensit.innerHTML = "Sensitivity: " + 20;

sensitSlider.oninput = function() {
  sensit.innerHTML = "Sensitivity: " + this.value;
  sensitivity = Number(this.value);
  player.speed = sensitivity;
};

// ballSize
const ballSizeTxt = document.querySelector("#ballSizeTxt");
const ballSizeSlider = document.querySelector("#ballSize");

ballSizeTxt.innerHTML = "Ball Size: " + ballSize;
ballSizeSlider.oninput = function() {
  ballSizeTxt.innerHTML = "Ball Size: " + this.value;
  ballSize = Number(this.value);
  ball.size = ballSize;
};

// ballSpeed
const ballSpeedTxt = document.querySelector("#ballSpeedTxt");
const ballSpeedSlider = document.querySelector("#ballSpeedSlider");
let ballDx = Math.random() * ballSpeed + 5;
let ballDy = Math.random() * ballSpeed + 5;

ballSpeedTxt.innerHTML = "Ball Speed: " + ballSpeed;
ballSpeedSlider.oninput = function() {
  ballSpeed = Number(this.value);
  ballSpeedTxt.innerHTML = "Ball Speed: " + ballSpeed;
  ballDx = Math.random() * ballSpeed + 5;
  ballDy = Math.random() * ballSpeed + 10;
};

// Two Players

// Use The Canvas and get the context
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// fit the canvas to the browser window
canvas.height = innerHeight;
canvas.width = innerWidth;
let newWidth = innerWidth;
let newHeight = innerHeight;

let pause = undefined;
let isPaused = false;

// fill the objects grey
ctx.fillStyle = "#cecece";

// make a ball object
let ball = {
  size: ballSize,
  x: innerWidth / 2 - ballSize / 2,
  y: innerHeight / 2 - ballSize / 2,
  dx: ballDx,
  dy: ballDy
};

// make a player object
let player = {
  size: {
    x: 20,
    y: 150
  },

  x: 20,
  y: innerHeight / 2 - 75,

  speed: 20,
  dy: 0,
  score: 0
};

// make a computer object
let computer = {
  size: {
    x: 20,
    y: 150
  },

  x: innerWidth - 40,
  y: innerHeight / 2 - 75,
  score: 0
};

let compSpeed = Math.ceil(Math.random());

// create a function to update the canvas for movement
function update() {
  // clear the canvas before drawing
  ctx.clearRect(0, 0, newWidth, newHeight);
  //player.speed = sensitivity;

  // enter the score
  ctx.font = "50px Arial";
  ctx.fillText(player.score + "   " + computer.score, newWidth / 2 - 50, 50);

  // draw a straight line across the screen
  ctx.strokeStyle = "cecece";
  ctx.lineWidth = 4;
  ctx.moveTo(newWidth / 2, 0);
  ctx.lineTo(newWidth / 2, newHeight);
  ctx.stroke();
  ctx.lineWidth = 1;

  // ~~~~~~~~~~~~~ BALL ~~~~~~~~~~~~~~~~~~~
  // draw the ball and update its coords according to the dx and dy (velocity)
  detectCollide();

  ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Bounce the ball when it hits the corners
  //if (ball.x <= 0 || ball.x + ball.size >= newWidth) {
  //ball.dx *= -1;
  //}
  if (ball.y <= 0 || ball.y + ball.size >= newHeight) {
    ball.dy *= -1;
  }

  // ~~~~~~~~~~~~~ PLAYER ~~~~~~~~~~~~~~~~~~~~
  // draw the player and update it

  ctx.fillRect(player.x, player.y, player.size.x, player.size.y);
  player.y += player.dy;

  // ~~~~~~~~~~~~ COMPUTER ~~~~~~~~~~~~~~~~~~~~
  // DRAW THE COMPUTER AND ALIGN HIM WITH THE BALL ON THE Y AXIS
  ctx.fillRect(computer.x, computer.y, computer.size.x, computer.size.y);
  if (ball.dx === Math.abs(ball.dx) && ball.x > newWidth / 2) {
    if (ball.y > computer.y) {
      if (ball.y !== computer.y) {
        computer.y += 5 + ballDy / compSpeed;
      }
    }
    if (ball.y < computer.y) {
      if (ball.y !== computer.y) {
        computer.y -= 5 + ballDy / compSpeed;
      }
    }
  }

  // repeat function for each frame
  pause = window.requestAnimationFrame(update);
}
//initiate the firt function to start the movement
document.load = update();

function detectCollide() {
  // detect wall collisions
  if (player.y <= 0) {
    player.y = 0;
  } else if (player.y >= canvas.height - player.size.y) {
    player.y = canvas.height - player.size.y;
  }

  // detect paddle collisions with the ball
  if (ball.x < 0 || ball.x >= newWidth) {
    if (ball.x < 0) {
      computer.score++;
    } else if (ball.x >= innerWidth) {
      player.score++;
    }
    ball.dx = 0;
    ball.dy = 0;

    ball.x = innerWidth / 2 - ballSize / 2;
    ball.y = innerHeight / 2 - ballSize / 2;

    ballDy = Math.random() * ballSpeed + 10;
    ballDx = Math.random() * ballSpeed + 5;

    setTimeout(function() {
      ball.dx = ballDx;
      ball.dy = ballDy;
    }, 1000);
  }
  if (
    ball.x <= player.x + player.size.x &&
    ball.x + ball.size >= player.x &&
    ball.y <= player.y + player.size.y &&
    ball.y + player.size.y >= player.y + 100
  ) {
    ball.dx *= -1;
    compSpeed = Math.ceil(Math.random());
  }
  if (
    ball.x <= computer.x + computer.size.x &&
    ball.x + ball.size >= computer.x &&
    ball.y <= computer.y + computer.size.y &&
    ball.y + computer.size.y >= computer.y + 100
  ) {
    ball.dx *= -1;
  }
}

// move the paddle up
function moveUp() {
  player.dy = -player.speed;
}

// move the paddle down
function moveDown() {
  player.dy = player.speed;
}

// detect key input
document.onkeydown = function(e) {
  if (e.key === "w") {
    moveUp();
  } else if (e.key === "s") {
    moveDown();
  } else if (e.key === "r") {
    location.reload();
  }
};

// detect key releases
document.onkeyup = function(e) {
  if (e.key === "w" || e.key === "s") {
    player.dy = 0;
  }
};

document.ontouchmove = function(e) {
  player.y = e.touches[0].clientY - 50;
};

const settingBtn = document.querySelector("#settings");
settingBtn.onclick = function() {
  if (!isPaused) {
    settingBtn.src =
      "https://cdn.glitch.com/72202fac-7ff8-4f4f-a7bd-c1b7a41ad338%2F81875F59-673C-4357-AA01-8BC8342899F7.png?v=1602800063138";
    window.cancelAnimationFrame(pause);
    document.getElementById("overlay").style.display = "block";
  } else if (isPaused) {
    settingBtn.src =
      "https://cdn.glitch.com/72202fac-7ff8-4f4f-a7bd-c1b7a41ad338%2F477355F3-64B9-4CBA-837D-96775016BC68.png?v=1602798429468";
    window.requestAnimationFrame(update);
    document.getElementById("overlay").style.display = "none";
    ball.dx = 0;
    ball.dy = 0;

    ball.x = innerWidth / 2 - ballSize / 2;
    ball.y = innerHeight / 2 - ballSize / 2;

    setTimeout(function() {
      ball.dx = ballDx;
      ball.dy = ballDy;
    }, 1000);
  }
  isPaused = !isPaused;
};

function off() {
  document.getElementById("overlay").style.display = "none";
}

window.onorientationchange = function() {
  setTimeout(function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }, 100);
};

window.onresize = function() {
  setTimeout(function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }, 100);
};
