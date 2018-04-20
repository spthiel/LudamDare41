
var frame;
var screen;

function setup() {
	screen.w = window.innerWidth;
	screen.h = window.innerHeight;
	let canvas = createCanvas(screen.w,screen.h);
	document.getElementsByClassName("placeholder")[0].appendChild(canvas.canvas);
	frame = 0;
}

function getColor(frame) {
	return "hsv(" + frame%360 + ")";
}

function draw() {
	fill(100);
	translate(screen.w/2,screen.h/2);
	textAlign(CENTER,TOP);
	text("Something big will be here (maybe)");
}

window.addEventListener( 'resize', function() {

  setup();

});
