/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(spot) {
	var spot = spot,
		id;

	// Getters and setters
	var getSpot = function(){
		return spot;
	}

	// Define which variables and methods can be accessed
	return {
		getSpot: getSpot,
		id: id
	}
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;