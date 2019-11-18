var warSkeleImage = new Image();
warSkeleImage.src = "assets/warrior_skeleton.png"
var demonSkeleImage = new Image();
demonSkeleImage.src = "assets/demon_skeleton.png"
skeletonImage = new Image();
skeletonImage.src = "assets/skeleton.png"

function Skeleton(type, speed){
    if(type == 1){
        this.worth = 3;
        this.damage = 2;
        this.speed = speed || Math.random()/2 + 0.5;
        this.self = new Enemy(groundPoint + 48, 32,warSkeleImage,0, 96, 24, 32, 30, 3, 3, this.speed)
    } else if (type == 2){
        this.worth = 5;
        this.damage = 2;
        this.speed = speed || Math.random() + 0.9;
        this.self = new Enemy(groundPoint + 48, 32,demonSkeleImage, 0, 96, 24, 32, 26, 3, 2, this.speed)
    } else {
        this.worth = 1;
        this.damage = 2;
        this.speed = speed || Math.random() + 0.5;
        this.self = new Enemy(groundPoint + 48, 32,skeletonImage,0, 96, 24, 32, 30, 3, 1, this.speed)
    }
}

Skeleton.prototype.drawEnemy = function(){
    this.self.drawEnemy();
}

Skeleton.prototype.checkIfDamaged = function(){
    this.self.checkIfDamaged();
}

Skeleton.prototype.isAlive = function(){
    return this.self.isAlive();
}