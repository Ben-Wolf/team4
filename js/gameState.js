// GAME STATE
let gameState = function(){

};

gameState.prototype.create = function() {
    // Create the boundaries
	this.bounds = game.add.group();
	this.bounds.enableBody = true;
	this.bound_b = this.bounds.create(0, game.world.height - 650, "bound_h");
	this.bound_b.scale.set(4, 2);
	this.bound_b.body.immovable = true;
	this.bound_b.tint = 0x000000;
	let bound_t = this.bounds.create(0, 0, "bound_h");
	bound_t.scale.set(4, 2);
	bound_t.body.immovable = true;
	bound_t.tint = 0x000000;
	let bound_l = this.bounds.create(120, 0, "bound_v");
	bound_l.scale.set(2, 6.5);
	bound_l.body.immovable = true;
	bound_l.tint = 0x000000;
	let bound_r = this.bounds.create(950, 0, "bound_v");
	bound_r.scale.set(2, 6.5);
	bound_r.body.immovable = true;
	bound_r.tint = 0x000000;

	this.map = game.add.sprite(0, 0, "map");
	this.map.animations.add("right", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
		 							  13, 14, 15 ,16 ,17 ,18 ,19, 20, 21, 22,
									  23, 24, 25, 26, 27, 28, 29, 30], 20, true);
	this.map.animations.play("right");
	//this.map.animations.paused = false;

	// Add HUD Area
    // Add "Steering wheel"
	this.dash = game.add.sprite(0, 0, "dash");
    this.wheel = game.add.sprite(63, game.world.height - 390, "steering_wheel");
    var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: this.wheel.width, align: "center" };
	this.wheel.animations.add("right", [0, 1, 2, 3], 10, false);
	this.wheel.animations.add("left", [0, 4, 5, 6], 10, false);
	this.wheel.animations.add("reset_r", [3, 2, 1, 0], 10, false);
	this.wheel.animations.add("reset_l", [6, 5, 4, 0], 10, false);
	// console.log(this.wheel.animations);

    // Create the cars
	this.perp = null;
    this.cars = game.add.group();
	//this.numCars = 0;
	this.numDeleted = 0;
	this.hasCrashed = false;
    this.cars.enableBody = true;
    this.speeds = [350, 400, 550, 600];
    this.starts = [190, 350, 500, 660, 830];
    this.timers = [210, 160, 90, 120, 270];
	this.sedans = ["sedan_gray", "sedan_white"];
	this.trucks = ["truck_red", "truck_gray", "truck_black", "truck_white"];
	this.cargos = ["cargo_red", "cargo_gray", "cargo_green", "cargo_white"];
    createCars(this.cars, this.starts, this.speeds, this.timers, 1,
				this.sedans, this.trucks, this.cargos);

	//Create the animals
	this.animals = game.add.group();
	this.animals.enableBody = true;
	this.spawningBird = false;
	this.birdSpawnTimer = 100;

    // Create the player
    this.player = game.add.sprite(200, game.world.height - 950, "player");
    this.player.scale.set(1.5, 1.5);
	this.player.animations.add("chase", [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
	this.player.animations.play("chase");
	game.physics.arcade.enable(this.player);
	this.player.body.collideWorldBounds = true;

    // Distance to perp
    this.perpBool = false;
	this.d2p = 4000;
    this.d2p_text = game.add.text(145, 1910, this.d2p + "m", style);

	// Speed modifiers
	this.d2p_since_last_crash = this.d2p;
	this.speed_multiplier = 1;
	this.spm_text = game.add.text(335, 1910, "Gear = " + this.speed_multiplier, style);

    // Capture mouse input
    game.input.mouse.capture = true;
    //music for the stage TODO: stop music when switching to the end screen
    this.music=game.add.audio("chase");
    this.music.play("", 0, 1, true);
	this.haltAnimation = 0;
};

gameState.prototype.update = function() {
    // Collisions
    game.physics.arcade.collide(this.bounds, this.player);
    //game.physics.arcade.collide(this.cars, this.cars);
	//game.physics.arcade.collide(this.animals, this.player);

    // Overlaps
	game.physics.arcade.overlap(this.player, this.perp, this.win, null, this);
	game.physics.arcade.overlap(this.bounds, this.cars, this.removeCar, null, this);
	game.physics.arcade.overlap(this.dash, this.cars, this.removeCar, null, this);
	// game.physics.arcade.overlap(this.bounds, this.animals, this.removeAnimal, null, this);
    game.physics.arcade.overlap(this.player, this.cars, this.crash, null, this);
	game.physics.arcade.overlap(this.player, this.animals, this.crashAnimal, null, this);
	game.physics.arcade.overlap(this.bound_b, this.animals, this.removeAnimal, null, this);
	game.physics.arcade.overlap(this.animals, this.cars, this.carAnimalCrash, null, this);

	//When all cars are gone, start driving again
	this.numCars = this.cars.length;
	if(this.hasCrashed && this.numCars - this.numDeleted === 0){
		this.hasCrashed = false;
		this.map.animations.paused = false;
	}

	// Apply speed multipliers and finding perp logic
	if (!this.perpBool) {
		if(!this.hasCrashed){
			this.d2p -= (0.5 * this.speed_multiplier);
			this.speed_multiplier = Math.floor((this.d2p_since_last_crash - this.d2p) / 500) + 1;
			if (this.speed_multiplier > 4) this.speed_multiplier = 4;
			this.map.animations._anims.right.speed = 15 * this.speed_multiplier;
		}
		else {
			this.speed_multiplier = 0;
		}
		//Procedural Car Generation
		if (!this.spawningBird)
		createCars(this.cars, this.starts, this.speeds, this.timers,
						this.speed_multiplier, this.sedans, this.trucks, this.cargos);
		this.map.animations.speed = 10 * this.speed_multiplier;
	}
	else {
		this.d2p -= (0.5);
	}
	if(!this.hasCrashed){
		this.spm_text.setText("Gear = " + this.speed_multiplier);
	}
	else{
		this.spm_text.setText("Gear = 1");
	}

    // Catching the perp logic
    if (this.d2p <= 450 && !this.perpBool) {
		this.perp = spawnPerp(this.cars, this.starts);
		this.perpBool = true;
    } else if (this.d2p >= 5000) {
		this.music.stop();
		game.state.start("Lose");
	} else {
        this.d2p_text.setText(Math.round(this.d2p) + "m");
    }

	//Procedural Animal Generation
	if (this.d2p % 500 == 0) {
		this.spawningBird = true;
		this.birdSpawnTimer = 150;
		spawnBird(this.animals);
	}
	if (this.spawningBird == true) {
		this.birdSpawnTimer--;
		if (this.birdSpawnTimer == 0) {
			this.spawningBird = false;
		}
	}
	//createAnimals(this.animals, this.animalStarts, this.animalSpeeds, this.animalTimers, this.speed_multiplier);

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
	this.numDeleted += 1;
};

gameState.prototype.removeAnimal = function(boundary, animal) {
    animal.kill();
};

gameState.prototype.carAnimalCrash = function(animal, car) {
	car.kill();
	animal.kill();
	this.birdSpawnTimer = 0;
	this.spawningBird = false;
};

gameState.prototype.win = function(player, perp) {
    this.music.stop();
	game.state.start("Win");
};

// Player crash
gameState.prototype.crash = function(player, object) {
	object.kill();
	this.numDeleted += 1;
	this.haltAnimation = 90;
	this.d2p += 350;
	this.d2p_since_last_crash = this.d2p;
	this.speed_multiplier = 1;
	this.timers = [210, 160, 90, 120, 270];
	 this.cars.forEach(function (c) {
		c.body.velocity.y = -2 * Math.abs(c.body.velocity.y); });
	this.hasCrashed = true;
	this.map.animations.paused = true;
	this.animals.forEach(function (a) { a.kill(); });
};

gameState.prototype.crashAnimal = function(player, object) {
	object.kill();
	this.haltAnimation = 90;
	this.d2p += 350;
	this.d2p_since_last_crash = this.d2p;
	this.speed_multiplier = 1;
	this.timers = [210, 160, 90, 120, 270];
	 this.cars.forEach(function (c) {
		c.body.velocity.y = -2 * Math.abs(c.body.velocity.y); });
	this.hasCrashed = true;
	this.map.animations.paused = true;
	this.animals.forEach(function (a) { a.kill(); });
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

function spawnPerp(cars, start) {
	let perp = cars.create(start[2], 65, "sedan_red");
	perp.body.velocity.y = 100;
	perp.scale.set(1.5, 1.5);
	return perp;
};

function spawnBird(animals) {
	let animal = animals.create(800, 50, "bird");
	animal.body.velocity.y = 400;
	animal.body.velocity.x = -200;
	animal.scale.set(3, 3);
	animal.animations.add("graze", [0, 1], 5, true);
	animal.animations.play("graze");
};

function createCars(cars, starts, speeds, timers, speed_m, s, t, c) {
    for (let i = 0; i < starts.length; ++i) {
        if (timers[i] === 0 && speed_m > 0) {
			// Choose a type of car, 50% sedan, 30% truck, 20% cargo
			let type_picker = getRandomInt(10);
			let type = s;
			let colors = 2;
			if (type_picker >= 5 && type_picker < 8) {
				type = t;
				colors = 4;
			} else if (type_picker >= 8) {
				type = c;
				colors = 4;
			}

			// Spawn the car
            timers[i] = 250/speed_m;
            let car = cars.create(starts[i], 65, type[getRandomInt(colors)]);
            car.body.velocity.y = speeds[getRandomInt(4)] * speed_m;
            car.scale.set(1.5,1.5);
        } else if(speed_m > 0){
            timers[i]--;
        }
    }
};
/*
gameState.prototype.restartCars = function() {
	this.hasCrashed = false;
	this.map.animations.paused = false;
};
*/

/*
function createAnimals(animals, starts, speeds, timers, speed_m) {
    for (let i = 0; i < 3; ++i) {
        if (timers[i] === 0) {
            timers[i] = 120;
            let animal = animals.create(65, starts[i], "bird");
            animal.body.velocity.x = - 100;
            animal.scale.set(3,3);
        } else {
            timers[i]--;
        }
    }
};
*/

// Bless JS Hoisting
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
