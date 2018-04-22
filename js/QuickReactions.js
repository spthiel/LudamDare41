/* distance around the object where the click still counts in pixel */
var errorTol = 50;

/* class for the reactions */
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

	/* draws the reaction */
	draw() {
		if(maxtimetoclick-((Date.now()-this.timestart)*difficulty) < 0) {
			this.isDead = true;
			screenshake();
			if(difficultyGame != "easy") {
				health--;
				if(health == 0) {
					endGame();
				}
			} else {
				health++;
			}
		}
		push();
			//rotate(this.deg);
			push();
				fill(200);
				noStroke();
				rect(this.x1,this.y1,cellwidth,cellwidth,cellwidth/5,cellwidth/5);
			pop();
			push();
				fill("rgba(255,255,255,.1)");
				stroke('rgba(255,255,255,.7)');
				let radius = cellwidth/3-cellwidth/3*((Date.now()-this.timestart)*difficulty/maxtimetoclick);
				rect(this.x1-radius,this.y1-radius,cellwidth+2*radius,cellwidth+2*radius,cellwidth/5,cellwidth/5);
			pop();
		pop();
	}

	/* checks if the click was on the object if yes kill the object */
	onClick(x,y) {

		if(x > this.x1-errorTol && x < this.x2+errorTol && y > this.y1-errorTol && y < this.y2+errorTol) {
			score += maxtimetoclick-((Date.now()-this.timestart)*difficulty)
			//registerParticles(new Shockwave((this.x1+this.x2)/2,(this.y1+this.y2)/2,cellwidth/10,cellwidth*2,200,255,255,255));
			registerParticles(new Explosion((this.x1+this.x2)/2,(this.y1+this.y2)/2,100,600,255,255,255,6,0.02,cellwidth/2,cellwidth/2));
			this.isDead = true;
			kills++;
			removeNumber();
		}
	}

}
