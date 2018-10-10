// Car class and titleState stuff.
//note: using https://github.com/photonstorm/phaser-examples/blob/master/examples/sprites/extending%20sprite%20demo%201.js as reference for creating the  car class
let Car=function(game, x, y, lane=0, takenArray=[], hud){
	//use lane for which lane the car will spawn in, might change how x and y works for y to be static for all cars but x is dependent on lane and isn't a part of the parameters
	//will change x based on lane? maybe
	this.startingY=y; //-> this should be the top of the screen
	this.startingX=x;
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
		Phaser.Sprite.call(this, game, x+100*lane, y, 'sedan');
		this.make='sedan';
		this.carColor='red';
		break;
		case 1:
		Phaser.Sprite.call(this, game, x+100*lane, y, 'sedan');
		this.make='sedan';
		this.carColor='red';
		break;
		case 2:
		Phaser.Sprite.call(this, game, x+100*lane, y, 'sedan');
		this.make='sedan';
		this.carColor='red';
		break;
		case 3:
		Phaser.Sprite.call(this, game, x+100*lane, y, 'sedan');
		this.make='sedan';
		this.carColor='red';
		break;
		case 4:
		Phaser.Sprite.call(this, game, x+100*lane, y, 'sedan');
		this.make='sedan';
		this.carColor='red';
		break;
	}
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
	this.y-=3;
	//this.txt.y=this.y;
	this.checkWorldBounds = true;
	this.events.onOutOfBounds.add(resetThis, this);
};

//HUD is well, the HUD for phase 1. Also tracks if the player has found the right car or not. 
let HUD=function(game){
	this.plateTxt=game.add.text(500, 2300, "");
	this.plateTxt.addColor("#ffffff",0);
	this.plateTxt.visible=false;
	this.wantTxt=game.add.text(500, this.plateTxt.y-30, "Looking for: WIN 2359");
	this.wantTxt.addColor("#ffffff",0);
	this.slider=game.add.sprite(500,550,"star");
	this.slider.inputEnabled=true;
	//rectangle is supposed to be bounds, it isn't...
	this.slider.input.enableDrag(false,false,false, Phaser.Rectangle(500, 550, 100, 100));
	this.slider.input.allowVerticalDrag=false;
	this.slider.events.onDragStop.add(goBack, this);
	this.takenArray=[]
	this.win=false;
};
HUD.prototype.constructor=HUD;
let carGroup;
let titleState = function(){
};

titleState.prototype.create = function(){
	//need to figure out how to have the cars spawn on top of the tile
	var map;
	var layer;
	map = game.add.tilemap("TileMap");
	map.addTilesetImage("newtiles", "newtiles");
	layer = map.createLayer("Tile Layer 1");
	layer.resizeWorld();
	this.hud=new HUD(game);
	this.currentTime=0;
	this.spawnTime=Math.floor(Math.random()*10)+3;
	carGroup =game.add.group();
	carGroup.add(layer);
	spawnNewCar(this.hud);
	console.log(layer.z);
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
			game.state.start("Game");
		}
	}
	if(this.spawnTime<=this.game.time.totalElapsedSeconds()-this.currentTime){
		spawnNewCar(this.hud);
		this.currentTime=this.game.time.totalElapsedSeconds();
		this.spawnTime=Math.floor(Math.random()*10)+3;
	}
};
//used to kill the car when it hits the bounds of the screen.
resetThis=function(car, hud){
	car.hud.takenArray[car.plateIndex]=false;
	car.destroy();
};
spawnNewCar=function(hud){
	let spawnedCar=new Car(game, 40, 2436, Math.floor(Math.random()*3),hud.takenArray,hud);
	hud.takenArray=spawnedCar.takenArray;
	spawnedCar.scale.set(3,3);
	car=game.add.existing(spawnedCar);
	carGroup.add(car);
	carGroup.sort('z',Phaser.Group.SORT_ASCENDING);
	console.log(car.z);
};
clicked=function(car){
	car.hud.plateTxt.visible=true;
	car.hud.plateTxt.text=car.plateArray[car.plateIndex];
	if(car.isWanted){
		car.hud.win=true;
	}
	else{
		car.hud.win=false;
	}
};
goBack=function(slider){
		slider.x=500;
}