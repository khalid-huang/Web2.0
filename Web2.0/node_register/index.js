$(document).ready(function() {
	$("input[type=text]").on("blur", inputBlurHandler);
	$("input[type=text]").on("click", inputClickHandler);
	$("input[type=reset]").on("click", resetClickHandler);
	$("form").on("submit", submitHandler);
});

var Regexs = {
	'username'	: /^[a-zA-Z]\w{5,17}$/,
	'number'	: /^[1-9]\d{7}$/,
	'phone'		: /^[1-9]\d{10}$/,
	'email'		: /^[a-zA-Z_\-]+@(([a-zA-Z0-9_\-])+\.)+[a-zA-Z]{2,4}$/
}

function inputBlurHandler(event) {
	if(checkForm(event)){
		isRepeated(event);
	} else {
		showFormError(event);
	}
}

function resetClickHandler(event) {
	$(".error").fadeOut();
	$(".error").text("");
}

function submitHandler(event) {
	var tempArray = $("input[type=text]");
/*	console.log(tempArray.length);*/
	for(var i=0, len = tempArray.length; i < len; i++) {
		if(!isValidFormForsubmit(tempArray[i]) || isRepeatedForSubmit(tempArray[i])) {
			event.preventDefault();
			alert("Please ensure your information is in right form and not repeated");
			return;
		}
	}
}

function inputClickHandler(event) {
	$("#"+event.target.name+"Error").fadeOut();
	$("#"+event.target.name+"Error").text("");
}

function isRepeated(event) {
	if(event.target.value !== "") {
		var obj = {}
		obj[event.target.name] = event.target.value;
		$.post("/", obj, function(data) {
			var error = $.parseJSON(data);
			if(error !== "") {
				$("#"+event.target.name+"Error").text(error);
				$("#"+event.target.name+"Error").fadeIn();
			} else {
				$("#"+event.target.name+"Error").fadeOut();
				$("#"+event.target.name+"Error").text("");
			}
		});
	}
}

function checkForm(event) {
	var regex = Regexs[event.target.name];
	if(regex.test(event.target.value)) {
		$("#"+event.target.name+"Error").fadeOut();
		$("#" + event.target.name+"Error").text("");
		return true;
	} else {
		return false;
	}
}
//针对于submit的checkForm
function isValidFormForsubmit(target) {
	var regex = Regexs[target.name];
	if(regex.test(target.value)) {
		return true;
	} else {
		return false;
	}
}

function isRepeatedForSubmit(target) {
	var name = target.name, value = target.value;
	var obj = {}, flag = false;
	obj[name] = value;
	//变为同步post请求，重要的一步。
	$.ajaxSetup({
		async: false
	});
	$.post("/", obj, function(data) {
		var error = $.parseJSON(data);
		console.log(error);
		if(error !== "") {
			flag = true;
		} else {
			flag = false;
		}
	});
	console.log(flag);
	return flag;
}

function showFormError(event) {
	var regex= Regexs[event.target.name];
	var error = "", name = event.target.name, value = event.target.value;
	error = getError(value, name);
	$("#"+name+"Error").fadeIn();
	$("#"+name+"Error").text(error);
}

function getError(value, name) {
	var error = "";
	if(value === "" || value === null) {
		error = "必填项目"
	} else {
		if(name === "username") {
			error = "用户名6~18位英文字母、数字或下划线，必须以英文字母开头"
		} else if(name === "number") {
			error = "学号8位数字，不能以0开头";
		} else if(name === "phone") {
			error = "电话11位数字，不能以0开头";
		} else if(name === "email") {
			error = "请填写正确格式的邮箱";
		}
	}
	return error;
}