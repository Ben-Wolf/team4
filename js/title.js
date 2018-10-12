// Car class and titleState stuff.
//note: using https://github.com/photonstorm/phaser-examples/blob/master/examples/sprites/extending%20sprite%20demo%201.js as reference for creating the  car class
let Car=function(game, x, y, lane=0, takenArray=[], hud){
	//use lane for which lane the car will spawn in, might change how x and y works for y to be static for all cars but x is dependent on lane and isn't a part of the parameters
	//will change x based on lane? maybe
	this.startingY=y; //-> this should be the top of the screen
	this.startingX=x;
	this.moveVelo=-3;
	this.hud=hud;
	this.isWanted=false;
	this.takenArray=takenArray;
	//list of possible license plates
	this.plateArray=["TGH 5675", "WIN 2359", "ADE 6577", "HHT 6054", "LMB 1653", "KWQ 9424", "PWF 0248"];
	if(this.takenArray.length===0){
		this.takenArray.fill(0, this.plateArray.length,false);
	}
	this.plateIndex=Math.floor(Math.random() * this.plateArray.length);
	while(this.takenArray[this.plateIndex]===true){
		this.plateIndex=Math.floor(Math.random() * this.plateArray.length);
	}
	this.takenArray[this.plateIndex]=true;
	//change 5 to number of car models
	switch(this.plateIndex%5){
		case 0:
		Phaser.Sprite.call(this, game, x+140*lane+32, y, 'sedan');
		this.make='Sedan';
		this.carColor='White';
		break;
		case 1:
		Phaser.Sprite.call(this, game, x+140*lane+32, y, 'sedan_red');
		this.make='Sedan';
		this.carColor='Red';
		break;
		case 2:
		Phaser.Sprite.call(this, game, x+140*lane+32, y, 'sedan_gray');
		this.make='Sedan';
		this.carColor='Grey';
		break;
		case 3:
		Phaser.Sprite.call(this, game, x+140*lane+32, y, 'truck_white');
		this.make='Truck';
		this.carColor='White';
		break;
		case 4:
		Phaser.Sprite.call(this, game, x+140*lane+32, y, 'cargo_red');
		this.make='Cargo';
		this.carColor='Red';
		break;
	}
	this.anchor.set(.5,.5);
	this.inputEnabled=true;
	this.events.onInputDown.add(clicked, this);
	if(this.plateIndex===1){
		this.isWanted=true;
	}

};
Car.prototype = Object.create(Phaser.Sprite.prototype);
Car.prototype.constructor=Car;
Car.prototype.update=function(){
//car movement should be defined in here
	this.y+=this.moveVelo;
	//this.txt.y=this.y;
	if(this.moveVelo===0&&this.angle>-179){
		this.angle += 5;
		console.log(this.angle);
	}
	else if(this.moveVelo===0){
		this.moveVelo=3;
	}
	this.checkWorldBounds = true;
	/*if(this.moveVelo>0&&this.y>=2436-132-118){
		game.state.start("Game");
	}*/
	if(this.moveVelo>0&&this.y>=2200-132-118){
		this.hud.pastPoint=true;
	}
	this.events.onOutOfBounds.add(resetThis, this);
};

//HUD is well, the HUD for phase 1. Also tracks if the player has found the right car or not.
let HUD=function(game){
	let style = { font: "32px Arial", fill: "#ff0044", align: "center", backgroundColor: "#ff0000" };
	this.plateTxt=game.add.text(500, 150, "",style);
	this.plateTxt.addColor("#ffffff",0);
	this.plateTxt.visible=false;
	this.wantTxt=game.add.text(500, this.plateTxt.y-150, "Looking for: WIN 2359\nMake: Sedan\nColor: Red",style);
	this.wantTxt.addColor("#ffffff",0);
	this.slider=game.add.sprite(500,550,"bird");
	this.slider.inputEnabled=true;
	//rectangle is supposed to be bounds, it isn't...
	this.slider.input.enableDrag(false,false,false, Phaser.Rectangle(500, 550, 100, 100));
	this.slider.input.allowVerticalDrag=false;
	this.slider.events.onDragStop.add(goBack, this);
	this.takenArray=[]
	this.win=false;
	this.pastPoint=false;
};
HUD.prototype.constructor=HUD;
let titleState = function(){
};

titleState.prototype.create = function(){
	this.foundCar=false;
	let map = game.add.tilemap("TileMap1");
	map.addTilesetImage("newtiles", "newtiles");
	map.addTilesetImage("curb", "curb");
	let layer = map.createLayer("Tile Layer 1");
	this.player=game.add.sprite(882+118/2,1218,"player");
	this.player.anchor.set(.5,.5);
	this.player.angle=-90;
	this.hud=new HUD(game);
	this.currentTime=0;
	this.spawnTime=Math.floor(Math.random()*10)+3;
	spawnNewCar(this.hud);
};
titleState.prototype.update = function(){
	this.hud.slider.y=2400;
	if(this.hud.slider.x>600){
			this.hud.slider.x=600;
		}
		else if(this.hud.slider.x<500){
			this.hud.slider.x=500;
		}
	if(game.input.mousePointer.x<500||game.input.mousePointer.x>600){
		this.hud.slider.input.allowHorizontalDrag=false;
	}
	else if(!this.hud.slider.input.allowHorizontalDrag){
		this.hud.slider.input.allowHorizontalDrag=true;
	}
	if(this.hud.slider.x>=580){
		if(this.hud.win){
			transitionAni(this.hud.winCar);
			this.foundCar=true;
			//movePlayer(this.player);
			//console.log(this.hud.winCar.y);
		}
	}
	if(this.spawnTime<=this.game.time.totalElapsedSeconds()-this.currentTime&&!this.foundCar){
		spawnNewCar(this.hud);
		this.currentTime=this.game.time.totalElapsedSeconds();
		this.spawnTime=Math.floor(Math.random()*10)+3;
	}
	if(this.foundCar&&this.hud.pastPoint){
		movePlayer(this.player);
	}
};
//used to kill the car when it hits the bounds of the screen.
resetThis=function(car, hud){
	car.hud.takenArray[car.plateIndex]=false;
	car.destroy();
};
spawnNewCar=function(hud){
	let spawnedCar=new Car(game,32 , 2436-132-118, Math.floor(Math.random()*5),hud.takenArray,hud);
	hud.takenArray=spawnedCar.takenArray;
	//spawnedCar.scale.set(3,3);
	car=game.add.existing(spawnedCar);
};
clicked=function(car){
	car.hud.plateTxt.visible=true;
	car.hud.plateTxt.text="Current car: "+car.plateArray[car.plateIndex]+"\n"+car.make+"\n"+car.carColor;
	if(car.isWanted){
		car.hud.win=true;
		car.hud.winCar=car;
	}
	else{
		car.hud.win=false;
	}
};
goBack=function(slider){
		slider.x=500;
}
transitionAni=function(car){
	//console.log(car);
	//car.anchor.setTo(.5, .5);
	//car.moveVelo=0;
	//while(car.angle!=180){
		//car.angle += 90;
	//}
	//if(car.angle===180){
		car.moveVelo=0;
	//}
}
movePlayer=function(player){
	if(player.x>=882-140+118/2-118){
		player.x-=3;
	}
	else{
		player.angle=180;
		player.y+=5;
	}
	if(player.y>=2436-132-118){
		game.state.start("Game");
	}
}