var errorTol = 50;

class QuickReactions {

	constructor(x,y) {
		this.timestart = Date.now();
		this.x1 = x-cellwidth/2;
		this.y1 = y-cellwidth/2;
		this.x2 = this.x1+cellwidth;
		this.y2 = this.y1+cellwidth;
		this.isDead = false;
		this.deg = random(20)-10;
		if(this.deg < 0)
			this.deg += 360;
	}

	draw() {
		if(maxtimetoclick-((Date.now()-this.timestart)*difficulty) < 0) {
			this.isDead = true;
			health--;
			if(health == 0) {
				endGame();
			}
		}
		push();
			//rotate(this.deg);
			push();
				fill(0,255,0);
				noStroke();
				rect(this.x1,this.y1,cellwidth,cellwidth,cellwidth/5,cellwidth/5);
			pop();
			push();
				noFill();
				stroke('rgba(0,0,200,.5)');
				let radius = cellwidth/3-cellwidth/3*((Date.now()-this.timestart)*difficulty/maxtimetoclick);
				rect(this.x1-radius,this.y1-radius,cellwidth+2*radius,cellwidth+2*radius,cellwidth/5,cellwidth/5);
			pop();
		pop();
	}


	onClick(x,y) {

		if(x > this.x1-errorTol && x < this.x2+errorTol && y > this.y1-errorTol && y < this.y2+errorTol) {
			score += maxtimetoclick-((Date.now()-this.timestart)*difficulty)
			this.isDead = true;
			kills++;
			removeNumber();
		}
	}

}
