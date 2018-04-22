/* bingo grid */
class Grid {
	constructor() {
		this.width = 5;
		this.height = 5;
		this.center = {x:screen.w/2,y:screen.h-(cellwidth*2.5+cellwidth/2)};

		this.grid = [];

	    for(let x = 0; x < this.width; x++) {
		    this.grid[x] = [];
	   		for(let y = 0; y < this.height; y++) {
				this.grid[x][y] = new Cell(x,y);
	      	}
    	}
	}

	foreach(callback) {
		for(let x = 0; x < this.width; x++) {
			for(let y = 0; y < this.height; y++) {
				callback(this.grid[x][y]);
			}
		}
	}

	/* returns the numbers that are set in the grid */
	definedNumbers(excludedCell) {
		let returnVal = [];
		for(let x = 0; x < this.width; x++) {
			for(let y = 0; y < this.height; y++) {
				if(!excludedCell || excludedCell == undefined || !(x == excludedCell.x && y == excludedCell.y)) {
					let cell = this.grid[x][y];
					if(cell.number != undefined && cell.state != 2) {
						returnVal[returnVal.length] = cell.number;
					}
				}
			}
		}
		return returnVal;
	}

	/* called upon resize to reassign the center */
	resize() {
		this.center = {x:screen.w/2,y:screen.h-(cellwidth*2.5+cellwidth/2)};
	}

	/* returns the cell below pageX and pageY, returns null if there's none */
	getCell(x,y) {
		if(x < this.center.x-cellwidth*2.5 || x > this.center.x+cellwidth*2.5 || y < this.center.y-cellwidth*2.5 || y > this.center.y+cellwidth*2.5) //out of grid
			return null;
		let dx = (x-this.center.x);
		let dy = (y-this.center.y);
		let rx = (dx+2.5*cellwidth)/cellwidth | 0;
		let ry = (dy+2.5*cellwidth)/cellwidth | 0;
		return this.grid[rx][ry];
	}

	/* checks if all of the cells have an assigned value */
	checkGrid() {
		let bool = true;
		for(let x = 0; x < this.width; x++) {
			for(let y = 0; y < this.height; y++) {
				if(this.grid[x][y].number <= 0) {
					this.grid[x][y].state = 1;
					bool = false;
				}
			}
		}
		return bool;
	}

	/* checks if the game ended */
	/* if you read this, never check if the game ended the way I did */
	checkDone() {
		// rows
		for(let x = 0; x < this.width; x++) {
			let bool = true;
			for(let y = 0; y < this.height; y++) {
				if(this.grid[x][y].state != 2)
					bool = false;
			}
			if(bool)
				return true;
		}

		//columns
		for(let y = 0; y < this.height; y++) {
			let bool = true;
			for(let x = 0; x < this.width; x++) {
				if(this.grid[x][y].state != 2)
					bool = false;
			}
			if(bool)
				return true;
		}

		// diagonals
		let bool = true;
		for(let x = 0; x < this.width; x++) {
			if(this.grid[x][x].state != 2)
				bool = false;
		}
		if(bool)
			return true;

		bool = true;
		for(let x = 0; x < this.width; x++) {
			if(this.grid[x][this.width-x-1].state != 2)
				bool = false;
		}
		return bool;
	}

	/* draws all cells with content */
	drawAll() {
		push();
			translate(this.center.x,this.center.y);
			push();
				fill("rgba(0,0,0)");
				strokeWeight(5);
				rect(-(2.5)*cellwidth-2,-(2.5)*cellwidth-2,(2.5)*2*cellwidth+4,(2.5)*2*cellwidth+4,20,20);
			pop();

			for(let x = 0; x < this.width; x++) {
				for(let y = 0; y < this.height; y++) {
					push();
						translate((x-2)*cellwidth,(y-2)*cellwidth);
						this.grid[x][y].draw();
					pop();
				}
			}
		pop()
	}

}

/* transition time */
var timeToChange = 400;

/* cell object */
class Cell {

	constructor(x,y) {
		this.x = x;
		this.y = y;
		this.isActive = false;
		this.number = 0;
		this.text = "";
		this.state = 0;
		this.changing = false;
		this.changingStart = 0;
		this.changingBack = false;
	}

	/* draws the cell */
	draw() {
		if((Date.now()/700 | 0)%2 == 0 && this.isActive) {
			this.text = "|";
		} else {
			this.text = "";
		}

		if(this.isActive) {
			fill(200);
		} else if(this.changingBack) {
			if(Date.now()-this.changingStart > timeToChange) {
				this.changingBack = false;
			}
			let r = map(Date.now()-this.changingStart,0,timeToChange,150,255);
			let b = map(Date.now()-this.changingStart,0,timeToChange,0,255);
			fill(r,b,b);
		} else if(this.state == 0) {
			fill(BUTTONCOLOR);
		} else if(this.state == 1) {
			fill(150,0,0);
			this.changeStateLater();
		} else if(this.state == 2) {
			fill(0,200,0);
		}
		stroke(0);
		let cornertl = 0;
		let cornertr = 0;
		let cornerbl = 0;
		let cornerbr = 0;
		if(this.x == 0 && this.y == 0)
			cornertl = 20;
		if(this.x == grid.width-1 && this.y == 0)
			cornertr = 20;
		if(this.x == 0 && this.y == grid.height-1)
			cornerbl = 20;
		if(this.x == grid.width-1 && this.y == grid.height-1)
			cornerbr = 20;
		rect(-cellwidth/2,-cellwidth/2,cellwidth,cellwidth,cornertl,cornertr,cornerbr,cornerbl);
		if(this.state != 2) {
			fill(BUTTONTEXTCOLOR);
			noStroke();
			textSize(cellwidth/3);
			textAlign(CENTER,CENTER);
			text(this.number == undefined ? this.text : this.number + "" +  this.text,0,0);
		}
	}

	/* starts transition back to white 100ms later */
	changeStateLater() {
		if(!this.changing) {
			this.changing = true;
			setTimeout(e => {
				if(this.state == 1) {
					this.state = 0;
					this.changingStart = Date.now();
					this.changingBack = true;
				}
				this.changing = false;
			}, 100);
		}
	}

	/* sets the numbervalue */
	setNumber(number) {
		this.number = number;
	}

}
