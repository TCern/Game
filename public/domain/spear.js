var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

// adjusts spear speed
var speedModifier = 10;

var addSpear = function() {

}

// Spear class
function Spear(damage, x, y) {
  this.x = x;
  this.y = y;

  this.enemy = null;

  this.damage = damage;

  this.spearLength = 25; // the tip of the spear
  this.spearTipLength = 20; // the distance from the shaft to the lower end of the tip (left and right)
  this.spearTipCoords = {
    x: this.x+this.spearLength,
    y: this.y
  };
  // left and right parts of the spear head
  this.leftTipCoords = {
    x: this.x + this.spearTipLength,
    y: this.y + this.spearTipLength - this.spearLength
  }
  this.rightTipCoords = {
    x: this.x+ this.spearTipLength,
    y: this.y+ this.spearLength - this.spearTipLength
  }
  this.velX = 0;
  this.velY = 0;
  this.speed = 0;
  this.thrown = false;
}
//prototype adds this function to spear object constructor
Spear.prototype.throwSpear = function() { //extra angle for buff "triple spears"
  if (!this.thrown) {
    this.speed = strength / speedModifier;
    this.velX = Math.cos(drawAngle)*this.speed;
    this.velY = Math.sin(drawAngle)*this.speed;
    this.thrown = true;
  }
}
Spear.prototype.throwRemoteSpear = function(data){
  if(!this.thrown){
    //console.log(data.velX);
    this.speed = data.speed;
    this.velX = data.velX;
    this.velY = data.velY;
    this.thrown = true;
  }
}
Spear.prototype.calcTrajectory = function() {
  if (this.y <= groundPoint && this.thrown) {
    this.velY += gravity;
    this.x += this.velX;
    this.y += this.velY;
  } else if(this.enemy !== null) {
    if(this.enemy.alive){
      //stick spear in enemy
      this.x -= this.enemy.speed; 
      this.spearTipCoords = {
        x: this.x+this.spearLength,
        y: this.y
      };
      this.leftTipCoords = {
        x: this.x + this.spearTipLength,
        y: this.y + this.spearTipLength - this.spearLength
      }
      this.rightTipCoords = {
        x: this.x+ this.spearTipLength,
        y: this.y+ this.spearLength - this.spearTipLength
      }
    } else if(this.y <= groundPoint) {
      if(this.velY < 0){
        this.velY = 0;
      }
      if(this.velX > 0){
        this.velX -= 0.15 * this.velX; //makes spear fall to the ground after enemy dies
      }
      this.velY += gravity;
      this.x += this.velX;
      this.y += this.velY;
    }
  } else {
    this.velX = 0;
    this.velY = 0;
    this.thrown = false;
    this.enemy = null;
  }
};

Spear.prototype.enemyHit = function(enemy){
  this.thrown = false;
  this.enemy = enemy;
}

Spear.prototype.getTipCoords = function(){
  return this.spearTipCoords;
}

Spear.prototype.getThrown = function(){
  return this.thrown;
}

Spear.prototype.calcSpearHead = function() {
  if (this.thrown || this.enemy !== null) {
    var angle = Math.atan2(this.velX, this.velY);
  } else if (this == localPlayer.currentSpear) {
    var angle = Math.PI/2 - drawAngle;
  } else return;

  this.spearTipCoords.x = this.x + this.spearLength*Math.sin(angle);
  this.spearTipCoords.y = this.y + this.spearLength*Math.cos(angle);
  var spearTip = {x:this.spearTipCoords.x, y:this.spearTipCoords.y}

  this.leftTipCoords.x = spearTip.x - (this.spearLength-this.spearTipLength)*Math.sin(angle-Math.PI/4);
  this.leftTipCoords.y = spearTip.y - (this.spearLength-this.spearTipLength)*Math.cos(angle-Math.PI/4);
  this.rightTipCoords.x = spearTip.x - (this.spearLength-this.spearTipLength)*Math.sin(angle+Math.PI/4);
  this.rightTipCoords.y = spearTip.y - (this.spearLength-this.spearTipLength)*Math.cos(angle+Math.PI/4);
};
Spear.prototype.drawSpear = function() {
  this.calcTrajectory();
  this.calcSpearHead();
  var spearTip = this.spearTipCoords;
  var leftTip = this.leftTipCoords;
  var rightTip = this.rightTipCoords;

  context.beginPath();
  context.moveTo(this.x, this.y);
  context.lineTo(spearTip.x, spearTip.y);

  context.moveTo(spearTip.x, spearTip.y);
  context.lineTo(leftTip.x, leftTip.y);

  context.moveTo(spearTip.x, spearTip.y);
  context.lineTo(rightTip.x, rightTip.y);

  context.strokeStyle = "black";
  context.stroke();
};