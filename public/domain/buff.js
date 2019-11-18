var buffs = [];

tripleSpearsImage = new Image();
tripleSpearsImage.src = "assets/spears.png"
heartImg = new Image();
heartImg.src = "assets/heart.png"

function Buff(type){
    this.type = type;
    this.y = 0;
    this.x = Math.floor(Math.random()*(canvas.width - 300)) + 250
    if(type == 0){ //type 0 is triple shot
        this.alive = true;
        this.duration = 15000
        this.image = tripleSpearsImage;
        this.size = 20;
        this.spriteWidth = 118;
        this.spriteHeight = 156;
    } else if(type == 1){
        this.alive = true;
        this.image = heartImg;
        this.size = 20;
        this.spriteWidth = 48
        this.spriteHeight = 48;
    }
}

Buff.prototype.calcTrajectory = function(){
    if(this.y < groundPoint + 50){
        this.y += 1.75;
    } else {
        this.alive = false;
    }
}

Buff.prototype.drawBuff = function() {
    this.calcTrajectory();
    context.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.size ,this.size);
};

Buff.prototype.checkIfHit = function() {
    for(spear in localPlayer.spears){
        if(localPlayer.spears[spear].getThrown() 
        && (localPlayer.spears[spear].getTipCoords().x < this.x+this.size && localPlayer.spears[spear].getTipCoords().x > this.x)
        && (localPlayer.spears[spear].getTipCoords().y < this.y + this.size && localPlayer.spears[spear].getTipCoords().y > this.y)){
            this.alive = false;
            this.activate();
        }

    }
    for(player in remotePlayers){
        for(spear in remotePlayers[player].spears){
            if(remotePlayers[player].spears[spear].getThrown() 
            && (remotePlayers[player].spears[spear].getTipCoords().x < this.x+this.size && remotePlayers[player].spears[spear].getTipCoords().x > this.x)
            && (remotePlayers[player].spears[spear].getTipCoords().y < this.y + this.size && remotePlayers[player].spears[spear].getTipCoords().y > this.y)){
                this.alive = false;
                this.activate();
            }

        }
    }
}

Buff.prototype.activate = function(){
    if(this.type == 0){ 
        activeBuffs.unshift(0);
        window.setTimeout(function(){
            activeBuffs.pop();
        }, this.duration)
    } else if(this.type == 1){
        playerLives++;
    }
}