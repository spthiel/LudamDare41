
const maxups = 60.0;
const highestNumber = 500;
const maxtimetoclick = 3000;
const maxspawndelay = 5000;

var frame = 0;
var screen;
var cellwidth = 100;
var grid;
var startTime;
var gamestate;
var activeCell;
var lastUpdate = 0;
var difficulty = 1.0;
var difficultyIncrease = 0.0001;
var difficultyIncreaseIncrease = 0.0000001;
var lastReaction;
var maxdifficulty = 5;
var maxdifficultyincrease = 0.01;
var number;
var lastNumberValue;
var possibleNumbers = [];

var health = 5;
var score = 0;

var quickies;

function setup() {
	if (!Date.now) {
    	Date.now = function() { return new Date().getTime(); }
	}
	lastUpdate = 0;
	lastReaction = Date.now();
	screen.w = window.innerWidth;
	screen.h = window.innerHeight;
	cellwidth = screen.h*2/25;
	if(screen.w*0.8/5 < cellwidth)
		cellwidth = screen.w*0.8/5;
	let canvas = createCanvas(screen.w,screen.h);
	document.getElementsByClassName("placeholder")[0].appendChild(canvas.canvas);
	if(!grid) {
		grid = new Grid();
		gamestate = "start";
		quickies = [];
		for(let i = 0; i < highestNumber; i++) {
			possibleNumbers[i] = i+1;
		}
	}
	grid.resize();
	angleMode(DEGREES);
}

function getColor(frame) {
	return "hsl(" + (frame%720/2 | 0) + ",100%,50%)";
}

function removeNumber() {
	let setNumbers = grid.definedNumbers();
	for(let i = possibleNumbers.length-1; i >= 0; i--) {
		let num = possibleNumbers[i];
		if(!setNumbers.includes(num)) {
			possibleNumbers.splice(i,1);
			return;
		}
	}
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
	background(100);
	if(gamestate == "game") {

		grid.drawAll();

		if(Date.now() - lastReaction > maxspawndelay/difficulty) {
			lastReaction = Date.now();
			spawnRandomReaction();
		}
		difficulty += difficultyIncrease;
		difficultyIncrease += difficultyIncreaseIncrease;
		if(difficultyIncrease > maxdifficultyincrease)
			difficultyIncrease = maxdifficultyincrease;
		if(difficulty > maxdifficulty)
			difficulty = maxdifficulty;

		push();
			translate(screen.w/2,screen.h/2);
			fill(0);
			noStroke();
			textSize(cellwidth*4);
			textAlign(CENTER,BOTTOM);
			if(number == 0 || !number) {
				newNumber();
			}
			text((number ? number : 0),0,0);
		pop();

		for(let i = 0; i < quickies.length; i++) {
			let reaction = quickies[i];
			if(reaction.isDead) {
				quickies.splice(i,1);
				i--;
			} else {
				reaction.draw();
			}
		}


	} else if(gamestate == "start") {
		push();
			translate(screen.w/2,screen.h/2-cellwidth);
			fill(0);
			noStroke();
			textSize(cellwidth/2);
			textAlign(CENTER,CENTER);
			text("Enter your bingo numbers below\n(1 to " + highestNumber + ")",0,0);
		pop();
		push();
			translate(screen.w-cellwidth,screen.h-cellwidth/2-cellwidth/4);
			rect(-cellwidth/2,-cellwidth/4,cellwidth,cellwidth/2);
			textSize(cellwidth/4);
			textAlign(CENTER,CENTER);
			text("START",0,0);
		pop();
		grid.drawAll();
	}
	frame++;
}

function newNumber() {
	number = possibleNumbers[random(possibleNumbers.length) | 0];
	if(number == lastNumberValue) {
		newNumber();
	} else {
		lastNumberValue = number;
	}
}

var border = 100;


function spawnRandomReaction() {
	let x = random(screen.w-2*border)+border;
	let y = random(screen.h-2*border)+border;
	if(x < this.grid.center.x-cellwidth*5 || x > this.grid.center.x+cellwidth*5 || y < this.grid.center.y-cellwidth*5 || y > this.grid.center.y+cellwidth*5) { //out of grid
		quickies[quickies.length] = new QuickReactions(x,y);
	} else {
		spawnRandomReaction();
	}
}

window.addEventListener( 'click', e => {
	if(gamestate == "start") {
		if(e.x > screen.w-cellwidth/2*3 && e.x < screen.w-cellwidth/2 && e.y < screen.h-cellwidth/2-cellwidth/4 && e.y > screen.h-cellwidth) {
			gamestate = "game";
			if(activeCell) {
				activeCell.isActive = false;
				activeCell = undefined;
			}
		} else {
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
	} else if(gamestate == "game") {

		for(let i = 0; i < quickies.length; i++) {
			let reaction = quickies[i];
			if(reaction.isDead) {
				quickies.splice(i,1);
				i--;
			} else {
				console.log(e.pageX,e.pageY,reaction,e.x,e.y);
				reaction.onClick(e.pageX,e.pageY);
			}
		}
		let cell = grid.getCell(e.x,e.y);
		if(cell != null) {
			if(cell.number == number) {
				cell.state = 2;
			}
			newNumber();
		}
	}
});

window.onkeyup = e => {
	if(gamestate == "start" && activeCell) {
		var key = e.keyCode ? e.keyCode : e.which;
		if(48 <= key && 57 >= key && gamestate == "start" && activeCell) {
			let entered = key-48;
			let currentNumber = activeCell.number;
			currentNumber = currentNumber*10+entered;
			if(currentNumber > highestNumber) {
				currentNumber = highestNumber;
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
}

window.addEventListener( 'resize', function() {

  setup();

});
