/**
 *
 *	window.js
 *
 *	Manages interfacing with the browser window, including the canvas object and user interaction.
 *
 **/


// Global Var
var canvas = document.getElementById("canvas");
var canvasBg = document.getElementById("canvasBg");
var ctx = canvas.getContext("2d");
var ctxBg = canvasBg.getContext("2d");
var mousePos = {};

// Get the mouse position (bound to canvas.mousemove)
function getMousePos (canvas, evt)
{
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

// Detect mousemoves to update the rendering
canvas.addEventListener('mousemove', function(evt) {
	mousePos = getMousePos(canvas, evt);
}, false);


// Handle window resize
window.addEventListener("resize", resize, false);
function resize (e)
{
	// Resize canvases
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvasBg.width = window.innerWidth;
	canvasBg.height = window.innerHeight;
	drawnBg = false;

	// Resize the world
	worldWidth = canvas.width * WORLD_SIZE_MULTIPLIER;
	worldHeight = canvas.height * WORLD_SIZE_MULTIPLIER;

	// Resize viewport
	viewport.x = worldWidth/2;
	viewport.y = worldHeight/2;
	viewport.width = canvas.width;
	viewport.height = canvas.height;

}


// Detect key presses
window.addEventListener("keyup", keyPressHandler, false);
 
function keyPressHandler (e)
{
	// D key
    if (e.keyCode == "68"){
        toggleDebug();
    }
    // M key
    if (e.keyCode == "77"){
    	toggleMusic();
    }
    // Enter key
    if (e.keyCode == "13"){
    	toggleFullscreen();
    }
}

function toggleMusic(){
	var music = document.getElementById("music");
	if(music.paused)
		music.play();
	else
		music.pause();
}

// Standard fullscreen toggle from Mozilla
function toggleFullscreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

