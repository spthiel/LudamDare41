class Grid {
	constructor() {
		this.width = 5;
		this.height = 5;
		this.center = {x:screen.w/2,y:screen.h-(cellwidth*2.5+50)};

		this.grid = [];

	    for(let x = 0; x < this.width; x++) {
		    this.grid[x] = [];
	   		for(let y = 0; y < this.height; y++) {
				this.grid[x][y] = new Cell(x,y);
	      	}
    	}
	}

	definedNumbers(excludedCell) {
		let returnVal = [];

		for(let x = 0; x < this.width; x++) {
			for(let y = 0; y < this.height; y++) {
				if(excludedCell && !(x == excludedCell.x && y == excludedCell.y)) {
					let cell = this.grid[x][y];
					if(cell.number != undefined) {
						returnVal[returnVal.length] = cell.number;
					}
				}
			}
		}
		return returnVal;
	}

	getCell(x,y) {
		if(x < this.center.x-cellwidth*2.5 || x > this.center.x+cellwidth*2.5 || y < this.center.y-cellwidth*2.5 || y > this.center.y+cellwidth*2.5) //out of grid
			return null;
		let dx = (x-this.center.x);
		let dy = (y-this.center.y);
		let rx = (dx+250)/100 | 0;
		let ry = (dy+250)/100 | 0;
		return this.grid[rx][ry];
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

class Cell {

	constructor(x,y) {
		this.x = x;
		this.y = y;
		this.isActive = false;
		this.number = 0;
		this.text = "";
	}

	draw() {
		if((Date.now()/700 | 0)%2 == 0 && this.isActive) {
			this.text = "|";
		} else {
			this.text = "";
		}
		fill(255);
		stroke(0);
		rect(-50,-50,100,100);
		fill(0);
		noStroke();
		textSize(20);
		textAlign(CENTER,TOP);
		text(this.number == undefined ? this.text : this.number + "" +  this.text,0,0);
	}

	setNumber(number) {
		this.number = number;
	}

}
