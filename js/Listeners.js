
window.addEventListener( 'click', e => {
	if(gamestate == "start") {
		if(e.x > screen.w-cellwidth/2*3 && e.x < screen.w-cellwidth/2 && e.y < screen.h-cellwidth/2 && e.y > screen.h-cellwidth) {
			gamestate = "game";
			startTime = Date.now();
			if(activeCell) {
				activeCell.isActive = false;
				activeCell = undefined;
			}
		} else if(e.x > screen.w-cellwidth/2*3 && e.x < screen.w-cellwidth/2 && e.y < screen.h-cellwidth-cellwidth/4 && e.y > screen.h-cellwidth-cellwidth/2-cellwidth/4) {
			grid.foreach(cell => {
				do {
					cell.number = random(highestNumber) | 0
				} while(grid.definedNumbers(cell).includes(cell.number))
			});
		} else {
			if(activeCell) {
				if(grid.definedNumbers(activeCell).includes(activeCell.number)) {
					activeCell.number = 0;
				}
				activeCell.isActive = false;
			}
			let cell = grid.getCell(e.x,e.y);
			if(cell != null) {
				cell.isActive = true;
				activeCell = cell;
			} else {
				activeCell = undefined;
			}
		}
	} else if(gamestate == "game") {

		for(let i = 0; i < quickies.length; i++) {
			let reaction = quickies[i];
			if(reaction.isDead) {
				quickies.splice(i,1);
				i--;
			} else {
				reaction.onClick(e.pageX,e.pageY);
			}
		}
		let cell = grid.getCell(e.x,e.y);
		if(cell != null) {
			if(cell.number == number) {
				cell.state = 2;
				possibleNumbers.splice(possibleNumbers.indexOf(number),1);
				let end = grid.checkDone();
				if(end) {
					gamestate = "win";
					endTime = Date.now();
				}
			}
			newNumber();
		}
	}
});

window.onkeyup = e => {
	if(gamestate == "start" && activeCell) {
		var key = e.keyCode ? e.keyCode : e.which;
		if(48 <= key && 57 >= key && gamestate == "start" && activeCell) {
			let entered = key-48;
			let currentNumber = activeCell.number;
			currentNumber = currentNumber*10+entered;
			if(currentNumber > highestNumber) {
				currentNumber = highestNumber;
			}
			activeCell.number = currentNumber;
		} else if(8 == key && gamestate == "start" && activeCell) {

			let currentNumber = activeCell.number;
			currentNumber = currentNumber/10 | 0;
			activeCell.number = currentNumber;

		} else if(13 == key && gamestate == "start" && activeCell) {
			if(grid.definedNumbers(activeCell).includes(activeCell.number)) {
				activeCell.number = 0;
			}
			activeCell.isActive = false;
			activeCell = undefined
		}
	}
}

window.addEventListener( 'resize', function() {

  setup();

});
