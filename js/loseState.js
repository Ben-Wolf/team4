let loseState=function(){
};

loseState.prototype.create=function(){
	let style = { font: "50px Verdana", fill: "#ffffff", align: "center"};
	let loseTxt=game.add.text(400, 1200, "You ran out of time!",style);
	loseTxt.x=562-loseTxt.width/2;
	let touchTxt=game.add.text(400, 1800, "Touch screen to play again.",style);
	touchTxt.x=562-touchTxt.width/2;
	game.input.mouse.capture = true;
	//used https://phaser.io/examples/v2/tweens/alpha-text as a reference for tweening the title text
	touchTxt.alpha=.5;
	game.add.tween(touchTxt).to( { alpha: 1 }, 2000, "Linear", true,0, -1, true);
};
loseState.prototype.update=function(){
	if(game.input.activePointer.leftButton.isDown){
		game.state.start("Title");
	}
};