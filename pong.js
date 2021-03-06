var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
  window.setTimeout(callback, 1000 / 60)
};
var canvas = document.createElement("canvas");

var width = 400;
var height = 500;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 250);
var scorePlayer = 0;
var scoreComputer = 0;
var difficulty = 1;
var keysDown = {};
var mySound = new sound('Mp3/pingpongPlayer.mp3');
var myBoo = new sound('Mp3/boo.mp3');
var myHooray = new sound('Mp3/hooray.mp3');
var myFail = new sound('Mp3/Failure.mp3');
var myCong = new sound('Mp3/Congratulations.mp3');

var render = function () {
context.fillStyle = "#33ff33";
context.fillRect(0, 0, width, height);
context.beginPath();
context.moveTo(400, 250);
context.lineTo(0, 250);
context.stroke();
player.render();
computer.render();
ball.render();
};

var update = function () {
player.update();
computer.update(ball);
ball.update(player.paddle, computer.paddle);
};

var step = function () {
update();
render();
animate(step);
};

function playerScore(scorePlayer) {
  document.getElementById("playerSc").innerHTML = scorePlayer;
}

function computerScore(scoreComputer) {
  document.getElementById("computerSc").innerHTML = scoreComputer;
}


function Paddle(x, y, width, height) {
this.x = x;
this.y = y;
this.width = width;
this.height = height;
this.x_speed = 0;
this.y_speed = 0;
}

Paddle.prototype.render = function () {
context.fillStyle = "#000066";
context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function (x, y) {
this.x += x;
this.y += y;
this.x_speed = x;
this.y_speed = y;
if (this.x < 0) {
  this.x = 0;
  this.x_speed = 0;
} else if (this.x + this.width > 400) {
  this.x = 400 - this.width;
  this.x_speed = 0;
}
};

function gameOver(x) {
  document.getElementById("demo").innerHTML = "The " + x + " is the winner. Press reset to play again";
}

function reset() {
  location.reload();
  return false;
}


function difficultyE() {
  difficulty = 1;
}

function difficultyN() {
  difficulty = 2;
}

function difficultyH() {
  difficulty = 3;
}

function Computer() {
this.paddle = new Paddle(175, 10, 45, 10);
}

Computer.prototype.render = function () {
this.paddle.render();
};

Computer.prototype.update = function (ball) {
var xPos = ball.x;
var diff = -((this.paddle.x + (this.paddle.width / 2)) - xPos);
if (difficulty == 1){
  if (diff < 0 && diff < -4) {
    diff = -2;
  } else if (diff > 0 && diff > 4) {
    diff = 2;
  }
} else if (difficulty == 2) {
  if (diff < 0 && diff < -8) {
    diff = -2;
  } else if (diff > 0 && diff > 8) {
    diff = 2;
  }
} else {
  if (diff < 0 && diff < -12) {
    diff = -1;
  } else if (diff > 0 && diff > 12) {
    diff = 1;
  }
}

this.paddle.move(diff, 0);
if (this.paddle.x < 0) {
  this.paddle.x = 0;
} else if (this.paddle.x + this.paddle.width > 400) {
  this.paddle.x = 400 - this.paddle.width;
}
};

function Player() {
this.paddle = new Paddle(270, 480, 45, 10);
}

Player.prototype.render = function () {
this.paddle.render();
};

Player.prototype.update = function () {
for (var key in keysDown) {
  var value = Number(key);
  if (value == 37) {
      this.paddle.move(-4, 0);
  } else if (value == 39) {
      this.paddle.move(4, 0);
  } else {
      this.paddle.move(0, 0);
  }
}
};

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = Math.floor(Math.random()*5) + 1;
  this.x_speed *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
  this.y_speed = Math.floor(Math.random()*5) + 1;
  this.y_speed *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
}

Ball.prototype.render = function () {
context.beginPath();
context.arc(this.x, this.y, 5, 2 * Math.PI, false);
context.fillStyle = "#000000";
context.fill();
};

Ball.prototype.update = function (paddle1, paddle2) {
this.x += this.x_speed;
this.y += this.y_speed;
var top_x = this.x - 9;
var top_y = this.y - 5;
var bottom_x = this.x + 5;
var bottom_y = this.y + 9;

if (this.x - 5 < 0) {
  this.x = 5;
  this.x_speed = -this.x_speed;
 
} else if (this.x + 5 > 400) {
  this.x = 390;
  this.x_speed = -this.x_speed;

}

if (this.y < 0) {
  this.x_speed = Math.floor(Math.random()*5) + 1;
  this.x_speed *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
  this.y_speed = Math.floor(Math.random()*5) + 1;
  this.y_speed *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
  this.x = 300;
  this.y = 350;
  scorePlayer++;
  playerScore(scorePlayer);
  if (scorePlayer > 6) {
    myCong.play();
    this.x_speed = 0;
    this.y_speed = 0;
    gameOver('User');
  } else{
    myHooray.play();
  }
} else if(this.y > 500){
  this.x_speed = Math.floor(Math.random()*5) + 1;
  this.x_speed *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
  this.y_speed = Math.floor(Math.random()*5) + 1;
  this.y_speed *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
  this.x = 200;
  this.y = 250;
  scoreComputer++;
  computerScore(scoreComputer);
  if (scoreComputer > 6) {
    myFail.play();
    this.x_speed = 0;
    this.y_speed = 0;
    gameOver('Computer');
  } else{
    myBoo.play();
  }
}

if (top_y > 300) {
  if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
      this.y_speed = -3;
      this.x_speed += (paddle1.x_speed / 2);
      this.y += this.y_speed;
      mySound.play();
  }
} else {
  if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
      this.y_speed = 3;
      this.x_speed += (paddle2.x_speed / 2);
      this.y += this.y_speed;
      mySound.play();
  }
}
};

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

document.body.appendChild(canvas);
animate(step);

window.addEventListener("keydown", function (event) {
keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
delete keysDown[event.keyCode];
});
