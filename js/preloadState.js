// PRELOAD STATE
let preloadState = function() {

};

preloadState.prototype.preload = function() {
    game.load.image("star", "assets/star.png");
	game.load.image("bound_h", "assets/bound_h.png");
	game.load.image("bound_v", "assets/bound_v.png");
    game.load.image("steering_wheel", "assets/bound_h.png");
    game.load.image("sedan", "assets/Sedan Sprite 1.png");
	game.load.spritesheet("murph", "assets/character.png", 32, 48);
};

preloadState.prototype.create = function() {
    game.state.start("Title");
};
