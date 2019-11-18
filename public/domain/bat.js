batImage = new Image();
batImage.src = "assets/32x32-bat-sprite.png"

function Bat(speed, height){
    this.worth = 6;
    this.damage = 1;
    this.speed = speed || Math.random() + 0.5;
    this.heigth = height || Math.floor(Math.random() * 150) + 10;
    this.self = new Enemy(groundPoint - this.heigth, 32,batImage,0, 96, 32, 32, 45, 4, 1, this.speed)
}

Bat.prototype.drawEnemy = function(){
    this.self.drawEnemy();
}

Bat.prototype.checkIfDamaged = function(){
    this.self.checkIfDamaged();
}

Bat.prototype.isAlive = function(){
    return this.self.isAlive();
}