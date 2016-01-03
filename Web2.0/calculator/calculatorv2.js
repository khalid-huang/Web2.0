window.onload = function () {
	var symbolList = document.getElementsByClassName("symbol");
	var processList = document.getElementsByClassName("process");
	var expression = document.getElementById("expression");
	var flag = false;
	var i;

	//if input the symbol, the reslut should be clear;
	for(i = 0; i < symbolList.length; ++i) {
		symbolList[i].onclick = function(event) {  //不能使用i来索引对象，因为当Onclick事件发生时，i已经都是20了。
			if(flag == true) {
				expression.value = "";
				flag = false;
			}
			var	content = event.target.innerText;
			expression.value = expression.value + content;
		}
	}

	//if input the process, the reslut and be use continue;
	for(i = 0; i < processList.length; ++i) {
		processList[i].onclick = function(event) {
			if(event.target.innerText != "=") {
				flag = false;
				//determine whether input two continues process
				var exp = expression.value;
				var lastChat = exp[exp.length-1];
				if(lastChat == "+" || lastChat == "-" || lastChat == "*" || lastChat == "/") {
					alert("double process symbol");
					return;
				}
				var content = event.target.innerText;
				expression.value = expression.value + content;
			}
		}
	}

	var equal = document.getElementById("equal");
	equal.onclick = function (event) {
		var content = expression.value.toString();
		try {
			var result = eval(content);
			if(result == 'Infinity') {
				throw new Error("May Div zero");
			}
			try {
				expression.value = parseFloat(result.toFixed(8), 10); //to deal with the presision problem;
			} catch (error) {
			}
			flag = true;
		} catch (error) {
			alert(error.message);
		}
	}

	var delOne =  document.getElementById("delOne");
	delOne.onclick = function (event) {
		if(flag == true) {
			expression.value = "";
			flag = false;
		}
		var content = expression.value.toString();
		var len = content.length;
		expression.value = content.substring(0, len-1);
	}


	var delALl = document.getElementById("delAll");
	delALl.onclick = function(event) {
		expression.value = "";
	}
}

function test (input) {
	postfix = toPostfix(input);
	return calculate(postfix);
}

// calculator the postfix expression
function calculate(postfix) {
	var i, item, result;
	var num = [];
	for(i = 0; i < postfix.length; i++) {
		item = parseFloat(postfix[i]);
		if(!isNaN(item)) {
			num.push(item);
		} else {
			second = num.pop();
			first = num.pop();
			switch(postfix[i]) {
				case '+':
					result = first + second;
					num.push(result);
					break;
				case '-':
					result = first - second;
					num.push(result);
					break;
				case '/':
					result = first / second;
					num.push(result);
					break;
				case '*':
					result = first * second;
					num.push(result);
					break;
			}
			//console.log(result);
		}
	}
	result = num.pop();
	result = parseFloat(result.toFixed(8), 10);
	return result;
}


// translate the infix expression to the postfix expression
function toPostfix(infix) {
	//split the input to the token
	var regex = /(\(|\)|\/|\*|\-|\+)/;
	var array= infix.split(regex);
	var i;
	var postfix = [];
	var symbol = [];
	// remove the empty item
	for(i = 0; i < array.length; i++) {
		if(array[i] == "")
			array.splice(i, 1);
	}

	for(i = 0; i < array.length; i++) {
		var item = array[i];
		if(!isNaN(parseFloat(item))) {
			postfix.push(item);
		} else {
			while(symbol.length) {
				if(compare(item, symbol[symbol.length-1])) { //if the item is greater
					break;
				} else {
					postfix.push(symbol.pop());
					/*if(postfix[postfix.length-1] == "(")
						console.log(1);*/
				}
			}
			if(item == ")") {
				symbol.pop(); //pop "("
			} else { 
				symbol.push(item);
			}
		}
	}
	while(symbol.length) {
		if(symbol) {
			postfix.push(symbol.pop());
		}
	}
	return postfix;
}

function compare(item, top) {
	if(item.match(/\)/) && top.match(/\(/))
		return true;
	if(item.match(/\(/) || top.match(/\(/)) {
		return true;
	}
	if(item.match(/\*|\//) && top.match(/\+|\-/)) {
		return true;
	}
	//console.log(item);
	return false;
}