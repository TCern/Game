var util = require("util"),					// Utility resources (logging, object inspection, etc)
	io = require("socket.io"),				// Socket.IO
	Player = require("./Player").Player;

var socket,		// Socket controller
	players,
	enemies,
	buffs;    //array of connected players
const spots = [{x:97,y:330, type:"defender"}, {x:97,y:306, type:"attacker"},{x:97,y:306, type:"defender"}];      //available spots for this game

function init(){
    players = [];
	enemies = [];
	buffs = [];
    socket = io.listen(3000);

    // Configure Socket.IO
	socket.configure(function() {
        // Only use WebSockets
        socket.set("transports", ["websocket"]);

        // Restrict log output
        socket.set("log level", 2);
    });
    setEventHandlers();
}

var setEventHandlers = function() {
	// Socket.IO
	socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
	util.log("New player has connected: "+client.id);

	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for new player message
	client.on("new player", onNewPlayer);

	client.on("player throw spear", onPlayerThrowSpear);

	client.on("new enemy sent", onPlayerSentEnemy)
};

// Socket client has disconnected
function onClientDisconnect() {
	util.log("Player has disconnected: "+this.id);

	var removePlayer = playerById(this.id);
	spots.push(removePlayer.getSpot());
	if(spots.length == 2){
		enemies = [];
		buffs = [];
	}

	// Player not found
	if (!removePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});
};

// New player has joined
function onNewPlayer(data) {
	// Create a new player
	if(spots.length > 0){
		var newPlayer = new Player(spots.pop());
		newPlayer.id = this.id;

		// Broadcast new player to connected socket clients
		this.broadcast.emit("new player", {id: newPlayer.id, spot:newPlayer.getSpot()});
		this.emit("init local player", {id: this.id, spot:newPlayer.getSpot()})
		// Send existing players to the new player
		var i, existingPlayer;
		for (i = 0; i < players.length; i++) {
			existingPlayer = players[i];
			this.emit("new player", {id: existingPlayer.id, spot:existingPlayer.getSpot()});
		};
			
		// Add new player to the players array
		players.push(newPlayer);
	} else {
		util.log("Game session full!");
	}
};

// Player has moved
function onPlayerThrowSpear(data) {
	// Find player in array
	var playerWhoFired = playerById(this.id);
	// Player not found
	if (!playerWhoFired) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Broadcast updated position to connected socket clients
	this.broadcast.emit("spear thrown", {id: this.id, variables:data});
};

function onPlayerSentEnemy(data){
	this.broadcast.emit("enemy sent", data);
}

// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < players.length; i++) {
		if (players[i].id == id)
			return players[i];
	};
	
	return false;
};

init();

