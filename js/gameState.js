// GAME STATE
let gameState = function(){

};

gameState.prototype.create = function() {
    // Load in background assets TODO: Actually load in background assets
	let map = game.add.tilemap("TileMap2");
	map.addTilesetImage("newtiles", "newtiles");
	let layer = map.createLayer("Tile Layer 1");

    // Create the boundaries TODO: Make this adding in the boundaries, tilesets, etc...
	this.bounds = game.add.group();
	this.bounds.enableBody = true;
	let bound_b = this.bounds.create(0, game.world.height - 600, "bound_h");
	bound_b.scale.set(4, 2);
	bound_b.body.immovable = true;
	bound_b.tint = 0x000000;
	let bound_t = this.bounds.create(0, 0, "bound_h");
	bound_t.scale.set(4, 2);
	bound_t.body.immovable = true;
	bound_t.tint = 0x000000;
	let bound_l = this.bounds.create(0, 0, "bound_v");
	bound_l.scale.set(2, 6.5);
	bound_l.body.immovable = true;
	bound_l.tint = 0x000000;
	let bound_r = this.bounds.create(1000, 0, "bound_v");
	bound_r.scale.set(2, 6.5);
	bound_r.body.immovable = true;
	bound_r.tint = 0x000000;

	// Add HUD Area
	this.hud_area = game.add.sprite(0, game.world.height - 550, "bound_h");
	this.hud_area.scale.set(5, 18);
	this.hud_area.tint = 0x000000;

    // Add "Steering wheel"
    this.wheel = game.add.sprite(210, game.world.height - 500, "steering_wheel");
    this.wheel.scale.set(1, 1);
    var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: this.wheel.width, align: "center", backgroundColor: "#ffff00" };
	this.wheel.animations.add("right", [0, 1, 2, 3], 10, false);
	this.wheel.animations.add("left", [0, 4, 5, 6], 10, false);
	this.wheel.animations.add("reset_r", [3, 2, 1, 0], 10, false);
	this.wheel.animations.add("reset_l", [6, 5, 4, 0], 10, false);

    // Create the cars TODO: Change star sprites to cars.
    this.cars = game.add.group();
    this.cars.enableBody = true;
    this.speeds = [350, 400, 550, 600];
    this.starts = [100, 440, 800];
    this.timers = [200, 120, 60];
    createCars(this.cars, this.starts, this.speeds, this.timers, 1);

    // Create the player TODO: Change Murph to car
    this.player = game.add.sprite(200, game.world.height - 950, "player");
    this.player.scale.set(3, 3);
	game.physics.arcade.enable(this.player);
	this.player.body.collideWorldBounds = true;

    // Distance to perp TODO: Implement more, based on speed
    this.d2p = 5000;
    this.d2p_text = game.add.text(0, 1900, this.d2p + "m from Perp", style);

	// Speed modifiers
	this.d2p_since_last_crash = this.d2p;
	this.speed_multiplier = 1;
	this.spm_text = game.add.text(0, 2100, this.speed_multiplier + " = Multiplier!", style);

    // Capture mouse input
    game.input.mouse.capture = true;
};

gameState.prototype.update = function() {

    // Collisions
    game.physics.arcade.collide(this.bounds, this.player);
    game.physics.arcade.collide(this.cars, this.cars);

    // Overlaps
	game.physics.arcade.overlap(this.bounds, this.cars, this.removeCar, null, this);
    game.physics.arcade.overlap(this.player, this.cars, this.crash, null, this);

	// Apply speed multipliers
	this.speed_multiplier = Math.floor((this.d2p_since_last_crash - this.d2p) / 500) + 1;
	this.spm_text.setText(this.speed_multiplier + " = Multiplier!");
	this.d2p -= (0.5 * this.speed_multiplier);

    // TODO: Create and implement win state
    if (this.d2p <= 0) {
        this.d2p_text.setText("You win...");
    } else {
        this.d2p_text.setText(Math.round(this.d2p) + "m from Perp");
    }

    // Procedural Car Generation
    createCars(this.cars, this.starts, this.speeds, this.timers, this.speed_multiplier);

    // Turn wheel
    this.player.body.velocity.x = 0;
    if (game.input.activePointer.leftButton.isDown) {
        if (inBounds(game.input.x, game.input.y, this.wheel)) {
            if (game.input.x < this.wheel.x + this.wheel.width / 2) {
                this.turnLeft();
            } else {
                this.turnRight();
            }
        }
    } else {
		if (this.wheel.animations.frame > 0 && this.wheel.animations.frame < 4){
			this.wheel.animations.play("reset_r");
		} else if (this.wheel.animations.frame > 3) {
			this.wheel.animations.play("reset_l");
		}
	}
};

// Remove cars that reach the lower bounds
gameState.prototype.removeCar = function(boundary, car) {
    car.kill();
};

// Player crash
gameState.prototype.crash = function(player, car) {
	this.d2p += 500;
	this.d2p_since_last_crash = this.d2p;
	this.speed_multiplier = 1;
    this.cars.forEach(function (c) { c.kill(); });
};

gameState.prototype.turnRight = function() {
	if (this.wheel.animations.frame !== 3) {
		this.wheel.animations.play("right");
	}
    this.player.body.velocity.x = 335 * this.speed_multiplier;
};

gameState.prototype.turnLeft = function() {
	if (this.wheel.animations.frame !== 6) {
		this.wheel.animations.play("left");
	}
    this.player.body.velocity.x = -335 * this.speed_multiplier;
};

function inBounds(xIn, yIn, b) {
    return xIn > b.x && xIn < (b.x + b.width) &&
           yIn > b.y && yIn < (b.y + b.height);
};

function createCars(cars, starts, speeds, timers, speed_m) {
    for (let i = 0; i < 3; ++i) {
        if (timers[i] === 0) {
            timers[i] = 250/speed_m;
            let car = cars.create(starts[i], 65, "sedan");
            car.body.velocity.y = speeds[getRandomInt(4)] * speed_m;
            car.scale.set(3,3);
        } else {
            timers[i]--;
        }
    }
};

// Bless JS Hoisting
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
