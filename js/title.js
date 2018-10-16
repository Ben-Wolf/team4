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
	this.plateArray=["MD1", "BA2", "SO3", "SR4", "GL5", "SF6", "BW7"];
	if(this.takenArray.length===0){
		this.takenArray.fill(0, this.plateArray.length,false);
	}
	this.plateIndex=Math.floor(Math.random() * this.plateArray.length);
	while(this.takenArray[this.plateIndex]===true){
		this.plateIndex=Math.floor(Math.random() * this.plateArray.length);
	}
	this.takenArray[this.plateIndex]=true;
	//uncomment the line below to test the wanted car
	//this.plateIndex=1;
	//change 5 to number of car models
	//type arrays taken from gameState
	sedan = ["sedan_red", "sedan_gray", "sedan_white"];
	truck = ["truck_red", "truck_gray", "truck_white"];
	cargo = ["cargo_red", "cargo_gray", "cargo_white"];
	let type;
	if(this.plateIndex===1){
		type='sedan_red';
		this.make='Sedan';
		this.carColor='Red';
	}
	else{
		let randColor=Math.floor(Math.random()*3);
		let randMake=Math.floor(Math.random()*3);
		if(randMake===0){
			this.make='Sedan';
			type=sedan[randColor];
			this.carColor=sedan[randColor].slice(6);
			this.carColor=this.carColor.charAt(0).toUpperCase()+this.carColor.substring(1);
		}
		else if(randMake===1){
			this.make='Truck';
			type=truck[randColor];
			this.carColor=truck[randColor].slice(6);
			this.carColor=this.carColor.charAt(0).toUpperCase()+this.carColor.substring(1);
		}
		else{
			this.make='Cargo';
			type=cargo[randColor];
			this.carColor=cargo[randColor].slice(6);
			this.carColor=this.carColor.charAt(0).toUpperCase()+this.carColor.substring(1);
		}
	}
	Phaser.Sprite.call(this, game, x+144*lane+32, y, type);
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
	
	this.checkWorldBounds = true;
	/*if(this.moveVelo>0&&this.y>=2436-132-118){
		game.state.start("Game");
	}*/
	if(this.moveVelo<-3&&this.y<=400){
		this.hud.pastPoint=true;
	}
	this.events.onOutOfBounds.add(resetThis, this);
};

//HUD is well, the HUD for phase 1. Also tracks if the player has found the right car or not.
let HUD=function(game){
	let style = { font: "24px Verdana", fill: "#ffffff", align: "center"};
	this.takenArray=[]
	this.win=false;
	this.pastPoint=false;
	let carHUD=game.add.sprite(0,0,"carHUD");
	this.makeGauge=game.add.sprite(633,1880,"alert");
	this.colorGauge=game.add.sprite(898,1882,"alert");
	this.colorGauge.frame=7;
	this.plateGauge=game.add.sprite(765,2068,"alert");
	this.plateGauge.frame=14;
	this.slider=game.add.sprite(500,550,"gear");
	this.slider.inputEnabled=true;
	//rectangle is supposed to be bounds, it isn't...
	this.slider.input.enableDrag(false,false,false, Phaser.Rectangle(600, 2400, 100, 100));
	this.slider.input.allowVerticalDrag=false;
	this.slider.events.onDragStop.add(goBack, this);
	this.wantTxt=game.add.text(126, 1920, "SEDAN",style);
	this.plateTxt=game.add.text(283, 1884, "BA2",style);
	this.colorTxt=game.add.text(417, 1920, "RED",style);
	//group.add(this.makeGauge);
	//group.add(this.colorGauge);
};
HUD.prototype.constructor=HUD;
let titleState = function(){
};

titleState.prototype.create = function(){
	this.depthGroup=game.add.group();
	this.foundCar=false;
	let map = game.add.tilemap("TileMap1");
	map.addTilesetImage("newtiles", "newtiles");
	map.addTilesetImage("curb", "curb");
	let layer = map.createLayer("Tile Layer 1")
	this.depthGroup.add(layer);
	this.player=game.add.sprite(882-72/2,1218,"player");
	this.player.anchor.set(.5,.5);
	this.player.scale.set(1.5,1.5);
	this.player.angle=-90;
	this.ani=this.player.animations.add("siren", [0,1,2,3,4,5,6,7,8,7,6,5,4,3,2,1]);
	this.hud=new HUD(game, this.depthGroup);
	this.currentTime=0;
	this.spawnTime=0;
	this.transitionStarted=false;
	this.siren=game.add.audio('siren');
	this.music=game.add.audio("identify");
	this.music.play("", 0, 1, true);
	//spawnNewCar(this.hud, this.depthGroup);
};
titleState.prototype.update = function(){
	this.hud.slider.y=2300;
	if(this.hud.slider.x>1000){
			this.hud.slider.x=1000;
		}
		else if(this.hud.slider.x<650){
			this.hud.slider.x=650;
		}
	if(game.input.mousePointer.x<650||game.input.mousePointer.x>1080){
		this.hud.slider.input.allowHorizontalDrag=false;
	}
	else if(!this.hud.slider.input.allowHorizontalDrag){
		this.hud.slider.input.allowHorizontalDrag=true;
	}
	if(this.hud.slider.x>=950){
		if(this.hud.win){
			transitionAni(this.hud.winCar);
			if(!this.ani.isPlaying){
				this.ani.play(10,true);
				this.siren.play("", 0, .5, false);
			}
			this.transitionStarted=true;
			this.foundCar=true;
			//movePlayer(this.player);
			//console.log(this.hud.winCar.y);
		}
	}
	if(!this.hud.win&&!this.transitionStarted){
		this.foundCar=false;
	}
	if(this.spawnTime<=this.game.time.totalElapsedSeconds()-this.currentTime&&!this.foundCar){
		spawnNewCar(this.hud, this.depthGroup);
		this.currentTime=this.game.time.totalElapsedSeconds();
		this.spawnTime=Math.floor(Math.random()*4)+3;
	}
	if(this.transitionStarted&&this.hud.pastPoint){
		movePlayer(this.player, this.siren, this.music);
	}
};
//used to kill the car when it hits the bounds of the screen.
resetThis=function(car, hud){
	car.hud.takenArray[car.plateIndex]=false;
	car.destroy();
};
spawnNewCar=function(hud, group){
	let spawnedCar=new Car(game,32 , 2436-132-118, Math.floor(Math.random()*5),hud.takenArray,hud);
	hud.takenArray=spawnedCar.takenArray;
	car=game.add.existing(spawnedCar);
	car.scale.set(1.5,1.5);
	group.add(car,false,1);
	group.sort('z',Phaser.Group.SORT_ASCENDING);
};
clicked=function(car){
	if(car.isWanted){
		car.hud.win=true;
		car.hud.winCar=car;
	}
	else{
		car.hud.win=false;
	}
	if(car.make==="Sedan"){
		car.hud.makeGauge.frame=0;
	}
	else if(car.make==="Truck"){
		car.hud.makeGauge.frame=1;
	}
	else{
		car.hud.makeGauge.frame=2;
	}
	if(car.carColor==="Red"){
		car.hud.colorGauge.frame=7;
	}
	else if(car.carColor==="Gray"){
		car.hud.colorGauge.frame=8;
	}
	else{
		car.hud.colorGauge.frame=9;	
	}
	car.hud.plateGauge.frame=14+car.plateIndex;
	
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
		car.moveVelo=-8;
	//}
}
movePlayer=function(player, siren, music){
	if(player.x>=882-240){
		player.x-=5;
	}
	else{
		player.angle=0;
		player.y-=8;
	}
	if(player.y<=10){
		siren.stop();
		music.stop();
		game.state.start("Game");
	}
}