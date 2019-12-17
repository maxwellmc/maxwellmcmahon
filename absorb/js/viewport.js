/**
 *
 *	viewport.js
 *
 *	The Viewport object (viewable subset of the game world).
 *
 **/

function Viewport(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Viewport.prototype.x = 0;
Viewport.prototype.y = 0;
Viewport.prototype.width = 0;
Viewport.prototype.height = 0;
Viewport.prototype.moveIncrement = 0.7;


Viewport.prototype.move = function (direction, modifier) {
	
	movement = this.moveIncrement*modifier;
	
	switch(direction){
		case "right":
			if( (this.x + movement + this.width) < worldWidth)
				this.x += movement;
			break;
		case "down":
			if( (this.y + movement + this.height) < worldHeight)
				this.y += movement;
			break;
		case "left":
			if( (this.x - movement) > 0)
				this.x -= movement;
			break;
		case "up":
			if( (this.y - movement) > 0)
				this.y -= movement;
			break;
	}
}