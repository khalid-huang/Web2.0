$(function() {
	$(".number").fadeOut();
	$(".button:nth-child(1)").on("click", aButtonClickHandler);
	$(".button:nth-child(2)").on("click", bButtonClickHandler);
	$(".button:nth-child(3)").on("click", cButtonClickHandler);
	$(".button:nth-child(4)").on("click", dButtonClickHandler);
	$(".button:nth-child(5)").on("click", eButtonClickHandler);
	$("#info-bar").on('click', infoBarClickHandler);
	$('#button').on('mouseleave', reset);
	$('#button').on('mouseenter', enter);
	$('.apb').on('click', robot);
});

function aButtonClickHandler(event) {
	//检查是否是可以进行申请随机数
	var sum = arguments[1];
	var callback = arguments[2];
	disableButton(this);
	queryNum(this, sum, callback);
}

function bButtonClickHandler(event) {
	//检查是否是可以进行申请随机数
	var sum = arguments[1];
	var callback = arguments[2];
	disableButton(this);
	queryNum(this, sum, callback);
}


function cButtonClickHandler(event) {
	//检查是否是可以进行申请随机数
	var sum = arguments[1];
	var callback = arguments[2];
	disableButton(this);
	queryNum(this, sum, callback);
}


function dButtonClickHandler(event) {
	//检查是否是可以进行申请随机数
	var sum = arguments[1];
	var callback = arguments[2];
	disableButton(this);
	queryNum(this, sum, callback);
}


function eButtonClickHandler(event) {
	//检查是否是可以进行申请随机数
	var sum = arguments[1];
	var callback = arguments[2];
	disableButton(this);
	queryNum(this, sum, callback);
}


function infoBarClickHandler(event) {
	changeState($('#info-bar'), 'disable', 'enable');
	$(this).text(arguments[1]);
	showMessage(this, arguments[1]);
	event.preventDefault();
}

function robot(event) {
	var randomArray = getRandomArray(5);
	var callbacks = [];
	for(var i = 0, len = randomArray.length; i < len-1; i++) {
		(function(i) {
			callbacks[i] = function(err, sum) {
				var index = randomArray[i+1] + 1;
				$(".button:nth-child("+index+")").trigger('click',[sum, callbacks[i+1]]);
			}
		})(i);
	}
	callbacks[randomArray.length-1] = function(err, sum) {
		$("#info-bar").trigger('click', sum);
	}
	var index = randomArray[0] + 1;
	$(".button:nth-child("+ index +")").trigger('click', [0, callbacks[0]]);
}

function reset() {
	$(".number").text("").fadeOut();
	$("#info-bar").text("");
	changeState($("#info-bar"), 'enable', 'disable');
	$('.button').each(function() {
		changeState(this, 'disable', 'enable');
	});
	$("#message").fadeOut();
	$(".button:nth-child(1)").off("click");
	$(".button:nth-child(2)").off("click");
	$(".button:nth-child(3)").off("click");
	$(".button:nth-child(4)").off("click");
	$(".button:nth-child(5)").off("click");
	//淡出效果
	setTimeout(empty, 1000);
}

function empty() {
	$('#message').css("display", "none");
}

function enter() {
	$(".button:nth-child(1)").on("click", aButtonClickHandler);
	$(".button:nth-child(2)").on("click", bButtonClickHandler);
	$(".button:nth-child(3)").on("click", cButtonClickHandler);
	$(".button:nth-child(4)").on("click", dButtonClickHandler);
	$(".button:nth-child(5)").on("click", eButtonClickHandler);
	$('#message').empty();
	$('#message').css("display", "block");
	$("#message").fadeIn();
	console.log("haha")
}

function disableButton(target) {
	$('.button').each(function() {
		var index = Array.prototype.slice.call($('.button')).indexOf(this);
		if(this !== target) {
			changeState(this, 'enable', 'disable');
		}
	});
}

function changeButtonStatus(target) {
	var index = Array.prototype.slice.call($('.button')).indexOf(target);
	changeState(target, 'enable', 'disable');
	$('.button').each(function() {
		var index = Array.prototype.slice.call($('.button')).indexOf(this);
		if($(this) !== target) {
			changeState(this, 'disable', 'enable');
		}
	});
}

function queryNum(target, sum, callback) {
	$(target).find(".number").text("...").fadeIn();
	$.get("random", function(data) {
		$(target).find(".number").text(data);
		sum += parseInt(data);
		changeButtonStatus(target);
		try{
			throwError(target, sum);
			showMessage(target);
		} catch(err) {
			showErrorMessage(err)
		}
		callback(null, sum);
	});
}

function showMessage(target, sum) {
	if($(target).attr('id') === "info-bar") {
		console.log(target);
		var message = $("<p>大气泡：楼主异步调用战斗力感人，目测不超过" + sum + "</p>");
		$('#message').append(message);
		return;
	}
	var index = Array.prototype.slice.call($('.button')).indexOf(target);
	var messages = {
		0 : 'A：这是个天大的秘密',
		1 : 'B：我不知道',
		2 : 'C：你不知道',
		3 : 'D：他不知道',
		4 : 'E：才怪'
	};
	var message = $("<p>"+messages[index]+"</p>");
	$('#message').append(message);
}

function changeState(target, oldStr, newStr) {
	if($(target).attr('class').indexOf(newStr) !== -1) {
		return;
	}
	var newClassName = $(target).attr('class').replace(oldStr, newStr);
	$(target).attr("class", newClassName);
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

function throwError(target, sum) {
	var i = getRandomNumber(2);
	if(i == 1) {
		var index = Array.prototype.slice.call($('.button')).indexOf(target);
		var messages = {
			0 : 'A：这不是个天大的秘密',
			1 : 'B：我知道',
			2 : 'C：你知道',
			3 : 'D：他知道',
			4 : 'E：才不怪'
		};
		var obj = {
			message: messages[index],
			curSum : sum
		};
		throw obj;
	}
}

function showErrorMessage(err) {
	var message = $("<p>"+"<b>"+err.message+"</b>"+"</p>").attr("class", "redMessage");
	$('#message').append(message);
}