$(document).ready(function() {
	$("input[type=text]").on("blur", inputBlurHandler);
	$("input[type=text]").on("click", inputClickHandler);
	$("input[type=password]").on("blur", inputBlurHandler);
	$("input[type=password]").on("click", inputClickHandler);
	$("input[type=reset]").on("click", resetClickHandler);
	$("#signup").on("submit", submitHandler);
});

function inputBlurHandler(event) {
	if(checkForm(event)){
		if(event.target.name !== "password" && event.target.name !== "repeatedPassword")
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
	//$('input[type=text]').blur(); //异步的操作真是够坑的，blur里面有一个post的操作的，我选择go die
	if(!validator.isFormValid()) {
		event.preventDefault();
		alert("Please ensure your information is in right form and not repeated");	
	}
}

function inputClickHandler(event) {
	$("#"+event.target.name+"Error").fadeOut();
	$("#"+event.target.name+"Error").text("");
}

function isRepeated(event) {
	if(event.target.value !== "") {
		var obj = {}
		obj.field = event.target.name;
		obj[event.target.name] = event.target.value;
		$.post("/repeated", obj, function(data) {
			var error = $.parseJSON(data);
			console.log(error);
			if(error !== "") {
				$("#"+event.target.name+"Error").text(error);
				$("#"+event.target.name+"Error").fadeIn();
				validator.form[event.target.name].status = false;
			} else {
				$("#"+event.target.name+"Error").fadeOut();
				$("#"+event.target.name+"Error").text("");
			}
		});
	}
}

function checkForm(event) {
	if(validator.isFieldValid(event.target.name, event.target.value)) {
		$("#"+event.target.name+"Error").fadeOut();
		$("#" + event.target.name+"Error").text("");
		return true;
	} else {
		return false;
	}
}


function showFormError(event) {
	var error = "", name = event.target.name, value = event.target.value;
	error = getError(value, name);
	$("#"+name+"Error").text(error);
	$("#"+name+"Error").fadeIn();
}

function getError(value, name) {
	var error = "";
	if(value === "" || value === null) {
		error = "必填项目"
	} else {
		error = validator.form[name].errorMessage;
	}
	return error;
}