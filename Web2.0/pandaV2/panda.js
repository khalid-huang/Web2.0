$(function() {
	empty = document.getElementById("sixteenth");
	chk = document.getElementById("switch");
	time = document.getElementById("time");
	statu = "off"; //record the game's statu(on, off, stop, win)
	Pos = ["firstPos", "secondPos", "thirdPos", "fourthPos", "fifthPos", "sixthPos", "seventhPos", "eighthPos", "ninthPos","tenthPos", "eleventhPos", "twelfthPos", "thirteenthPos","fourteenthPos", "fifteenthPos", "sixteenthPos"];
	currentPos = []; //record the puzzle current pos
	emptyPos = 15; //record the empty pos
	create();
	chk.className = "replace";
	chkbox = document.getElementById("chkbox");
	puzzlePic = "panda";
	puzzleList = $('.puzzle');
	$("#chkbox").click(chkHandler);
	$("#reset").click(resetHandler);
	$('.puzzle').click(puzzleClickHandler);
	$(".srcImg").click(selectImgHandler);
	$("#see_pic").mousedown(seePicHandler);
});

function seePicHandler(event) {
	$('#srcImg').attr('src', puzzlePic+".jpg");

}

function selectImgHandler(event) {
	if(statu === "on") {
		if(!confirm("Are you sure give up the current game to change a new pic")) {
			return;
		}
	}
	className = event.target.getAttribute('bc');
	if(puzzleList[0].className.indexOf(className) === -1) {
		_.times(puzzleList.length, function(i) {changeImg(puzzleList[i], className);});
	}
	puzzlePic = className;
	resetHandler();
}

function changeImg(value, className) {
	value.className = value.className.replace(/panda|beauty/, className);
}

function resetHandler(event) {
	currentPos = [];
	_.times(puzzleList.length, function(i) {puzzleList[i].className = "puzzle " + Pos[i] + " "+ puzzlePic;});
	empty.className = "empty sixteenthPos";
	statu = "off";
	try {
		clearInterval(timeID);
	} catch(error){}
	time.value = "0";
	if(chkbox.className === "chkbox on") {
		chkbox.className = "chkbox";
	}
}

function init() {
	lastTime = new Date().getTime();
	statu = "off";
	time.value = "0";
	puzzleRandom();
}

function puzzleRandom() {
	var flag = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
	randomOne(empty,flag, 0);
	for(var i = 0, len = puzzleList.length; i < len; i++) {
		randomOne(puzzleList[i], flag, i);
	}
}

function randomOne(puzzle, flag, i) {
	var temp = _.random(puzzleList.length);
	while(flag[temp] !== false) {
		temp = (temp + 1) % (puzzleList.length + 1);
	}
	var tempPos = Pos.indexOf(Pos[temp]);
	if(puzzle === empty) {
		emptyPos = tempPos;
		puzzle.className = "empty " + Pos[temp];
	} else {
		puzzle.className = "puzzle " + Pos[temp] + " "+ puzzlePic;
		currentPos[i] = tempPos;
	}
	flag[temp] = true;
}

function puzzleClickHandler(event) {
	if(!ready()) {
		return;
	}
	var tempList = Array.prototype.slice.call(puzzleList);
	var tempPuzzle = tempList.indexOf(event.target);
	var tempPos = currentPos[tempPuzzle]; //record the event.target's position
	emptyNeighbor = getNeighbor(empty);
	if(emptyNeighbor.indexOf(tempPos) !== -1) {
		exchangePos(event.target, Pos[tempPos], empty, Pos[emptyPos]);
		currentPos[tempPuzzle] = emptyPos;
		emptyPos = tempPos;
	}
	win();
}

function exchangePos(first, firstPos, second, secondPos) {
	first.className = "puzzle " + secondPos + " "+ puzzlePic;
	second.className = "empty " + firstPos;
}


function ready() {
	if(statu === "off") {
		alert("Please click the Swtich button to start the game");
		return false;
	}  else if(statu === "stop") {
		alert("The game is stopping, please click the switch to start");
		return false;
	}
	return true;
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
	var tempPos = emptyPos, x = [-1, 1, -4, 4], neighbor = [], temp, i, j=0;
	for(i = 0, j = 0; i < 4; i++) {
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
	var yes = $('<span class="yes">ON</span>');
	var no = $('<span class="no">STOP</span>');
	var toggle = $('<span class="toggle"></span>');
	var label = $('<label for="switch" class="chkbox" id="chkbox"></label>').append(yes).append(no).append(toggle);
	$('#switch').after(label);	
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
	}
}

function timeHandler() {
	var currentTime = parseInt(time.value);
	time.value = (currentTime + 1).toString();
}

document.onselectstart = function() {
    return false;
}
