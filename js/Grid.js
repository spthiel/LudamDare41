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

	resize() {
		this.center = {x:screen.w/2,y:screen.h-(cellwidth*2.5+cellwidth/2)};
	}

	getCell(x,y) {
		if(x < this.center.x-cellwidth*2.5 || x > this.center.x+cellwidth*2.5 || y < this.center.y-cellwidth*2.5 || y > this.center.y+cellwidth*2.5) //out of grid
			return null;
		let dx = (x-this.center.x);
		let dy = (y-this.center.y);
		let rx = (dx+2.5*cellwidth)/cellwidth | 0;
		let ry = (dy+2.5*cellwidth)/cellwidth | 0;
		return this.grid[rx][ry];
	}

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

	drawAll() {
		push()
			translate(this.center.x,this.center.y);

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

var timeToChange = 400;

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
			fill(255);
		} else if(this.state == 1) {
			fill(150,0,0);
			this.changeStateLater();
		} else if(this.state == 2) {
			fill(0,200,0);
		}
		stroke(0);
		rect(-cellwidth/2,-cellwidth/2,cellwidth,cellwidth);
		if(this.state != 2) {
			fill(0);
			noStroke();
			textSize(cellwidth/4);
			textAlign(CENTER,CENTER);
			text(this.number == undefined ? this.text : this.number + "" +  this.text,0,0);
		}
	}

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

	setNumber(number) {
		this.number = number;
	}

}
