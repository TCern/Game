//CONSTANTS

const heartImg = new Image();
heartImg.src = "assets/heart.png"
const castleImg = new Image();
castleImg.src = "assets/castle.png"
// VARIABLES
var socket;
const spots = {one: {x:97,y:330}, two:{x:97,y:306}};
var drawAngle = 0;
var mouseDown = false;
var mouseUp = false;
var startX, startY; 
var mouseX = 0, mouseY = 0;

var strength = 0;
var gravity = 0.1;
var readied = false;
var spearThrown = false;
var score = 0;
var spearDamage = 1;
var activeBuffs = [];
var buttons = [];
var playerLives = 20;

var socket, localPlayer, remotePlayers;

//all events
var setEventHandlers = function(){
    window.addEventListener("mousedown", mouseDownHandler, false);
    window.addEventListener("mouseup", mouseUpHandler, false);
    window.addEventListener("mousemove", mouseMoveHandler, false);

    socket.on("connect", onSocketConnected);

	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);

	// New player message received
	socket.on("new player", onNewPlayer);

	// Player move message received
    socket.on("spear thrown", onReceiveThrownSpear);

	// Player removed message received
    socket.on("remove player", onRemovePlayer);

    socket.on("init local player", onInitLocalPlayer);

    socket.on("enemy sent", onReceiveEnemy);
}
// HANDLERS

function onSocketConnected() {
	console.log("Connected to socket server");

	// Send local player data to the game server
	socket.emit("new player", {spot: localPlayer.getSpot()});
};

function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

function onSendEnemy(enemy){
    socket.emit("new enemy sent", enemy);
}

function onReceiveEnemy(enemy){
    if(enemy.type == "bat"){
        enemies.push(new Bat(enemy.speed, enemy.height));
    } else if (enemy.type == "warskele"){
        enemies.push(new Skeleton(1,enemy.speed))
    } else if (enemy.type == "demonskele"){
        enemies.push(new Skeleton(2,enemy.speed))
    } else if (enemy.type == "skele"){
        enemies.push(new Skeleton(3,enemy.speed))
    }
}

function onNewPlayer(data) {
	console.log("New player connected: "+data.id);

	// Initialise the new player
	var newPlayer = new Player(data.spot);
	newPlayer.id = data.id;

	// Add new player to the remote players array
	remotePlayers.push(newPlayer);
};

function onInitLocalPlayer(data){
    //console.log(data.id);
    localPlayer = new Player(data.spot);
    localPlayer.id = data.id;
    if(localPlayer.type == "attacker"){
        var button = new Button(1,canvas.width - 75, 50, 50, 50, warSkeleImage, 0, 96, 24, 32);
        buttons.push(button);
        button = new Button(2,canvas.width - 130, 50, 50, 50, demonSkeleImage, 0, 96, 24, 32);
        buttons.push(button);
        button = new Button(3,canvas.width - 75, 110, 50, 50, skeletonImage, 0, 96, 24, 32);
        buttons.push(button);
        button = new Button(4,canvas.width - 130, 110, 50, 50, batImage, 0, 96, 24, 32);
        buttons.push(button);
    }
}

function onThrowSpear(){
    var speed = strength / speedModifier;
    var velX = Math.cos(drawAngle)*speed;
    var velY = Math.sin(drawAngle)*speed;
    var data = {speed:speed,velX:velX,velY:velY};
    socket.emit("player throw spear", data);
}

function onReceiveThrownSpear(data){
    var remotePlayer = playerById(data.id);
    remotePlayer.throwRemoteSpear(data.variables);
}

function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);

	// Player not found
	if (!removePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Remove player from array
	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

function mouseDownHandler(e){
    mouseDown = true;
    mouseUp = false;
    startX = e.clientX;
    startY = e.clientY;
}

function mouseMoveHandler(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function mouseUpHandler(){
    mouseDown = false;
    mouseUp = true;
    checkButtons();
}

//UTILS

function convertToRadians(degree) {
    return degree*(Math.PI/180);
}

function setMatrix(x,y,scale,rotate){ 
    var xAx = Math.cos(rotate) * scale;  // the x axis x
    var xAy = Math.sin(rotate) * scale;  // the x axis y
    context.setTransform(xAx, xAy, -xAy, xAx, x, y);
}

function calculateAngle(){
    var tan = (mouseY - startY)/(mouseX - startX);
    drawAngle = Math.atan(tan);
}

function drawStrength() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    strength = Math.round(Math.sqrt((mouseX - startX)*(mouseX-startX)+(mouseY-startY)*(mouseY-startY))/3);
    if(strength > 100)
        strength = 100;
    context.fillText(strength, mouseX, mouseY);
  }

//GAME FUNCTIONS

//DRAWING
var drawLine = function(){
    calculateAngle();

    context.beginPath();
    context.moveTo(mouseX, mouseY);
    context.lineTo(startX, startY);
  
    context.strokeStyle = "black";
    context.stroke();
}

var drawScore = function(){
    context.font = "16px Arial";
    context.fillStyle = "#000000";
    context.fillText("Score: "+score, 8, 20);
}

var drawLives = function() {
    context.font = "16px Arial";
    context.fillStyle = "#000000";
    context.fillText(playerLives, canvas.width - 45, 20);
    context.drawImage(heartImg, 0, 0, 50, 50, canvas.width - 67, 0, 25 ,25);
}

var drawGameOver = function(){
    context.font = "100px Arial";
    context.fillStyle = "#000000";
    context.fillText("GAME OVER", 100 ,200);
}

var drawButtons = function(){
    for(var button in buttons){
        buttons[button].drawButton();
    }
}

var drawScene = function() {
    // increased groundPoint so spears stick where they should in the ground
    var ground = groundPoint + 15;
    // sky
    context.fillStyle="rgba(0,0,200,0.2)";
    context.fillRect(0,0,canvas.width,ground);
    // ground
    context.beginPath();
    context.moveTo(0, ground);
    context.lineTo(canvas.width, ground);
    context.strokeStyle="rgba(0,100,50,0.6)";
    context.stroke();
    context.fillStyle="rgba(0,200,100,0.6)";
    context.fillRect(0,ground,canvas.width,canvas.height);
    //castle
    context.drawImage(castleImg, 0, 0, 500, 425, 0, groundPoint - 205, 200 ,225);
    if(readied){
        drawLine();
        drawStrength();
    }
}


//LOGIC
var isReadied = function(){
    if(mouseDown)
        readied = true;
}

var isSpearThrown = function() {
    if (readied && mouseUp) {
      readied = false;
      spearThrown = true;
    }
}

var checkEnemies = function(){
    for(enemy in enemies){
        enemies[enemy].checkIfDamaged();
        if(!enemies[enemy].isAlive()){
            score += enemies[enemy].worth;
            enemies.splice(enemy, 1);
        } else {
            if(enemies[enemy].self.x <= 100){
                playerLives -= enemies[enemy].damage;
                enemies[enemy].self.alive = false;
                enemies.splice(enemy, 1);
            }
        }
    }
}

var checkBuffs = function(){
    for(buff in buffs){
        buffs[buff].checkIfHit();
        if(!buffs[buff].alive){
            buffs.splice(buff,1);
        }
    }
}
var checkButtons = function(){
    for(var button in buttons){
        var id = buttons[button].checkIfClicked(mouseX, mouseY);
        if(id !== null){
            var enemy, data;
            if(id == 1){
                enemy = new Skeleton(1);
                data = {type:"warskele", speed:enemy.speed}
            } else if (id == 2){
                enemy = new Skeleton(2);
                data = {type:"demonskele", speed:enemy.speed}
            } else if (id == 3){
                enemy = new Skeleton(3);
                data = {type:"skele", speed:enemy.speed}
            } else if (id == 4){
                enemy = new Bat();
                data = {type:"bat", speed:enemy.speed, height: enemy.heigth}
            }

            onSendEnemy(data);
            enemies.push(enemy);
        }
    }
}

var update = function(){
    if(playerLives > 0){
        if(localPlayer.type === "defender"){
            isReadied();
            isSpearThrown();
        }
        checkEnemies();
        checkBuffs();
        if(spearThrown){
            localPlayer.throwSpear();
            onThrowSpear();
            if(activeBuffs.includes(0)){
                drawAngle += convertToRadians(5)
                localPlayer.throwSpear();
                onThrowSpear();
                drawAngle += convertToRadians(5)
                localPlayer.throwSpear();
                onThrowSpear();
            }
            spearThrown = false;
        }
        context.clearRect(0,0,canvas.width,canvas.height);
    } else {
        drawGameOver();
    }
}

var render = function(){
    drawScene();
    if(playerLives > 0){
        for(i=0; i < buffs.length; i++){
            buffs[i].drawBuff();
        }
        for(i=0; i < localPlayer.spears.length; i++){
            localPlayer.spears[i].drawSpear();
        }
        for(player in remotePlayers){
            for(i=0; i < remotePlayers[player].spears.length; i++){
                remotePlayers[player].spears[i].drawSpear();
            }
        }
        for(i=0; i < enemies.length; i++){
            enemies[i].drawEnemy();
        }
    }
    drawButtons();
    drawScore();
    drawLives();
}

//MAIN BODY
var init = function(){
    localPlayer = new Player({x:0,y:0,type:"attacker"});
    socket = io.connect("http://localhost", {port: 3000, transports: ["websocket"]});
    remotePlayers = [];
    setEventHandlers();
}
var main = function() {  
    update();
    render();
    requestAnimationFrame(main);
}

window.setInterval(function(){
    if(remotePlayers.length > 0){
        let type = Math.floor(Math.random()*2)
        buffs.push(new Buff(type));
    }
}, 10000)


function playerById(id) {
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id)
			return remotePlayers[i];
	};
	
	return false;
};

init();
main();