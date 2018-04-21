class BgGrid {

	constructor(fwidth,fheight,spacing,borderwidth) {

		console.log(borderwidth);

		this.grid = [];

		this.width = fwidth/spacing | 0;
		this.height = fheight/spacing | 0;

		this.width += 5;
		this.height += 5;

		if(this.width%2 == 0)
			this.width--;
		if(this.height%2 == 0)
			this.height--;
		this.center = {x:(this.width-1)/2,y:(this.height-1)/2};
		for(let x = 0; x < this.width; x++) {
			this.grid[x] = [];
			for(let y = 0; y < this.height; y++) {
				this.grid[x][y] = new BgCell(this.transmuteX(x,true),this.transmuteY(y,true),spacing,borderwidth,this);
			}
		}
	}

	transmuteX(x,direction) {
		return x-(this.center.x * (direction ? 1 : -1));
	}

	transmuteY(y,direction) {
		return y-(this.center.y * (direction ? 1 : -1));
	}

	foreach(callback) {
		for(let x = 0; x < this.width; x++) {
			for(let y = 0; y < this.height; y++) {
				callback(this.grid[x][y]);
			}
		}
	}

	draw() {
		push();
			translate(screen.w/2,screen.h/2);
			this.foreach(cell => cell.fill());
		pop();
	}

}

class BgCell {
  constructor (x,y,size,border,grid) {
    this.grid = grid;
    this.x = x;
    this.y = y;
    this.border = border;
    this.rx = x*size;
    this.ry = y*size;
    this.size = size;
    this.isSet = false;
  }

  fill(color,b,g,a) {
    let red = map(Math.abs(this.x),0,bg.center.x,100,0);
    let blue = map(Math.abs(this.y),0,bg.center.y,100,0);
	let green = map(red,0,150,0,20)
    let c = [red,green,blue];
    push()
      translate(this.rx,this.ry);
      fill(c);
      noStroke();
      let offset = this.size/2-this.border/2;
      let size = this.size-this.border;
      rect(-offset,-offset,size,size);
    pop()
  }

}
