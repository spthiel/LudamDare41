
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
		fill(0);
		noStroke();
		textSize(cellwidth*4);
		textAlign(CENTER,BOTTOM);
		if(number == 0 || !number) {
			newNumber();
		}
		text((number ? number : 0),0,0);
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
		fill(0);
		noStroke();
		textSize(cellwidth/2);
		textAlign(CENTER,CENTER);
		text("Enter your bingo numbers below\n(1 to " + highestNumber + ")",0,0);
	pop();
	push();
		translate(screen.w-cellwidth,screen.h-cellwidth/2-cellwidth/4);
		rect(-cellwidth/2,-cellwidth/4,cellwidth,cellwidth/2);
		textSize(cellwidth/4);
		textAlign(CENTER,CENTER);
		text("START",0,0);
	pop();
	push();
		translate(screen.w-cellwidth,screen.h-cellwidth-cellwidth/2);
		rect(-cellwidth/2,-cellwidth/4,cellwidth,cellwidth/2);
		textSize(cellwidth/4);
		textAlign(CENTER,CENTER);
		text("RAN",0,0);
	pop();
	grid.drawAll();

}

var statstext = "Score: $score\nLevel: $level\nHealth: $health\nKills: $kills\nTime: $time";

function updateWin() {
	push();
		translate(screen.w/2,screen.h/2-cellwidth);
		fill(0);
		noStroke();
		textSize(cellwidth);
		textAlign(CENTER,BOTTOM);
		text("Congratulations, you won!",0,0);
		textAlign(LEFT,TOP);
		translate(-250,0);
		textSize(cellwidth/2);
		let formattime = formatTime(endTime-startTime);
		let t = statstext.replace("$score",(score/100 | 0)).replace("$level","" + diffToLevel()).replace("$health",health).replace("$kills",kills).replace("$time",formattime);
		text(t,0,0);
	pop();
}

function updateLose() {
	push();
		translate(screen.w/2,screen.h/2-cellwidth);
		fill(0);
		noStroke();
		textSize(cellwidth);
		textAlign(CENTER,BOTTOM);
		text("Congratulations, you won!",0,0);
		textAlign(LEFT,TOP);
		translate(-250,0);
		textSize(cellwidth/2);
		let formattime = formatTime(endTime-startTime);
		let t = statstext.replace("$score",(score/100 | 0)).replace("$level","" + diffToLevel()).replace("$health",health).replace("$kills",kills).replace("$time",formattime);
		text(t,0,0);
	pop();
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
