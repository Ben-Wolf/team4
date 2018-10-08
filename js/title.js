// Car class and titleState stuff.
//note: using https://github.com/photonstorm/phaser-examples/blob/master/examples/sprites/extending%20sprite%20demo%201.js as reference for creating the  car class
Car=function(game, x, y, lane=0, takenArray=[]){
	//use lane for which lane the car will spawn in, might change how x and y works for y to be static for all cars but x is dependent on lane and isn't a part of the parameters
	//will change x based on lane? maybe
	//isWanted will probably be used for if this is the car this wanted, will probably deleted it later to just check if the license plate is the one that the player wants
	Phaser.Sprite.call(this, game, x+100*lane, y, 'murph');
	this.startingY=y; //-> this should be the top of the screen
	this.startingX=x;
	this.isWanted=false;
	this.takenArray=takenArray;
	this.inputEnabled=true;
	this.events.onInputDown.add(clicked, this);
	//list of possible license plates
	this.plateArray=["TGH 5675", "WIN 2359", "ADE 6577", "HHT 6054", "LMB 1653"];
	if(this.takenArray.length===0){
		this.takenArray.fill(0, this.plateArray.length,false);
	}
	this.plateIndex=Math.floor(Math.random() * this.plateArray.length);
	while(this.takenArray[this.plateIndex]===true){
		this.plateIndex=Math.floor(Math.random() * this.plateArray.length);
	} 
	this.takenArray[this.plateIndex]=true;
	if(this.plateIndex===1){
		this.isWanted=true;
	}

};
Car.prototype = Object.create(Phaser.Sprite.prototype);
Car.prototype.constructor=Car;
Car.prototype.update=function(){
//car movement should be defined in here
	this.y-=1;
	//this.txt.y=this.y;
	this.checkWorldBounds = true;
	this.events.onOutOfBounds.add(resetThis, this);
	}
let titleState = function(){
};
let star;
let plateTxt;
let slider;
let win=false;
let takenArray=[];
titleState.prototype.create = function(){
	plateTxt=game.add.text(500, 500, "");
	plateTxt.addColor("#ffffff",0);
	plateTxt.visible=false;
	let wantTxt=game.add.text(500, 470, "Looking for: WIN 2359");
	wantTxt.addColor("#ffffff",0);
	slider=game.add.sprite(500,550,"star");
	slider.inputEnabled=true;
	slider.input.enableDrag(false,false,false, Phaser.Rectangle(500, 550, 100, 100));
	slider.input.allowVerticalDrag=false;
	slider.events.onDragStop.add(goBack, this);
	this.currentTime=0;
	this.spawnTime=Math.floor(Math.random()*5)+2;

};

titleState.prototype.update = function(){
	slider.y=550;
	if(slider.x>600){
			slider.x=600;
		}
		else if(slider.x<500){
			slider.x=500;
		}
	if(game.input.mousePointer.x<500||game.input.mousePointer.x>600){
		slider.input.allowHorizontalDrag=false;
	}
	else if(!slider.input.allowHorizontalDrag){
		slider.input.allowHorizontalDrag=true;
	}
	if(slider.x>=590){
		if(win){
			game.state.start("Game");
		}
	}
	if(this.spawnTime<=this.game.time.totalElapsedSeconds()-this.currentTime){
		spawnNewCar(this.takenArray);
		this.currentTime=this.game.time.totalElapsedSeconds();
		this.spawnTime=Math.floor(Math.random()*3)+2;
	}
};
resetThis=function(car){
	car.kill();
	car.y=car.startingY;
	car.takenArray[car.plateIndex]=false;
	takenArray[car.plateIndex]=false;
};
spawnNewCar=function(){
	let spawnedCar=new Car(game, 40, 400, Math.floor(Math.random()*3),takenArray);
	takenArray=spawnedCar.takenArray;
	game.add.existing(spawnedCar);
};
clicked=function(car){
	plateTxt.visible=true;
	plateTxt.text=car.plateArray[car.plateIndex];
	if(car.isWanted){
		win=true;
	}
	else{
		win=false;
	}
};
goBack=function(slider){
		slider.x=500;
	
}