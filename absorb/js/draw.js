/**
 *
 *	game.js
 *
 *	All functions related to drawing information onto the canvas.
 *
 **/

// Constants
var HERO_COLOR = "#1d8db3" //teal;
var HERO_COLOR2 = "#0d3e3c";
var COLOR_BLUE = "#2419b2"; // blue
var COLOR_PURPLE = "#6f0aaa"; // purple
var COLOR_PINK = "#db0058"; //pink
var drawnBg = false;

var updateViewport = function () {

	game.getHero().x = viewport.x + mousePos.x;
	game.getHero().y = viewport.y + mousePos.y;
	
	if(mousePos.x > (viewport.width*0.6))
		viewport.move("right");
	if(mousePos.x > (viewport.width*0.7))
		viewport.move("right",1.5);
	if(mousePos.x > (viewport.width*0.8))
		viewport.move("right",2);
	
	if(mousePos.y > (viewport.height*0.6))
		viewport.move("down");
	if(mousePos.y > (viewport.height*0.7))
		viewport.move("down",1.5);
	if(mousePos.y > (viewport.height*0.8))
		viewport.move("down",2);
		
	if(mousePos.x < (viewport.width*0.4))
		viewport.move("left");
	if(mousePos.x < (viewport.width*0.3))
		viewport.move("left",1.5);
	if(mousePos.x < (viewport.width*0.2))
		viewport.move("left",2);
		
	if(mousePos.y < (viewport.height*0.4))
		viewport.move("up");
	if(mousePos.y < (viewport.height*0.3))
		viewport.move("up",1.5);
	if(mousePos.y < (viewport.height*0.2))
		viewport.move("up",2);

}

var drawActor = function (actor) {
	
	ctx.globalAlpha = actor.alpha;
	ctx.beginPath();
	ctx.arc(actor.x-viewport.x, actor.y-viewport.y, actor.radius, 0, 2 * Math.PI, false);
	ctx.fillStyle = actor.color;
	ctx.fill();
	ctx.lineWidth = 5;
	//ctx.strokeStyle = '#003300';
	//ctx.stroke();
};

var drawHero = function () {
	drawActor(game.getHero());
};

var drawVillains = function () {
	for(var i=0; i<game.actors.length; i++){
		// First check if they're in the Viewport
		if(!isViewable(game.actors[i]))
			continue;
		if(game.actors[i].id!=-1)
			drawActor(game.actors[i]);
	}
}

var isViewable = function (actor) {
	if(actor.x+actor.radius < viewport.x || actor.x-actor.radius > (viewport.x + viewport.width))
		return false;
	if(actor.y+actor.radius < viewport.y || actor.y-actor.radius > (viewport.y + viewport.height))
		return false;
	return true;
}

function clearCanvas() {
	// Clear the canvas for redraw
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.globalAlpha = 1.0;

	//ctxBg.clearRect(0,0,canvas.width,canvas.height);
	ctxBg.globalAlpha = 1.0;
}

function drawBackground() {
	// Create bg radial gradient
	var grd = ctxBg.createRadialGradient(canvas.width/2,canvas.height/2,100,canvas.width/2,canvas.height/2,canvas.width*0.7);
	grd.addColorStop(0,"#470458"); // lighter purple
	grd.addColorStop(1,"#200128"); // dark purple
	ctxBg.fillStyle = grd;
	ctxBg.fillRect(0,0,canvas.width,canvas.height);

	// Create translucent linear gradients
	var grd = ctxBg.createLinearGradient(0, 0, canvas.width, canvas.height);
	grd.addColorStop(0, '#192652');   //blueish
	grd.addColorStop(1, 'transparent');
	ctxBg.fillStyle = grd;
	ctxBg.fillRect(0,0,canvas.width,canvas.height);
}

function drawVignette() {
	// Create bg radial gradient
	ctx.globalAlpha = 0.4;
	var grd = ctx.createRadialGradient(canvas.width/2,canvas.height/2,100,canvas.width/2,canvas.height/2,canvas.width*0.9);
	grd.addColorStop(0,"transparent");
	grd.addColorStop(1,"#000");
	ctx.fillStyle = grd;
	ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawDebug(){
	if(showDebug){
		ctx.font = "normal 10px sans-serif";
		ctx.fillStyle = 'white';

		ctx.fillText("delta: "+debug.delta, 10, 30);
		ctx.fillText("mouseX: "+debug.mouseX, 10, 40);
		ctx.fillText("mouseY: "+debug.mouseY, 10, 50);
		ctx.fillText("villains: "+debug.numVillains, 10, 60);
		ctx.fillText("viewportX: "+debug.viewportX, 10, 70);
		ctx.fillText("viewportY: "+debug.viewportY, 10, 80);
		ctx.fillText("herohealth: "+debug.heroHealth, 10, 90);
	}
}

// Draw everything
function render () {

	clearCanvas();
	
	if(!drawnBg){
		drawBackground();
		drawnBg = true;
	}
	
	// Draw the actors
	ctx.save();
	drawVillains();
	drawHero();
	ctx.restore();
	
	drawVignette();
	
	drawDebug();

};
