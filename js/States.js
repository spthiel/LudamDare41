
function updateGame() {

	grid.drawAll();

	if(Date.now() - lastReaction > maxspawndelay/difficulty) {
		lastReaction = Date.now();
		spawnRandomReaction();
	}
	difficulty += difficultyIncrease;
	difficultyIncrease += difficultyIncreaseIncrease;
	if(difficultyIncrease > maxdifficultyincrease)
		difficultyIncrease = maxdifficultyincrease;
	if(difficulty > maxdifficulty)
		difficulty = maxdifficulty;

	push();
		translate(screen.w/2,screen.h/2);
		fill(TEXTCOLOR);
		textSize(cellwidth*4);
		textAlign(CENTER,BOTTOM);
		if(number == 0 || !number) {
			newNumber();
		}
		text((number ? number : 0),0,0);
	pop();

	push();
		fill(TEXTCOLOR);
		translate(10,screen.h-10);
		textSize(cellwidth/4);
		textAlign(LEFT,BOTTOM);
		displayscores();
	pop();

	for(let i = 0; i < quickies.length; i++) {
		let reaction = quickies[i];
		if(reaction.isDead) {
			quickies.splice(i,1);
			i--;
		} else {
			reaction.draw();
		}
	}
}

function updateStart() {

	push();
		translate(screen.w/2,screen.h/2-cellwidth);
		fill(TEXTCOLOR);
		noStroke();
		textSize(cellwidth/2);
		textAlign(CENTER,CENTER);
		text("Enter your bingo numbers below\n(1 to " + highestNumber + ")",0,0);
	pop();
	push();
		fill(BUTTONCOLOR);
		translate(screen.w-cellwidth,screen.h-cellwidth/2-cellwidth/4);
		rect(-cellwidth/2,-cellwidth/4,cellwidth,cellwidth/2,5,5);
		fill(BUTTONTEXTCOLOR);
		textSize(cellwidth/4);
		textAlign(CENTER,CENTER);
		text("START",0,0);
	pop();
	push();
		fill(BUTTONCOLOR);
		translate(screen.w-cellwidth,screen.h-cellwidth-cellwidth/2);
		rect(-cellwidth/2,-cellwidth/4,cellwidth,cellwidth/2,5,5);
		fill(BUTTONTEXTCOLOR);
		textSize(cellwidth/4);
		textAlign(CENTER,CENTER);
		text("RAN",0,0);
	pop();
	grid.drawAll();

}

var statstext = "Difficulty: $difficulty\nLevel: $level\nHealth: $health\nKills: $kills\nTime: $time";

function updateWin() {
	push();
		translate(screen.w/2,screen.h/2-cellwidth);
		fill(TEXTCOLOR);
		noStroke();
		textSize(cellwidth/2);
		textAlign(CENTER,BOTTOM);
		text("Congratulations, you won!\n",0,0);
		textAlign(LEFT,TOP);
		translate(-cellwidth*2,0);
		textSize(cellwidth/4);
		displayscores();
	pop();
}

function updateLose() {
	push();
		translate(screen.w/2,screen.h/2-cellwidth);
		fill(TEXTCOLOR);
		noStroke();
		textSize(cellwidth/2);
		textAlign(CENTER,BOTTOM);
		text("The green squares ran you over.\nYou died!\n",0,0);
		textAlign(LEFT,TOP);
		translate(-cellwidth*2,0);
		textSize(cellwidth/4);
		displayscores();
	pop();
}

function updateMenu(hover) {
	push();
		translate(screen.w/2,screen.h/2);
		textAlign(CENTER,CENTER);
		textSize(cellwidth/2);
		stroke(0);
		push();
			fill(BUTTONCOLOR);
			if(hover != undefined && hover == 0) {
				fill(200);
			}
			strokeWeight(3);
			translate(0,-cellwidth*3/2-cellwidth/4-cellwidth/8);
			rect(-3*cellwidth,-cellwidth/2,6*cellwidth,cellwidth,10,10);
			noStroke();
			fill(BUTTONTEXTCOLOR);
			text("EASY",0,0);
		pop();
		push();
			fill(BUTTONCOLOR);
			if(hover != undefined && hover == 1) {
				fill(200);
			}
			strokeWeight(3);
			translate(0,-cellwidth/2-cellwidth/8);
			rect(-3*cellwidth,-cellwidth/2,6*cellwidth,cellwidth,10,10);
			noStroke();
			fill(BUTTONTEXTCOLOR);
			text("MEDIUM",0,0);
		pop();
		push();
			fill(BUTTONCOLOR);
			if(hover != undefined && hover == 2) {
				fill(200);
			}
			strokeWeight(3);
			translate(0,cellwidth/2+cellwidth/8);
			rect(-3*cellwidth,-cellwidth/2,6*cellwidth,cellwidth,10,10);
			noStroke();
			fill(BUTTONTEXTCOLOR);
			text("INSANE",0,0);
		pop();
		push();
			fill(BUTTONCOLOR);
			if(hover != undefined && hover == 3) {
				fill(200);
			}
			strokeWeight(3);
			translate(0,cellwidth*3/2+cellwidth/4+cellwidth/8);
			rect(-3*cellwidth,-cellwidth/2,6*cellwidth,cellwidth,10,10);
			noStroke();
			fill(BUTTONTEXTCOLOR);
			text("OPTIONS",0,0);
		pop();

	pop();
}

function updateResizePls() {
	push();
		background(0);
		fill([255,255,0]);
		textSize(cellwidth/4);
		textAlign(CENTER,CENTER);
		translate(screen.w/2,screen.h/2);
		text("I'm afraid to tell you,\nthat I need at least a resolution of\n800x800\nto render the game at a decent quality.\nSorry :(",0,0);
	pop();
}

// CUSTOM FUNCTIONS

function displayscores() {
	let timeto = endTime;
	if(!timeto)
		timeto = Date.now();
	let formattime = formatTime(timeto-startTime);
	let t = statstext.replace("$score",(score/100 | 0)).replace("$level","" + diffToLevel()).replace("$health",health).replace("$kills",kills).replace("$time",formattime).replace("$difficulty",difficultyGame);
	if(difficultyGame == "easy") {
		t = t.replace("Health","Amount of Damage received");
	}
	text(t,0,0);
}

function diffToLevel() {
	return (6.188*(difficulty-1)*(difficulty-1)+1) | 0;
}

function formatTime(timedif) {
	let ms = timedif%1000;
	timedif = (timedif-timedif%1000)/1000;
	let s = timedif%60;
	timedif = (timedif-timedif%60)/60;
	let m = timedif;
	if(ms < 10) {
		ms = "00" + ms;
	} else if(ms < 100) {
		ms = "0" + ms;
	}
	if(s < 10) {
		s = "0" + s;
	}
	return m + ":" + s +"." + ms;
}
