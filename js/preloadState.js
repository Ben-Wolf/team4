// PRELOAD STATE
let preloadState = function() {

};

preloadState.prototype.preload = function() {
	game.load.image("star", "assets/star.png"); // TODO: Make sure to remove unused assets
	// SEDANS
	game.load.image("sedan", "assets/sedan_white.png");
	game.load.image("sedan_white", "assets/sedan_white.png");
  game.load.image("sedan_red", "assets/sedan_red.png");
	game.load.image("sedan_gray", "assets/sedan_gray.png");
	// TRUCKS
	game.load.image("truck_white", "assets/truck_white.png");
	game.load.image("truck_red", "assets/truck_red.png");
	game.load.image("truck_gray", "assets/truck_gray.png");
	game.load.image("truck_black", "assets/truck_black.png");
	// CARGO TRUCKS
	game.load.image("cargo_white", "assets/cargo_white.png");
	game.load.image("cargo_gray", "assets/cargo_gray.png");
	game.load.image("cargo_green", "assets/cargo_green.png");
	game.load.image("cargo_red", "assets/cargo_red.png");
	// Boundaries
	game.load.image("bird", "assets/bird.png");
	game.load.image("bound_h", "assets/bound_h.png");
	game.load.image("bound_v", "assets/bound_v.png");
	// HUD
    game.load.spritesheet("steering_wheel", "assets/steering_wheel.png", 468, 468);
	// Player
	game.load.spritesheet("player", "assets/patrol_car.png", 64, 118);
	// Map assets
	game.load.tilemap("TileMap1", "assets/map1.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap("TileMap2", "assets/map2.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.image("newtiles", "assets/newtiles.png");
};

preloadState.prototype.create = function() {
     game.state.start("Title");
    //game.state.start("Game"); // Uncomment phase you're testing
};
