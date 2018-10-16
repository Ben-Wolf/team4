let winState=function(){
};

winState.prototype.create=function(){
	let style = { font: "50px Verdana", fill: "#ffffff", align: "center"};
	let win=game.add.image(15,0,"win");
	let player=game.add.sprite(650,1100,"playerScreen");
	player.scale.set(2.5,2.5);
	let ani=player.animations.add("sirenScreen", [0,1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1]);
	ani.play(10,true);
	let touchTxt=game.add.text(400, 1930, "Touch the screen to play again.",style);
	touchTxt.x=562-touchTxt.width/2;
	game.input.mouse.capture = true;
	//used https://phaser.io/examples/v2/tweens/alpha-text as a reference for tweening the title text
	touchTxt.alpha=.5;
	game.add.tween(touchTxt).to( { alpha: 1 }, 2000, "Linear", true,0, -1, true);
};
winState.prototype.update=function(){
	if(game.input.activePointer.leftButton.isDown){
		game.state.start("Title");
	}
};