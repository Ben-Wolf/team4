// GAME STATE
let gameState = function(){

};

gameState.prototype.create = function() {
    // Load in background assets TODO: Actually load in background assets
    game.stage.backgroundColor = '#943021';

    // Create the boundaries TODO: Make this adding in the boundaries, tilesets, etc...
	this.bounds = game.add.group();
	this.bounds.enableBody = true;
	let bound_b = this.bounds.create(0, game.world.height - 100, "bound_h");
	bound_b.scale.set(2,2);
	bound_b.body.immovable = true;
    bound_b.tint = 0xff00ff;
	let bound_t = this.bounds.create(0, 0, "bound_h");
    bound_t.scale.set(2,2);
	bound_t.body.immovable = true;
    bound_t.tint = 0xff00ff;
    let bound_l = this.bounds.create(100, 0, "bound_v");
    bound_l.scale.set(2,2);
    bound_l.body.immovable = true;
    bound_l.tint = 0xff00ff;
    let bound_r = this.bounds.create(450, 0, "bound_v");
    bound_r.scale.set(2,2);
    bound_r.body.immovable = true;
    bound_r.tint = 0xff00ff;

    // Add "Steering wheel"
    this.wheel = game.add.sprite(210, game.world.height - 35, "steering_wheel");
    this.wheel.scale.set(.5, 1);
    var style = { font: "12px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: this.wheel.width, align: "center", backgroundColor: "#ffff00" };
    var text = game.add.text(0, 0, "Steering Wheel", style);
    text.anchor.set(0.5);
    text.x = Math.floor(this.wheel.x + this.wheel.width / 2);
    text.y = Math.floor(this.wheel.y + this.wheel.height / 2);

    // Create the cars TODO: Change star sprites to cars.
    this.cars = game.add.group();
    this.cars.enableBody = true;
    this.speeds = [135, 150, 165, 180];
    this.starts = [220, 295, 370];
    this.timers = [200, 120, 60];
    createCars(this.cars, this.starts, this.speeds, this.timers);

    // Create the player TODO: Change Murph to car
    this.player = game.add.sprite(200, game.world.height - 150, "murph");
	game.physics.arcade.enable(this.player);
	this.player.body.collideWorldBounds = true;

    // Distance to perp TODO: Implement more
    this.d2p = 5000;
    this.d2p_text = game.add.text(600, 300, this.d2p + "m from Perp", style);

    // Capture mouse input
    game.input.mouse.capture = true;
};

gameState.prototype.update = function() {

    // Collisions
    game.physics.arcade.collide(this.bounds, this.player);

    // Overlaps
	game.physics.arcade.overlap(this.bounds, this.cars, this.removeCar, null, this);
    game.physics.arcade.overlap(this.player, this.cars, this.crash, null, this);

    // Update distance to perp text
    this.d2p--;
    if (this.d2p <= 0) {
        this.d2p_text.setText("You win...");
    } else
    this.d2p_text.setText(this.d2p + "m from Perp");

    // Procedural Car Generation
    createCars(this.cars, this.starts, this.speeds, this.timers);

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
    }
};

// Remove cars that reach the lower bounds
gameState.prototype.removeCar = function(boundary, car) {
    car.kill();
};

// Player crash
gameState.prototype.crash = function(player, car) {
    this.d2p += 500;
    this.cars.forEach(function (c) { c.kill(); });
};

gameState.prototype.turnRight = function() {
    this.player.body.velocity.x = 175;
};

gameState.prototype.turnLeft = function() {
    this.player.body.velocity.x = -175;
};

function inBounds(xIn, yIn, b) {
    return xIn > b.x && xIn < (b.x + b.width) &&
           yIn > b.y && yIn < (b.y + b.height);
};

function createCars(cars, starts, speeds, timers) {
    for (let i = 0; i < 3; ++i) {
        if (timers[i] == 0) {
            timers[i] = 200;
            let car = cars.create(starts[i], 65, "star");
            car.body.velocity.y = speeds[getRandomInt(4)];
        } else {
            timers[i]--;
        }
    }
};

// Bless JS Hoisting
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
