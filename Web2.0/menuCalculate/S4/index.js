$(function() {
	$(".number").fadeOut();
	$(".button").on("click", buttonClickHandler);
	$("#info-bar").on('click', infoBarClickHandler);
	$('#button').on('mouseleave', reset);
	$('#button').on('mouseenter', enter);
	flag = [false, false, false, false, false]; //record the A to B get the num or not
	startAgain = false;
	$('.apb').on('click', robot);
});

function buttonClickHandler(event) {
	//检查是否是可以进行申请随机数
	if(!checkState(this)) {
		event.preventDefault();
		return;
	} 
	disableButton(this);
	queryNum(this);
}

function infoBarClickHandler(event) {
	if($(this).attr('class') === 'enable') {
		$(this).text(getResult());
	} else {
		event.preventDefault();
	}
}

function robot(event) {
	randomArray = getRandomArray(5);
	curPos = 0;
	$($('.button')[randomArray[curPos]]).trigger('click');
}

function reset() {
	$(".number").text("").fadeOut();
	$("#info-bar").text("");
	changeState($("#info-bar"), 'enable', 'disable');
	$('.button').each(function() {
		changeState(this, 'disable', 'enable');
	});
	for(var i = 0, len=flag.length; i < len; i++) {
		flag[i] = false;
	}
	randomArray = [];
	curPos = 0;
	startAgain = true;
}

function enter() {
	startAgain = false;
}

function getResult() {
	var sum = 0;
	$('.number').each(function() {
		console.log($(this).text());
		sum = sum + parseInt($(this).text());
	});
	return sum;
}

function checkState(target) {
	var index = Array.prototype.slice.call($('.button')).indexOf(target);
	if(flag[index] === false && ($(target).attr('class').indexOf('enable') !== -1)) {
		return true;
	} else {
		return false;
	}
}

function disableButton(target) {
	$('.button').each(function() {
		var index = Array.prototype.slice.call($('.button')).indexOf(this);
		if(this !== target && flag[index] === false) {
			changeState(this, 'enable', 'disable');
		}
	});
}

function changeButtonStatus(target) {
	var index = Array.prototype.slice.call($('.button')).indexOf(target);
	flag[index] = true;
	changeState(target, 'enable', 'disable');
	$('.button').each(function() {
		var index = Array.prototype.slice.call($('.button')).indexOf(this);
		if($(this) !== target && flag[index] === false) {
			changeState(this, 'disable', 'enable');
		}
	});
	if(getAllNum()) {
		changeState($('#info-bar'), 'disable', 'enable');
	}
}

function queryNum(target) {
	$(target).find(".number").text("...").fadeIn();
	$.get("random", function(data, success) {
		if(startAgain === false) {
			if(success === 'success') {
				$(target).find(".number").text(data);
				changeButtonStatus(target);
			}
			curPos++;
			if(curPos < $(".button").length) {
				$($('.button')[randomArray[curPos]]).trigger('click');
			} else {
				$('#info-bar').trigger('click');
			}
		} else {
			startAgain = false;
		}
	});
}

function changeState(target, oldStr, newStr) {
	if($(target).attr('class').indexOf(newStr) !== -1) {
		return;
	}
	var newClassName = $(target).attr('class').replace(oldStr, newStr);
	$(target).attr("class", newClassName);
} 

function getAllNum() {
	for(var i = 0, len = flag.length; i < len; i++) {
		if(flag[i] === false) {
			return false;
		}
	}
	return true;
}

document.onselectstart = function() {
    return false;
}

function getRandomArray(num) {
	var array = [];
	for(var i = 0; i < num; i++) {
		temp = getRandomNumber(4);
		while(array.indexOf(temp) !== -1) {
			temp = (temp + 1) % 5;
		}
		array[i] = temp;
	}
	return array;
}

function getRandomNumber(limit) {
  return Math.round(Math.random() * limit);
}