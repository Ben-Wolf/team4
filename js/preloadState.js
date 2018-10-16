// PRELOAD STATE
let preloadState = function() {

};

preloadState.prototype.preload = function() {
	// MUSIC & SOUNDS
	game.load.audio('siren', "assets/music/siren.mp3");
	// SEDANS
	game.load.image("sedan_white", "assets/sedans/sedan_white.png");
  	game.load.image("sedan_red", "assets/sedans/sedan_red.png");
	game.load.image("sedan_gray", "assets/sedans/sedan_gray.png");
	// TRUCKS
	game.load.image("truck_white", "assets/trucks/truck_white.png");
	game.load.image("truck_red", "assets/trucks/truck_red.png");
	game.load.image("truck_gray", "assets/trucks/truck_gray.png");
	game.load.image("truck_black", "assets/trucks/truck_black.png");
	// CARGO TRUCKS
	game.load.image("cargo_white", "assets/cargos/cargo_white.png");
	game.load.image("cargo_gray", "assets/cargos/cargo_gray.png");
	game.load.image("cargo_green", "assets/cargos/cargo_green.png");
	game.load.image("cargo_red", "assets/cargos/cargo_red.png");
	// Boundaries
	game.load.image("bound_h", "assets/bounds/bound_h.png");
	game.load.image("bound_v", "assets/bounds/bound_v.png");
	// Animals
	game.load.image("bird", "assets/animals/bird.png");
	// HUD
	game.load.image("dash", "assets/HUD/dash.png");
    game.load.spritesheet("steering_wheel", "assets/HUD/steering_wheel.png", 468, 468);
    game.load.spritesheet("alert","assets/HUD/alert_gauges.png",200,200);
	// Player
	//game.load.spritesheet("player", "assets/patrol_car.png", 64, 118);
	game.load.spritesheet("player", "assets/player/police.png", 64, 144);
	// Map assets
	game.load.tilemap("TileMap1", "assets/map/map1.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap("TileMap2", "assets/map/map2.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.image("newtiles", "assets/map/newtiles.png");
	game.load.image("curb", "assets/map/curb.png");
	game.load.image("map", "assets/map/newmap.png")
	game.load.spritesheet("background", "assets/map/newmap.png", 250, 541.33);
	game.load.image("victory_screen", "assets/victory_screen.png");
};

preloadState.prototype.create = function() {
    game.state.start("Title");
    // game.state.start("Game"); // Uncomment phase you're testing
};
