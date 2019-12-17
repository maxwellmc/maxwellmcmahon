/**
 *
 *	actor.js
 *
 *	The Actor object. This mostly defines a villain. Hero is basically a limited villain.
 *
 **/

// Constants
var STATE_IDLE = 0;
var STATE_DEFEND = 1;
var STATE_ATTACK = 2;
var STATE_MITOSIS = 3;
var COUNT_TO_HUNGER = 200;

// Constructor
function Actor(id, speed, x, y, health, color) {
	this.id = id;
	this.speed = speed;
	this.x = x;
	this.y = y;
	this.health = health;
	this.radius = health /2 ;
	this.color = color;
	this.xModifier = 0;
	this.yModifier = 0;

	this.setNewRandomDirection();
}

Actor.prototype.speed = 100;
Actor.prototype.x = 0;
Actor.prototype.y = 0;
Actor.prototype.radius = 0;
Actor.prototype.color = '';
Actor.prototype.health = 100;
Actor.prototype.alpha = 0.85;
Actor.prototype.state = STATE_IDLE;
Actor.prototype.prey = false;
Actor.prototype.lastHealth = this.health;
Actor.prototype.countToHunger = COUNT_TO_HUNGER;
Actor.prototype.velocity = 1;


Actor.prototype.update = function (delta) {

	this.updateHunger();
	this.updateState();
	this.updateSize();
	this.updateAlpha();
	
	this.checkMitosis();

	if(this.id!=-1){
		if(this.state == STATE_IDLE){
			this.moveIdle(delta);
		}else if(this.state == STATE_DEFEND){
			this.moveDefend(delta);
		}else if(this.state == STATE_ATTACK){
			this.moveAttack(delta);
		}
	}else{
		if(this.health>95){
			this.state = STATE_MITOSIS;
		}
	}
	
}

// Called every update, but only knocks health down if countToHunger is 0
Actor.prototype.updateHunger = function () {
	if(this.countToHunger <= 0){
		this.countToHunger = COUNT_TO_HUNGER;
		if(this.id==-1)
			this.lowerHealth(0.2);
		else
			this.lowerHealth(0.1);
	}else{
		this.countToHunger--;
	}
}

// Alpha is dependent on health
Actor.prototype.updateAlpha = function () {
	this.alpha = rescale(this.health,0,100,0.05,0.7);
}

// Check if we're in Mitosis State
Actor.prototype.checkMitosis = function () {
	
	// Are we in mitosis mode?
	if(this.state==STATE_MITOSIS){
		game.spawnChildVillain(this);
		this.health = 50;
		this.state=STATE_IDLE;
		return;
	}
}

// Update the actor's state based on touching and personality
Actor.prototype.updateState = function () {

	// Are we in defend mode?
	if(this.state==STATE_DEFEND){
		// Are we still being touched?
		if(game.beingNearTouched(this)){
			// We are, so stay in defend
			return;
		}else{
			this.state = STATE_IDLE;
			return;
		}
	}

	// Are we already idle?
	if(this.state==STATE_IDLE){
		
		// Are we being attacked right now?
		if( game.beingTouched(this) ){

			// Find out who's touching us
			var toucher = game.getToucher(this);

			// Do they have higher health than us?
			if(toucher!=false && toucher.health>this.health){
				// Yep, we're probably being attacked, so go into defend mode
				this.setNewRandomDirection();
				this.state = STATE_DEFEND;
				return;
			}

		}

		// Are we hungry?
		if(this.health < 70){
			// If yes, let's attempt attack mode below
			this.state = STATE_ATTACK;
			// Don't return!
		}
	
		// Are we ready to undergo mitosis?
		if(this.health > 95){
			this.state = STATE_MITOSIS;
			return;
		}

	}

	// Are we in attack mode?
	if(this.state==STATE_ATTACK){
		// Are we lacking some prey?
		if(!this.hasPrey()){
			// If we don't have prey, let's look for some
			this.prey = this.findPrey();
		}

		// Are we STILL lacking prey?
		if(!this.hasPrey()){
			// If we're still prey-less, just stay idle
			this.state = STATE_IDLE;
			return;
		}else{
			// If we have some prey, let's check to see if they're still healthy
			if(this.prey.health>0){
				// They're healthy
				// Are they still valid prey for us?
				if(this.prey.health < this.health){
					// They're weaker than use, keep killing
					return;
				}else{
					// They're bad prey now, drop it and go idle
					this.state = STATE_IDLE;
					return;
				}
				
			}else{
				// They're dying, give up
				this.state = STATE_IDLE;
				return;
			}
		}
	}
	
}

Actor.prototype.hasPrey = function () {
	if(this.prey==false || typeof this.prey==='undefined' || this.prey.health<2)
		return false;
	else
		return true;
}

Actor.prototype.getHealthMultiplier = function () {
	return 1-(this.health/105);
}

Actor.prototype.changeX = function (x) {
	
	var newPoint = this.x+x;

	if(game.isXInWorld(newPoint)){
		this.x = newPoint;
	}else{
		this.setNewRandomDirection();
	}
}

Actor.prototype.changeY = function (y) {

	var newPoint = this.y+y;

	if(game.isYInWorld(newPoint)){
		this.y = newPoint;
	}else{
		this.setNewRandomDirection();
	}
}

// Slowly move the actor
Actor.prototype.moveIdle = function (delta) {
	var healthMultiplier = this.getHealthMultiplier();

	if(this.velocity>1)
		this.velocity-=0.05;

	this.changeX( this.velocity*( this.xModifier*(healthMultiplier) ) * delta );
	this.changeY( this.velocity*( this.yModifier*(healthMultiplier) ) * delta );
}

// Actor perceives an attack and moves away quickly
Actor.prototype.moveDefend = function (delta) {
	var healthMultiplier = this.getHealthMultiplier();

	if(this.velocity<6)
		this.velocity+=0.05;

	this.changeX( this.velocity*( this.xModifier*(healthMultiplier) ) * delta );
	this.changeY( this.velocity*( this.yModifier*(healthMultiplier) ) * delta );
}

// Actor is hungry and moves for an attack on prey
Actor.prototype.moveAttack = function (delta) {

	var healthMultiplier = this.getHealthMultiplier();

	if(this.velocity>1.5)
		this.velocity-=0.05;
	if(this.velocity<1.5)
		this.velocity+=0.05;

	// Track the prey
	var diffX = this.prey.x - this.x;
	var diffY = this.prey.y - this.y;

	// Move towards
	this.changeX( this.velocity*(  sign(diffX)*( this.xModifier*(healthMultiplier) )  ) * delta );
	this.changeY( this.velocity*(  sign(diffY)*( this.yModifier*(healthMultiplier) )  ) * delta );

}

// Lower the health of the actor
Actor.prototype.lowerHealth = function (amount) {
	
	if(this.health < 2){
		this.die();
		return;
	}

	this.health -= amount;
}

// Raise the health of the actor
Actor.prototype.raiseHealth = function (amount) {
	if(this.health >= 100)
		return;
	this.health += amount;
}

Actor.prototype.die = function () {
	if(game.getHero()==this){
		//alert("dead");
	}
	game.removeVillain(this);
}

// Change the size/radius based on the current health
Actor.prototype.updateSize = function () {
	this.radius = rescale(this.health,0,100,5,65);
}

// Find a nearby actor with lower health
Actor.prototype.findPrey = function () {
	
	var ret = false;
	
	// Loop through every actor
	for(var i=0; i<game.actors.length; i++){
		if(game.areNearby(this, game.actors[i]) 
				&& (game.actors[i].health < this.health) 
				&& (game.actors[i].color!=this.color)
			){
			ret = game.actors[i];
			break;
		}
	}
	
	return ret;
}

Actor.prototype.generateRandomDirectionModifier = function () {
	return randDec(-2,2);
}

Actor.prototype.setNewRandomDirection = function () {

	// Prevent completely stationary actors
	do{
		this.xModifier = this.generateRandomDirectionModifier();
		this.yModifier = this.generateRandomDirectionModifier();
	}
	while(this.xModifier==0 && this.yModifier==0);

}