var particles = [];

function updateParticles() {

	for(let i = 0; i < particles.length; i++) {

		if(particles[i].isDead) {
			particles.splice(i,1);
			i--;
		} else {
			particles[i].update();
		}
	}

}

function registerParticles(particle) {
	particles[particles.length] = particle;
}

function clearParticles() {
	particles = [];
}

class Shockwave {

	constructor(x,y,minradius,maxradius,time,r,g,b) {
		this.minradius = minradius;
		this.maxradius = maxradius;
		this.color = [r,g,b,255];
		this.time = time;
		this.start = Date.now();
		this.x = x;
		this.y = y;
		this.isDead = false;
	}

	update() {
		let currentradius = (Date.now()-this.start)/this.time*(this.maxradius-this.minradius)+this.minradius;
		if(currentradius > this.maxradius)
			this.isDead = true;
		push();
			noFill();
			translate(this.x,this.y);
			strokeWeight(2);
			this.color[3]=255;
			stroke(this.color);

			ellipse(0,0,currentradius);

			let iteration = 0;
			let count = 10;
			strokeWeight(1);
			for(let i = currentradius; iteration < count && i > this.minradius;i-= 2) {
				let opacity = (count-float(iteration))/30.0*255;
				this.color[3] = opacity;
				stroke(this.color)
				ellipse(0,0,i);
				iteration++;
			}

		pop();
	}
}

var gravity = 0.05;

class Explosion {

	constructor(x,y,amount,time,r,g,b,speed,gravity,dx,dy) {
		this.color = [r,g,b,255];
		this.start = Date.now();
		this.time = time;
		this.x = x;
		this.y = y;
		this.amount = amount;
		this.speed = speed;
		this.gravity = gravity;
		this.particles = [];
		for(let i = 0; i < amount; i++) {
			let rx = this.x+random(2*dx)-dx;
			let ry = this.y+random(2*dy)-dy;
			let vx = random(2)-1;
			let vy = random(2)-1;
			if(vx*vx+vy*vy >= 1 && vx+vy != 0) {
				vx = vx/(vx*vx+vy*vy);
				vy = vy/(vy*vy+vx*vx);
			}
			this.particles[this.particles.length] = {x:rx,y:ry,vx:vx,vy:vy};
		}
		this.isDead = false;;
	}

	update() {
		let opacity = (1-(Date.now()-this.start)/this.time)*255;
		if(opacity < 0) {
			this.isDead = true;
		}
		this.color[3] = opacity;
		for(let i = 0; i < this.particles.length; i++) {
			let particle = this.particles[i];
			if(this.gravity)
				particle.vy += this.gravity*this.speed;
			particle.x += particle.vx*this.speed;
			particle.y += particle.vy*this.speed;
			push();
				fill(this.color);
				strokeWeight(4);
				stroke(this.color);
				point(particle.x,particle.y);
			pop();
		}
	}

}
