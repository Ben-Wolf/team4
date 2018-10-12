// PRELOAD STATE
let preloadState = function() {

};

preloadState.prototype.preload = function() {
	game.load.image("star", "assets/star.png"); // TODO: Make sure to remove unused assets
    game.load.image("sedan", "assets/sedan_sprite_1.png");
	game.load.image("bound_h", "assets/bound_h.png");
	game.load.image("bound_v", "assets/bound_v.png");
    game.load.spritesheet("steering_wheel", "assets/steering_wheel.png", 468, 468);
	game.load.spritesheet("player", "assets/patrol_car.png", 64, 118);
	game.load.tilemap("TileMap", "assets/map1.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap("TileMap2", "assets/map2.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.image("newtiles", "assets/newtiles.png");
};

preloadState.prototype.create = function() {
    //game.state.start("Title");
    game.state.start("Game"); // Uncomment phase you're testing
};
