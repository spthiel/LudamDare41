/* click listener for the setup and ingame phase */
window.addEventListener( 'click', e => {
	if(gamestate == "start") {
		if(e.x > screen.w-cellwidth/2*3 && e.x < screen.w-cellwidth/2 && e.y < screen.h-cellwidth/2 && e.y > screen.h-cellwidth) {
			if(grid.checkGrid()) {
				gamestate = "game";
				startTime = Date.now();
				if(activeCell) {
					activeCell.isActive = false;
					activeCell = undefined;
				}
			}
		} else if(e.x > screen.w-cellwidth/2*3 && e.x < screen.w-cellwidth/2 && e.y < screen.h-cellwidth-cellwidth/4 && e.y > screen.h-cellwidth-cellwidth/2-cellwidth/4) {
			grid.foreach(cell => {
				do {
					cell.number = random(highestNumber)+1 | 0
				} while(grid.definedNumbers(cell).includes(cell.number))
			});
		} else {
			if(activeCell) {
				if(grid.definedNumbers(activeCell).includes(activeCell.number)) {
					activeCell.number = 0;
					activeCell.state = 1;
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

/* key listener in startup phase for numberkeys and everywhere for esc/backspace to return to menu*/
window.onkeyup = e => {
	var key = e.keyCode ? e.keyCode : e.which;
	if(gamestate == "start") {
		if(96 <= key && 105 >= key && activeCell) {
			let entered = key-96;
			let currentNumber = activeCell.number;
			currentNumber = currentNumber*10+entered;
			if(currentNumber > highestNumber) {
				currentNumber = highestNumber;
			}
			activeCell.number = currentNumber;
		} else if(48 <= key && 57 >= key && activeCell) {
			let entered = key-48;
			let currentNumber = activeCell.number;
			currentNumber = currentNumber*10+entered;
			if(currentNumber > highestNumber) {
				currentNumber = highestNumber;
			}
			activeCell.number = currentNumber;
		} else if(8 == key && activeCell) {

			let currentNumber = activeCell.number;
			currentNumber = currentNumber/10 | 0;
			activeCell.number = currentNumber;

		} else if(13 == key && activeCell) {
			if(grid.definedNumbers(activeCell).includes(activeCell.number)) {
				activeCell.number = 0;
				activeCell.state = 1;
			}
			activeCell.isActive = false;
			activeCell = undefined
		} else if(82 == key) {
			grid.foreach(cell => {
				do {
					cell.number = random(highestNumber)+1 | 0
				} while(grid.definedNumbers(cell).includes(cell.number))
			});
		} else if(84 == key) {
			let i = 1;
			grid.foreach(cell => {
				cell.number = i;
				i++;
			});
		}
	} else if(key == 27 || key == 8) {
		gamestate = "menu";
	}
}

/* resize listener */
window.addEventListener( 'resize', function() {

  setup();

});

/* click listern for main menu */
window.addEventListener( 'click', e => {
	let x = e.x;
	let y = e.y;
	if(gamestate == "menu") {
		if(x > screen.w/2-3*cellwidth && x < screen.w/2+3*cellwidth) {
			if(y > screen.h/2-2*cellwidth-cellwidth/4-cellwidth/8 && y < screen.h/2-cellwidth-cellwidth/4-cellwidth/8) {
				setupGame(1);
			} else if(y > screen.h/2-cellwidth-cellwidth/8 && y < screen.h/2-cellwidth/8) {
				setupGame(2);
			} else if(y < screen.h/2+cellwidth+cellwidth/8 && y > screen.h/2+cellwidth/8) {
				setupGame(3);
			} else if(y < screen.h/2+2*cellwidth+cellwidth/4+cellwidth/8 && y > screen.h/2+cellwidth+cellwidth/4+cellwidth/8) {
				gamestate = "options";
			}
		}
	}
});

/* hover events for main menu */
window.addEventListener( 'mousemove', e => {
	let x = e.x;
	let y = e.y;
	if(gamestate == "menu") {
		if(x > screen.w/2-3*cellwidth && x < screen.w/2+3*cellwidth) {
			if(y > screen.h/2-2*cellwidth-cellwidth/4-cellwidth/8 && y < screen.h/2-cellwidth-cellwidth/4-cellwidth/8) {
				hover = 0;
			} else if(y > screen.h/2-cellwidth-cellwidth/8 && y < screen.h/2-cellwidth/8) {
				hover = 1;
			} else if(y < screen.h/2+cellwidth+cellwidth/8 && y > screen.h/2+cellwidth/8) {
				hover = 2;
			} else if(y < screen.h/2+2*cellwidth+cellwidth/4+cellwidth/8 && y > screen.h/2+cellwidth+cellwidth/4+cellwidth/8) {
				hover = 3;
			} else {
				hover = -1;
			}
		}
	}
});
