// PRELOAD STATE
let preloadState = function() {

};

preloadState.prototype.preload = function() {
	//game.load.image("star", "assets/star.png"); // TODO: Make sure to remove unused assets
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
    game.load.spritesheet("alert","assets/alert_gauges.png",200,200);
    game.load.image("carHUD","assets/HUD.png");
    game.load.image("gear", "assets/gear_shift.png");
	// Player
	//game.load.spritesheet("player", "assets/patrol_car.png", 64, 118);
	game.load.spritesheet("player", "assets/Patrol Car Sprite with Animation.png", 64, 144);
	// Map assets
	game.load.tilemap("TileMap1", "assets/map1.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap("TileMap2", "assets/map2.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.image("newtiles", "assets/newtiles.png");
	game.load.image("curb", "assets/curb.png");
	game.load.image("map", "assets/bigmap.png")
	//sound effects
	game.load.audio("siren","assets/siren.mp3");
	//music 
	game.load.audio("identify","assets/Identify.wav");
	game.load.audio("chase","assets/Chase.wav");
	//win/lose/title screens
	game.load.image("win","assets/WinScreen.png");
	game.load.image("title","assets/TitleScreen.png");
	game.load.image("lose","assets/LoseScreen.png");
	game.load.spritesheet("playerScreen","assets/Patrol Car 1 with Animation.png",48,48);

};

preloadState.prototype.create = function() {
    game.state.start("Title");
    //game.state.start("Game"); // Uncomment phase you're testing
};
