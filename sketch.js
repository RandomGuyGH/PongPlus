let ball;
let barPlayer;
let barOpponent;
let orbs = [];
let extraBalls = [];

let ballSpeed = 5;
let barWidth = 5;
let ballRadius = 10;

let playerPoints = 0;
let opponentPoints = 0;

function setup() {
  createCanvas(800, 400);
  ball = new Ball();
  barPlayer = new Bar(30, 'player');
  barOpponent = new Bar(width - 40, 'opponent');
  textAlign(CENTER, CENTER);
  textSize(32);
  textFont('Arial');

  setInterval(() => {
    if (orbs.length === 0) orbs.push(new Orb());
  }, 10000);
}

function draw() {
  background(0);

  fill(255);
  rect(0, 0, width, barWidth);
  rect(0, height - barWidth, width, barWidth);

  fill(0, 102, 255);
  text(playerPoints, width * 0.25, 30);
  fill(255, 50, 50);
  text(opponentPoints, width * 0.75, 30);

  if (barPlayer.pinkActive && millis() > barPlayer.timePinkStop) {
    barPlayer.pinkActive = false;
    barOpponent.colorInstant = color(255, 50, 50);
  }
  if (barOpponent.pinkActive && millis() > barOpponent.timePinkStop) {
    barOpponent.pinkActive = false;
    barPlayer.colorInstant = color(0, 102, 255);
  }


  for (let i = orbs.length - 1; i >= 0; i--) {
    orbs[i].update(ball);
    orbs[i].show();
    if (ball.collidedOnOrb(orbs[i])) {
      let bar = ball.lastTouch === 'player' ? barPlayer : barOpponent;
      if (orbs[i].type === 'cyan') {
        bar.activateBarry();
      } else if (orbs[i].type === 'orange') {
        bar.powerUltraSpeed = true;
        bar.colorInstant = color(255, 150, 0);
      } else if (orbs[i].type === 'purple') {
        extraBalls.push(
          new ExtraBall(orbs[i].x, orbs[i].y, random(-PI / 3, -PI / 6)),
          new ExtraBall(orbs[i].x, orbs[i].y, random(PI / 6, PI / 3))
        );
      } else if (orbs[i].type === 'gray') {
        ball.startBlink(4000);
      } else if (orbs[i].type === 'pink') {
        bar.pinkActive = true;
        bar.timePinkStop = millis() + 5000;
        if (barOpponent.pinkActive){
          barPlayer.colorInstant = color(255, 0, 255);
        } else {
          barOpponent.colorInstant = color(255, 0, 255);
        }
      }
      orbs.splice(i, 1);
    }
  }

  barPlayer.show();
  barOpponent.show();
  barPlayer.update();
  barOpponent.update();
//  barOpponent.updateAI(ball); Computer Mode
  barPlayer.updateBarry();
  barOpponent.updateBarry();

  ball.update();
  ball.show();
  ball.collisionCheck(barPlayer);
  ball.collisionCheck(barOpponent);

  for (let i = extraBalls.length - 1; i >= 0; i--) {
    let extra = extraBalls[i];
    extra.update();
    extra.collisionCheck(barPlayer);
    extra.collisionCheck(barOpponent);
    extra.collidedWithMainBall(ball);
    extra.show();
    if (extra.expired() || extra.checkGoal()) {
      extraBalls.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (barOpponent.pinkActive == false) {
    if (key === 'w' || key === 'W') {
      barPlayer.YSpeed = -7;
    } else if (key === 's' || key === 'S') {
      barPlayer.YSpeed = 7;
    }
  } else {
    if (key === 'w' || key === 'W') {
      barPlayer.YSpeed = 7;
    } else if (key === 's' || key === 'S') {
      barPlayer.YSpeed = -7;
    }
  }
  

  if (barPlayer.pinkActive == false) {
    if (key === 'i' || key === 'I') {
      barOpponent.YSpeed = -7;
    } else if (key === 'k' || key === 'K') {
      barOpponent.YSpeed = 7;
    }
  } else {
    if (key === 'i' || key === 'I') {
      barOpponent.YSpeed = 7;
    } else if (key === 'k' || key === 'K') {
      barOpponent.YSpeed = -7;
    }
  }
}

function keyReleased() {
  if (key === 'w' || key === 'W' || key === 's' || key === 'S') {
    barPlayer.YSpeed = 0;
  }
  if (key === 'i' || key === 'I' || key === 'k' || key === 'K') {
    barOpponent.YSpeed = 0;
  }
}



class Bar {
  constructor(x, type) {
    this.x = x;
    this.y = height / 2;
    this.length = 10;
    this.hieght = 80;
    this.YSpeed = 0;
    this.type = type;
    this.hasBarry = false;
    this.barry = {
      y: 0,
      hieght: 40,
      length: 6,
      YSpeed: 3,
      timeEnd: 0
    };
    this.powerUltraSpeed = false;
    this.pinkActive = false;
    this.timePinkStop = 0;
    this.colorInstant = type === 'player' ? color(0, 102, 255) : color(255, 50, 50);
  }

  update() {
    this.y += this.YSpeed;
    this.y = constrain(this.y, barWidth, height - this.hieght - barWidth);
  }

//  updateAI(ball) { remove comments for computer mode (and comment on the controls for player 2)
//  if (ball.XSpeed < 0) return;

  // Computer does not detect blinking ball
//  if (ball.blink && !ball.visible) return;

//  let barCenter = this.y + this.hieght / 2;
//  let diference = ball.y - barCenter;
//  let AIMaxSpeed = 4; 

//  if (abs(diference) > AIMaxSpeed) {
//    this.y += AIMaxSpeed * (diference > 0 ? 1 : -1);
 // } else {
 //   this.y += diference;
 // }

//  this.y = constrain(this.y, barWidth, height - this.hieght - barWidth);
//}




  show() {
    fill(this.colorInstant);
    rect(this.x, this.y, this.length, this.hieght);
    if (this.hasBarry) {
      fill(0, 255, 255);
      let distance = 15;
      let xBar = this.x + (this.type === 'player' ? this.length + distance : -this.barry.length - distance);
      rect(xBar, this.barry.y, this.barry.length, this.barry.hieght);
    }
  }

  updateBarry() {
    if (!this.hasBarry) return;
    this.barry.y += this.barry.YSpeed;
    if (this.barry.y < barWidth || this.barry.y + this.barry.hieght > height - barWidth) {
      this.barry.YSpeed *= -1;
    }
    if (millis() > this.barry.timeEnd) {
      this.hasBarry = false;
    }
  }

  activateBarry() {
    this.hasBarry = true;
    this.barry.y = this.y + this.hieght / 2 - this.barry.hieght / 2;
    this.barry.YSpeed = 3;
    this.barry.timeEnd = millis() + 10000;
  }
}

class Ball {
  constructor() {
    this.goalSide = null;
    this.lastTouch = null;
    this.restart();
    this.blink = false;
    this.timeEndBlink = 0;
    this.blinkInterval = 600; // blinking in milisseconds
    this.lastBlink = 0;
    this.visible = true;
  }
  startBlink(duration) {
    this.blink = true;
    this.timeEndBlink = millis() + duration;
    this.lastBlink = millis();
    this.visible = true;
  }
  restart() {
    this.x = width / 2;
    this.y = height / 2;
    let angle = random(-PI / 4, PI / 4);
    this.XSpeed = (this.goalSide === 'left' ? 1 : this.goalSide === 'right' ? -1 : random() < 0.5 ? 1 : -1) * ballSpeed * cos(angle);
    this.YSpeed = ballSpeed * sin(angle);
    this.accelFactor = 1.001;
    this.maxSpeed = 12;
    this.lastTouch = null;
  }

  update() {
    this.XSpeed *= this.accelFactor;
    this.YSpeed *= this.accelFactor;
    this.XSpeed = constrain(this.XSpeed, -this.maxSpeed, this.maxSpeed);
    this.YSpeed = constrain(this.YSpeed, -this.maxSpeed, this.maxSpeed);
    this.x += this.XSpeed;
    this.y += this.YSpeed;
    if (this.y - ballRadius < barWidth || this.y + ballRadius > height - barWidth) {
      this.YSpeed *= -1;
    }
    if (this.x < 0) {
      this.goalSide = 'left';
      opponentPoints++;
      this.restart();
    } else if (this.x > width) {
      this.goalSide = 'right';
      playerPoints++;
      this.restart();
    }
    if (this.blink) {
      let now = millis();
      if (now - this.lastBlink > this.blinkInterval) {
        this.visible = !this.visible;
        this.lastBlink = now;
      }
      if (now > this.timeEndBlink) {
        this.blink = false;
        this.visible = true;
      }
    }
  }

  collisionCheck(bar) {
    if (this.x - ballRadius < bar.x + bar.length && this.x + ballRadius > bar.x && this.y > bar.y && this.y < bar.y + bar.hieght) {
      this.XSpeed *= -1;
      this.x = bar.x + (bar.x < width / 2 ? bar.length + ballRadius : -ballRadius);
      if (bar.powerUltraSpeed) {
        let angle = random(-PI / 4, PI / 4);
        let xDirection = bar.type === 'player' ? 1 : -1;
        let newSpeed = ballSpeed * 5;
        this.XSpeed = newSpeed * cos(angle) * xDirection;
        this.YSpeed = newSpeed * sin(angle);
        bar.powerUltraSpeed = false;
        bar.colorInstant = bar.type === 'player' ? color(0, 102, 255) : color(255, 50, 50);
      }
      this.lastTouch = bar.type;
    }

    if (bar.hasBarry) {
      let distance = 15;
      let xBar = bar.x + (bar.type === 'player' ? bar.length + distance : -bar.barry.length - distance);
      let yBar = bar.barry.y;
      let wBar = bar.barry.length;
      let hBar = bar.barry.hieght;
      if (this.x - ballRadius < xBar + wBar && this.x + ballRadius > xBar && this.y > yBar && this.y < yBar + hBar) {
        this.XSpeed *= -1;
        this.x = bar.type === 'player' ? xBar + wBar + ballRadius : xBar - ballRadius;
        this.lastTouch = bar.type;
      }
    }
  }

  collidedOnOrb(orb) {
    let d = dist(this.x, this.y, orb.x, orb.y);
    return d < ballRadius + orb.radius;
  }

   show() {
    if (!this.visible) return;
    if (this.blink) {
      fill(128); // gray while blinking
    } else {
      if (this.lastTouch === 'player') fill(0, 102, 255);
      else if (this.lastTouch === 'opponent') fill(255, 50, 50);
      else fill(255);
    }
    ellipse(this.x, this.y, ballRadius * 2);
  }
}

class ExtraBall {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.speed = 6;
    this.radius = ballRadius;
    this.XSpeed = this.speed * cos(direction);
    this.YSpeed = this.speed * sin(direction);
    this.disappearTime = millis() + 7000;
  }

  update() {
    this.x += this.XSpeed;
    this.y += this.YSpeed;
    if (this.y - this.radius < barWidth || this.y + this.radius > height - barWidth) {
      this.YSpeed *= -1;
    }
  }

  collisionCheck(bar) {
    if (this.x - this.radius < bar.x + bar.length && this.x + this.radius > bar.x && this.y > bar.y && this.y < bar.y + bar.hieght) {
      this.XSpeed *= -1;
    }
  }

  collidedWithMainBall(ball) {
    let d = dist(this.x, this.y, ball.x, ball.y);
    if (d < this.radius + ballRadius) {
        let nx = (this.x - ball.x) / d;
        let ny = (this.y - ball.y) / d;
        let dot = this.XSpeed * nx + this.YSpeed * ny;
        this.XSpeed -= 2 * dot * nx;
        this.YSpeed -= 2 * dot * ny;
        return true;
    }
    return false;
}

  show() {
    fill(75, 0, 130);
    ellipse(this.x, this.y, this.radius * 2);
  }

  expired() {
    return millis() > this.disappearTime;
  }
  checkGoal() {
    if (this.x < 0) {
        opponentPoints++;
        return true;
    } else if (this.x > width) {
        playerPoints++;
        return true;
    }
    return false;
}
}

class Orb {
  constructor() {
    this.x = random(width * 0.3, width * 0.7);
    this.y = random(height * 0.3, height * 0.7);
    this.radius = 12;
    this.speed = 1.2;
    let orbTypes = ['cyan', 'pink', 'orange', 'gray', 'purple'];
    this.type = random(orbTypes);
  }

  update(bola) {
    let dx = ball.x - this.x;
    let dy = ball.y - this.y;
    let distance = sqrt(dx * dx + dy * dy);
    if (distance > 1) {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
      this.y = constrain(this.y, barWidth + this.radius, height - barWidth - this.radius);
      this.x = constrain(this.x, this.radius, width - this.radius);
    }
  }

  show() {
    if (this.type === 'cyan') fill(0, 255, 255);
    else if (this.type === 'orange') fill(255, 150, 0);
    else if (this.type === 'purple') fill(75, 0, 130);
    else if (this.type === 'gray') fill(128);
    else if (this.type === 'pink') fill(255, 0, 255);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2);
  }
}

