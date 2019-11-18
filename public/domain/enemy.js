var enemies = [];

var groundPoint = canvas.height - canvas.height/4;

function Enemy(y, height, sprite, spriteBeginX, spriteBeginY, spriteWidth, spriteHeigth, maxTicks, numberOfFrames, lives, speed){
    this.y = y;
    this.height = height;
    this.x = canvas.width;

    this.speed = speed;
    console.log(this.speed);
    this.lives = lives;
    this.alive = true;

    this.sprite = sprite; //image of enemy
    this.spriteWidth = spriteWidth;
    this.spriteHeigth = spriteHeigth;

    this.frameX = spriteBeginX;
    this.frameY = spriteBeginY;
    this.ticks = 0;
    this.maxTicks = maxTicks;

    this.numberOfFrames = numberOfFrames; //in the sprite's animation
    this.cycles = this.maxTicks / (this.numberOfFrames - 1);
}

Enemy.prototype.checkIfDamaged = function(){
    for(spear in localPlayer.spears){
        if(localPlayer.spears[spear].getThrown() 
        && (localPlayer.spears[spear].getTipCoords().x < this.x+this.spriteWidth && localPlayer.spears[spear].getTipCoords().x > this.x)
        && (localPlayer.spears[spear].getTipCoords().y > this.y - this.spriteHeigth - this.height && localPlayer.spears[spear].getTipCoords().y < this.y - this.height)){
            this.lives -= localPlayer.spears[spear].damage;
            localPlayer.spears[spear].enemyHit(this);
            if(this.lives <= 0)
                this.alive = false;
        }

    }
    for(player in remotePlayers){
        for(spear in remotePlayers[player].spears){
            if(remotePlayers[player].spears[spear].getThrown() 
            && (remotePlayers[player].spears[spear].getTipCoords().x < this.x+this.spriteWidth && remotePlayers[player].spears[spear].getTipCoords().x > this.x)
            && (remotePlayers[player].spears[spear].getTipCoords().y > this.y - this.spriteHeigth - this.height && remotePlayers[player].spears[spear].getTipCoords().y < this.y - this.height)){
                this.lives -= remotePlayers[player].spears[spear].damage;
                remotePlayers[player].spears[spear].enemyHit(this);
                if(this.lives <= 0)
                    this.alive = false;
            }

        }
    }
}

Enemy.prototype.isAlive = function(){
    return this.alive;
}

Enemy.prototype.calcPos = function(){
    this.x -= this.speed;
}

Enemy.prototype.drawEnemy = function(){
    this.calcPos();

    if(this.ticks < this.maxTicks){
        if(this.ticks % this.cycles == 0){
            this.frameX += this.spriteWidth;
        }
        this.ticks++;
        if(this.ticks == this.maxTicks)
            this.ticks *= 2;
    } else {
        if(this.ticks % this.cycles == 0){
            this.frameX -= this.spriteWidth;
        }
        this.ticks--;
        if(this.ticks == this.maxTicks)
            this.ticks = 0;
    }
    context.drawImage(this.sprite, //image
                      this.frameX, //start x of point from image (up left)
                      this.frameY, //start y of point from image (up left)
                      this.spriteWidth, //source width
                      this.spriteHeigth, //source heigth
                      this.x, 
                      this.y - this.spriteHeigth - this.height, 
                      this.spriteWidth, //dest width
                      this.spriteHeigth) //dest height
    //console.log(this.x);
}