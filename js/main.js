
var frame = 0;
var screen;
var cellwidth = 100;
var grid;

var maxups = 60.0;
var lastUpdate = 0;

var gamestate;

var activeCell;

// bingo reactiongame
// chance of winning increases the less time you needed to complete the task

function setup() {
	if (!Date.now) {
    	Date.now = function() { return new Date().getTime(); }
	}
	gamestate = "start";
	lastUpdate = Date.now();
	screen.w = window.innerWidth;
	screen.h = window.innerHeight;
	let canvas = createCanvas(screen.w,screen.h);
	document.getElementsByClassName("placeholder")[0].appendChild(canvas.canvas);
	grid = new Grid();
}

function getColor(frame) {
	return "hsl(" + (frame%720/2 | 0) + ",100%,50%)";
}

function draw() {

	if(Date.now()-lastUpdate > 1000.0/maxups) {
		update();
		lastUpdate = Date.now();
	}

}

var button;
var inputField;

function update() {
	if(gamestate == "game") {
		background(100);
		push();
			translate(screen.w/2,screen.h/2);
		pop();
		grid.drawAll();
	} else if(gamestate == "start") {
		grid.drawAll();
	}
	frame++;
}

window.addEventListener( 'click', e => {
	if(gamestate == "start") {
		if(activeCell) {
			if(grid.definedNumbers(activeCell).includes(activeCell.number)) {
				activeCell.number = 0;
			}
			activeCell.isActive = false;
		}
		let cell = grid.getCell(e.x,e.y);
		if(cell != null) {
			cell.isActive = true;
			activeCell = cell;
		} else {
			activeCell = undefined;
		}
	}
});

window.onkeyup = e => {
	var key = e.keyCode ? e.keyCode : e.which;
	if(48 <= key && 57 >= key && gamestate == "start" && activeCell) {
		let entered = key-48;
		let currentNumber = activeCell.number;
		if(currentNumber > 100) {
			currentNumber = 999;
		} else {
			currentNumber = currentNumber*10+entered;
		}
		activeCell.number = currentNumber;
	} else if(8 == key && gamestate == "start" && activeCell) {

		let currentNumber = activeCell.number;
		currentNumber = currentNumber/10 | 0;
		activeCell.number = currentNumber;

	} else if(13 == key && gamestate == "start" && activeCell) {
		if(grid.definedNumbers(activeCell).includes(activeCell.number)) {
			activeCell.number = 0;
		}
		activeCell.isActive = false;
		activeCell = undefined
	}
}

window.addEventListener( 'resize', function() {

  setup();

});
