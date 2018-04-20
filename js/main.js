
var frame = 0;
var screen;

function setup() {
	screen.w = window.innerWidth;
	screen.h = window.innerHeight;
	let canvas = createCanvas(screen.w,screen.h);
	document.getElementsByClassName("placeholder")[0].appendChild(canvas.canvas);
}

function getColor(frame) {
	return "hsl(" + (frame%720/2 | 0) + ",100%,50%)";
}

function draw() {
	background(100);
	push();
		fill(getColor(frame));
		textSize(32);
		translate(screen.w/2,screen.h/2);
		textAlign(CENTER,TOP);
		text("Something big will be here (maybe)",0,0);
	pop();
	frame++;
}

window.addEventListener( 'resize', function() {

  setup();

});
