function Button(id,x,y,sizeX,sizeY,image, imageStartX, imageStartY, imageWidth, imageHeight){
    this.id = id;
    this.x = x;
    this.y = y;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.image = image;
    this.imageStartX = imageStartX;
    this.imageStartY = imageStartY;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.enabled = true;
    this.number = 0;
}

Button.prototype.drawButton = function(){
    context.drawImage(this.image, //image
        this.imageStartX, //start x of point from image (up left)
        this.imageStartY, //start y of point from image (up left)
        this.imageWidth, //source width
        this.imageHeight, //source heigth
        this.x, 
        this.y, 
        this.sizeX, //destination (real) width
        this.sizeY) //destination (real) height
}

Button.prototype.checkIfClicked = function(mouseX, mouseY){
    if(mouseX < this.sizeX + this.x && mouseX > this.x && mouseY < this.y + this.sizeY && mouseY > this.y){
        return this.id;
    }
    return null;
}