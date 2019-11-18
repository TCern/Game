function Player(spot){
    this.x = spot.x;
    this.y = spot.y;
    this.type = spot.type;
    this.id = null;
    this.spot = spot;
    this.spears = [];
    this.currentSpear;
    if(this.type == "defender"){
        this.addSpear();
    }
}

Player.prototype.addSpear = function(){
    this.spears.unshift(new Spear(spearDamage, this.x, this.y)); // unshift adds to FRONT of spears array
    this.currentSpear = this.spears[0];
}

Player.prototype.throwSpear = function(){
    this.currentSpear.throwSpear();
    this.addSpear();
    if(this.spears.length > 50){
        this.spears.pop();
    }
}
Player.prototype.throwRemoteSpear = function(data){
    this.currentSpear.throwRemoteSpear(data);
    this.addSpear();
    if(this.spears.length > 50){
        this.spears.pop();
    }
}

Player.prototype.getSpot = function(){
    return this.spot;
}