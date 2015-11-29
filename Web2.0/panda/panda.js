window.onload = function() {
	puzzleList = document.getElementsByClassName("puzzle");
	empty = document.getElementById("sixteenth");
	chk = document.getElementById("switch");
	time = document.getElementById("time");
	var reset = document.getElementById("reset"); 
	statu = "off"; //record the game's statu(on, off, stop, win)
	Pos = ["firstPos", "secondPos", "thirdPos", "fourthPos", 
				"fifthPos", "sixthPos", "seventhPos", "eighthPos", "ninthPos",
				"tenthPos", "eleventhPos", "twelfthPos", "thirteenthPos",
				"fourteenthPos", "fifteenthPos", "sixteenthPos"];
	//record the each puzzleList
	currentPos = [];
	emptyPos = 15;
	var i;

	//set chkbox
	wrapper = document.getElementById("control");
	create();
	chk.className = "replace";
	chkbox = document.getElementsByClassName("chkbox")[0];
	chkbox.addEventListener("click", chkHandler);
	reset.addEventListener("click", resetHandler);
	//add Listern
	for(i = 0; i < puzzleList.length; i++) {
		puzzleList[i].addEventListener("click", puzzleClickHandler);
	}
	//chk.addEventListener("change", );
}

function resetHandler(event) {
	currentPos = [];
	for(var i = 0; i < puzzleList.length; i++) {
		puzzleList[i].className = "puzzle " + Pos[i];
	}
	empty.className = "empty sixteenthPos";
	statu = "off";
	clearInterval(timeID);
	time.value = "0";
	if(chkbox.className === "chkbox on") {
		chkbox.className = "chkbox";
	}
}

function init() {
	//determine the pos is taken up;
	//0<= math.random() < 1
	//to avoid the user's speed to fast
	lastTime = new Date().getTime();

	time.value = "0";
	var flag = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
	var i;
	var max = puzzleList.length + 1;
	var temp = Math.floor(Math.random() * max); //0-15
	empty.className = "empty " + Pos[temp];
	var tempPos = Pos.indexOf(Pos[temp]);
	emptyPos = tempPos;
	flag[temp] = true;
	for(i = 0; i < puzzleList.length; i++) {
		temp = Math.floor(Math.random()* max);
		while(flag[temp] != false) {
			temp = (temp + 1) % max;
		}
		puzzleList[i].className = "puzzle " + Pos[temp];
		flag[temp] = true;
		tempPos = Pos.indexOf(Pos[temp])
		currentPos[i] = tempPos;
	}
}

function exchangePos(first, second) {
	/* @first   the puzzle
	   @second  the empty
	 */
	var firstPos = first.className.substring(7);
	var secondPos = second.className.substring(6);
	first.className = "puzzle " + secondPos;
	second.className = "empty " + firstPos;
}

function puzzleClickHandler(event) {
	if(statu === "off") {
		alert("Please click the Swtich button to start the game");
		return;
	}
	if(statu === "win") {
		if(confirm("You win.Would you like to play again?")) {
			init();
		}
		return;
	}
	if(statu === "stop") {
		alert("The game is stopping, please click the switch to start");
		return;
	}
	var tempList = Array.prototype.slice.call(puzzleList);
	var tempPuzzle = tempList.indexOf(event.target);
	var tempPos = currentPos[tempPuzzle]; //record the event.target's position
	emptyNeighbor = getNeighbor(empty);
	if(emptyNeighbor.indexOf(tempPos) !== -1) {
		currentPos[tempPuzzle] = emptyPos;
		emptyPos = tempPos;
		exchangePos(event.target, empty);
	}
	//determine the game win or not
	win();
}

function win() {
	for(var i = 0; i < currentPos.length; i++) {
		if(currentPos[i] !== i)
			return;
	}
	statu = "win";
	clearInterval(timeID);
	if(confirm("You win.Would you like to play again?")) {
		init();
		return;
	}
	statu = "off";
}

function getNeighbor(node) {
	var tempPos = emptyPos;
	var neighbor = [];
	var x = [-1, 1, -4, 4];
	var j = 0;
	var temp;
	for(var i = 0; i < 4; i++) {
		temp = tempPos + x[i];
		if(temp >= 0 && temp <= 15) {
			if((x[i] === 1 || x[i] === -1) && (Math.floor(temp / 4) != Math.floor(tempPos / 4))) {
				continue;
			} 
			neighbor[j++] = temp;
		}
	}
	return neighbor;
}


//move the checkbox and radio out of the page and replace the new page
function create() {
	var label = document.createElement("label");
	label.setAttribute("for", "switch");
	label.setAttribute("class", "chkbox");
	var yes = document.createElement("span");
	var on = document.createTextNode("ON");
	yes.appendChild(on);
	yes.setAttribute("class", "yes");
	var no = document.createElement("span");
	var off = document.createTextNode("STOP");
	no.appendChild(off);
	no.setAttribute("class", "no");
	var toggle = document.createElement("span");
	toggle.setAttribute("class", "toggle");
	label.appendChild(yes);
	label.appendChild(no);
	label.appendChild(toggle);
	wrapper.insertBefore(label, chk);
}

function chkHandler(event) {
	if(chkbox.className == "chkbox") {
		chkbox.className = "chkbox on";
	} else {
		chkbox.className = "chkbox";
	}
	if(statu === "off") {
		init();
		statu = "on";
		timeID = setInterval(timeHandler,1000);
	} else if(statu === "stop") {
		statu = "on";
		timeID = setInterval(timeHandler,1000);
	} else if(statu === "on") {
		statu = "stop";
		clearInterval(timeID);
	} else {
		//statu ==== "win"
		if(confirm("Play again?")) {
			resetHandler();
		}
	}
}

function timeHandler() {
	var currentTime = parseInt(time.value);
	time.value = (currentTime + 1).toString();
}

document.onselectstart = function() {
    return false;
}
