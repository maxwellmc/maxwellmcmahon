/**
 *
 *	game.js
 *
 *	The Game object.
 *
 **/

// "Constants"
var NUM_VILLAINS = 300;
var WORLD_SIZE_MULTIPLIER = 6;
var FPS = 30;

// Global Var
var worldWidth = canvas.width * WORLD_SIZE_MULTIPLIER;
var worldHeight = canvas.height * WORLD_SIZE_MULTIPLIER;
var viewport = new Viewport(worldWidth/2, worldHeight/2, canvas.width, canvas.height);
var travelIncrement = 5;
var debug = {  
     'delta': 0
}
var showDebug = false;


// Constructor
function Game() {
	this.actors = [];

	this.spawnHero();
	this.spawnVillains();
}


// Called every game tick
Game.prototype.update = function (delta)
{
	updateViewport();
	
	this.updateActors(delta);
	this.checkForOverlaps();

	updateDebug();
}

// If any two actors are overlapping, drain the prey's health and inc the predator's
Game.prototype.checkForOverlaps = function ()
{
	var actorsLength = this.actors.length;

	// Check each object against each other one without checking the same two actors twice
	for(var i=0; i<actorsLength; i++){
		for(var j=i+1; j<actorsLength; j++){ // magic for not checking the same two actors twice
			if(typeof this.actors[i] === "undefined" || typeof this.actors[j] === "undefined")
				continue; // in case villain got removed during search
			if(this.actors[i] === this.actors[j])
				continue; // in case we're comparing to itself
			if(this.areOverlapping(this.actors[i], this.actors[j]) 
					&& this.actors[i].health!=this.actors[j].health
					&& this.actors[i].color!=this.actors[j].color
				){
				var predator = this.getHealthier(this.actors[i], this.actors[j]);
				var prey = this.getWeaker(this.actors[i], this.actors[j]);
				prey.lowerHealth(0.15);
				predator.raiseHealth(0.10);
			}
		}
	}
}

Game.prototype.getHealthier = function (actor1, actor2)
{
	if(actor1.health > actor2.health){
		return actor1;
	}else{
		return actor2;
	}
}

Game.prototype.getWeaker = function (actor1, actor2)
{
	if(actor1.health < actor2.health){
		return actor1;
	}else{
		return actor2;
	}
}

Game.prototype.isXInWorld = function (p){
	if(p<0 || p>worldWidth){
		return false;
	}else{
		return true;
	}
}

Game.prototype.isYInWorld = function (p){
	if(p<0 || p>worldHeight){
		return false;
	}else{
		return true;
	}
}

Game.prototype.findDistance = function (actor1, actor2){
	// Basic Euclidean distance, with syntax optimized for JS performance
	var xDist = actor2.x - actor1.x;
	var yDist = actor2.y - actor1.y;
	return Math.sqrt(  Math.pow(xDist,2) + Math.pow(yDist,2)  );
}

// Check if two actors are touching
Game.prototype.areTouching = function (actor1, actor2)
{
	var distance = this.findDistance(actor1,actor2);

	var radiusDistance = actor1.radius + actor2.radius;
	
	if(distance <= radiusDistance){
		return true;
	}
		
	return false;
}

// Check if two actors are fulling overlapping one another
Game.prototype.areOverlapping = function (actor1, actor2)
{
	var distance = this.findDistance(actor1,actor2);
	
	// Average of their radii
	var radiusDistance = (actor1.radius + actor2.radius)/2;
	
	if(distance <= radiusDistance){
		return true;
	}
		
	return false;
}

// Check if two actors are close to touching each other
Game.prototype.areNearTouching = function (actor1, actor2)
{
	var distance = this.findDistance(actor1,actor2);
	
	var radiusDistance = Math.sqrt( Math.pow( actor1.radius*2 , 2 ) + Math.pow( actor2.radius*2 , 2 ) );

	if(distance <= radiusDistance){
		return true;
	}
		
	return false;
}

// Check if two actors are in the same vicinity
Game.prototype.areNearby = function (actor1, actor2)
{
	var distance = this.findDistance(actor1,actor2);
	
	var radiusDistance = Math.sqrt( Math.pow( actor1.radius*4 , 2 ) + Math.pow( actor2.radius*4 , 2 ) );

	if(distance <= radiusDistance){
		return true;
	}
		
	return false;
}

// Check if an actor is being touched by someone
Game.prototype.beingTouched = function (actor)
{	
	var actorsLength = this.actors.length;

	for(var i=0; i<actorsLength; i++){

		// Let's make sure we're not testing the actor against herself
		if(actor===this.actors[i]){
			continue;
		}

		if(this.areTouching(actor,this.actors[i])){
			return true;
		}

	}

	return false;
}

// Returns which actor is touching 
Game.prototype.getToucher = function (actor)
{	
	var actorsLength = this.actors.length;

	for(var i=0; i<actorsLength; i++){

		// Let's make sure we're not testing the actor against herself
		if(actor===this.actors[i]){
			continue;
		}

		if(this.areTouching(actor,this.actors[i])){
			return this.actors[i];
		}

	}

	return false;
}

// Check if an actor is close to being touched
Game.prototype.beingNearTouched = function (actor)
{
	//var actorsLength = ;

	for(var i=0; i<this.actors.length; i++){
		// Let's make sure we're not testing the actor against herself
		if(actor===this.actors[i]){
			continue;
		}

		if(this.areNearTouching(actor,this.actors[i])){
			return true;
		}
	}

	return false;
}

// Spawns our hero
Game.prototype.spawnHero = function ()
{
	this.actors.push( new Actor(-1, 200, 0, 0, 50, HERO_COLOR) );
}

// Spawns villains randomly around the map
Game.prototype.spawnVillains = function ()
{
	for (var i=0; i<NUM_VILLAINS; i++) {
		this.actors.push( new Actor(i, 100, randX(), randY(), rand(30,100), this.pickColor() ) );
	}
	
}

// Spawns and returns child villain to its parent
Game.prototype.spawnChildVillain = function (parent)
{
	var child = new Actor(this.getNextVillainID(), 100, parent.x, parent.y, 50, parent.color );
	this.actors.push(child);
	return child;
}

// Finds the highest villain ID and returns it +1
Game.prototype.getNextVillainID = function ()
{
	var highestID = 0;

	for (var i=0; i<this.actors.length; i++) {
		if(this.actors[i].id>highestID){
			highestID = this.actors[i].id;
		}
	}

	return highestID;
}

// Get reference to hero
Game.prototype.getHero = function (){

	for (var i=0; i<this.actors.length; i++) {
		if(this.actors[i].id==-1){
			return this.actors[i];
		}
	}

	return false;
}

// Util funcs
function rand (min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randDec (min, max)
{
	return (Math.random() * (max - min + 1)) + min;
}
function randX ()
{
	return rand(0, worldWidth);
}
function randY ()
{
	return rand(0, worldHeight);
}
function sign (x)
{
    if(x>0){
    	return 1;
    }else if(x<0){
    	return -1;
    }else{
    	return 0;
    }
}
function rescale (val, originalMin, originalMax, targetMin, targetMax){
	return (val - originalMin) * (targetMax - targetMin) / (originalMax - originalMin) + targetMin;
}

// Picks a random color for the villains
Game.prototype.pickColor = function ()
{
	var r = rand(1,3);
	switch(r){
		case 1:
			return COLOR_BLUE;
		case 2:
			return COLOR_PINK;
		case 3:
			return COLOR_PURPLE;
	}
}

// Call the actors' individual update funcs
Game.prototype.updateActors = function (delta)
{
	this.getHero().update(delta);
	this.updateVillains(delta);
}

Game.prototype.updateVillains = function (delta)
{
	for(var i=0; i<this.actors.length; i++){
		if(this.actors[i].id!=-1)
			this.actors[i].update(delta);
	}
}

Game.prototype.removeVillain = function (actor)
{
	// Loop through actors array and remove it
	for(var i=0; i<this.actors.length; i++){
		if(this.actors[i].id===actor.id){
			this.actors.splice(i,1);
			console.log("removed villain");
			break;
		}
	}
	
}

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
var time;


var game;

// The main game loop
function main ()
{	
	var now = new Date().getTime();
    var delta = now - (time || now);

    delta *= FPS/1000;
 	
	time = now;

	debug['delta'] = delta.toFixed(2);

	game.update(delta);
    render();

	// Request to do this again ASAP
	requestAnimationFrame(main);
}

// Reset the game when the player catches a monster
function reset ()
{
	game = new Game();
}

function toggleDebug()
{
	if(showDebug)
		showDebug = false;
	else
		showDebug = true;
}

function updateDebug(){
	// Debug stuff
	debug.mouseX = mousePos.x;
	debug.mouseY = mousePos.y;
	debug.numVillains = game.actors.length-1;
	debug.viewportX = ( (viewport.x / worldWidth)*100 ).toFixed(2);
	debug.viewportY = ( (viewport.y / worldHeight)*100 ).toFixed(2);
	debug.heroHealth = game.getHero().health.toFixed(2);
}

// Let's play this game!
resize();
reset();
main();