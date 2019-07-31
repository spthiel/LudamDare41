
/* Textcolor of text that's not placed on anything */
const TEXTCOLOR = "rgb(255,255,255)";
/* Color of buttons that are */
const BUTTONCOLOR = "rgb(255,255,255)";
/* Color of text on buttons */
const BUTTONTEXTCOLOR = "rgb(0,0,0)";

/* Max amount of updates per second */
const maxups = 60.0;
/* Represents the highest number that can be placed in the current grid */
var highestNumber = 100;
/* Time you have to click the squares at level 1 */
var maxtimetoclick = 3000;
/* Time between the appereanc of squares at level 1 */
var maxspawndelay = 5000;

/* Unused, represents the amount of frames */
var frame = 0;
/* screen.w = width of the screen, screen.h = height of the screen */
var screen;
/* scales with resolution of the window, everything scales with it */
var cellwidth = 100;
/* The bingo grid */
var grid;
/* Time the game last started */
var startTime;
/* Time when the game ended */
var endTime;
/* current state of the game possible values: game, start, options, win, lose, too small*/
var gamestate;
/* clicked cell at the setup page of the grid */
var activeCell;
/* ms since epoch when the last update happened */
var lastUpdate = 0;
/* factor for time between spawns and click time */
const difficultyBase = 1.0;
var difficulty = 1.0;
/* value that increases the difficulty */
const difficultyIncreaseBase = 0.0005;
var difficultyIncrease = 0.0005;
/* increases the increase with each tick */
const difficultyIncreaseIncreaseBase = 0.000001;
var difficultyIncreaseIncrease = 0.000001;
/* ms since epoch when the last reaction was spawned */
var lastReaction;
/* highest difficulty */
var maxdifficulty = 5;
/* highest possible increase of the difficulty in a tick */
var maxdifficultyincrease = 0.01;
/* current bingo number */
var number;
/* last bingo number to prevent having the same number twice in a row*/
var lastNumberValue;
/* all still possible numbers */
var possibleNumbers = [];

/* amount of square 'kills' */
var kills = 0;

/* health */
var health = 5;
/* unused */
var score = 0;

/* all active reactions */
var quickies;

/* default gamestate = menu */
gamestate = "menu"

/* value for hovereffect in main menu */
var hover = -1;
/* choosen difficulty of the current game */
var difficultyGame = "undef";

/* Font of the main text */
var font;

/* The canvas */
var canvas;
/* Called upon load of the page and resize */
function setup() {
	if (!Date.now) {
    	Date.now = function() { return new Date().getTime(); }
	}
	screen.w = window.innerWidth;
	screen.h = window.innerHeight;
	canvas = createCanvas(screen.w+10,screen.h+10);
	document.getElementsByClassName("placeholder")[0].appendChild(canvas.canvas);
	cellwidth = screen.h*2/25;
	if(screen.w*0.8/5 < cellwidth)
		cellwidth = screen.w*0.8/5;
	if(grid)
		grid.resize();
	font = loadFont('font/aliee13.ttf');
}


/* Setups the settings of the game*/
function setupGame(difficultyChoosen) {
	switch(difficultyChoosen) {
		case 1:
			setupEasyGame();
			difficultyGame = "easy";
			break;
		case 2:
			setupMediumGame();
			difficultyGame = "medium";
			break;
		case 3:
			setupInsaneGame();
			difficultyGame = "insane";
			break;
	}
	difficulty = difficultyBase;
	difficultyIncrease = difficultyIncreaseBase;
	difficultyIncreaseIncrease = difficultyIncreaseIncreaseBase;
	number = undefined;
	kills = 0;
	score = 0;
	lastUpdate = 0;
	lastReaction = Date.now();
	grid = new Grid();
	gamestate = "start";
	quickies = [];
	possibleNumbers = [];
	for(let i = 0; i < highestNumber; i++) {
		possibleNumbers[i] = i+1;
	}
	grid.resize();
	angleMode(DEGREES);
}

/* Sets the variable for a game in easy difficulty */
function setupEasyGame() {
	health = 0;
	highestNumber = 70;
	maxtimetoclick = 10000;
	maxspawndelay = 10000;
}

/* Sets the variable for a game in medium difficulty */
function setupMediumGame() {
	health = 5;
	highestNumber = 100;
	maxtimetoclick = 3000;
	maxspawndelay = 5000;
}

/* Sets the variable for a game in insane difficulty */
function setupInsaneGame() {
	health = 1;
	highestNumber = 300;
	maxtimetoclick = 2000;
	maxspawndelay = 2000;
}

/* Removes the highest number that's not on the grid if possible */
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

/* Function to end the game */
function endGame(){

	gamestate = "lose"
	endTime = Date.now();

}

/* Gets called by p5 (infinite loop) */
function draw() {

}

/* called at most maxups times per second, on avg should be called 60 times per second, updates everything*/
function update() {
	if(!canvas) {
		requestAnimationFrame(update);
		return;
	}
	clear();
	push();
		translate(10,10);
		textAlign(LEFT,TOP);
		textSize(cellwidth/4);
		fill(TEXTCOLOR);
		text("Press ESC to get back to the main menu.\nRules:\n\t1. Get a bingo (5 in a row).\n\t2. Press your board to recycle the number.\n\t3. Don't die.",0,0);
	pop();
	switch(gamestate) {
		case "game":
			updateGame();
			break;
		case "start":
			updateStart();
			break;
		case "win":
			updateWin();
			break;
		case "lose":
			updateLose();
			break;
		case "menu":
			updateMenu(hover);
			break;
		case "too small":
			updateResizePls();
			break;
		case "options":
			updateOptions();
			break;
	}
	updateParticles();
	requestAnimationFrame(update);
}

/* Generates a new bingo number */
function newNumber() {
	number = possibleNumbers[random(possibleNumbers.length) | 0];
	if(number == lastNumberValue) {
		newNumber();
	} else {
		lastNumberValue = number;
	}
}

/* distance from screenborder where no reaction can spawn */
var border = 100;

/* Spawns a new reaction */
function spawnRandomReaction() {
	let x = random(screen.w-2*border)+border;
	let y = random(screen.h-2*border)+border;
	if(x < this.grid.center.x-cellwidth*5 || x > this.grid.center.x+cellwidth*5 || y < this.grid.center.y-cellwidth*5 || y > this.grid.center.y+cellwidth*5) { //out of grid
		quickies[quickies.length] = new QuickReactions(x,y);
	} else {
		spawnRandomReaction();
	}
}

/* Shake it baby! */
function screenshake() {

	let el = document.getElementsByClassName("placeholder")[0];
	el.className += " shake";

	setTimeout(e => el.className = "placeholder",200);

}

requestAnimationFrame(update);
