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
			srcollToEnd();
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
				srcollToEnd();
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
		srcollToEnd();
	}


	var delALl = document.getElementById("delAll");
	delALl.onclick = function(event) {
		expression.value = "";
	}
}

//让显示区显示最最右边的数字，不然当显示区满了后，后面输入的数字是显示不出来的
function srcollToEnd() {
	expression.scrollLeft = expression.scrollWidth - expression.clientWidth;
}
//双击某些div/span/p的时候不选定当前内容，而导致全片选择
document.onselectstart = function() {
	return false;
}