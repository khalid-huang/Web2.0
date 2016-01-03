window.onload = function () {
	chk = document.getElementById("chk");
	rdo = document.getElementById("rdo");
	wrapper = document.getElementById("wrapper");
	create();
	chk.className = "replace";
	chkbox = document.getElementsByClassName("chkbox")[0];
	chkbox.addEventListener("click", chkHandler);
}

//move the checkbox and radio out of the page and replace the new page
function create() {
	var label = document.createElement("label");
	label.setAttribute("for", "chk");
	label.setAttribute("class", "chkbox");
	var yes = document.createElement("span");
	yes.setAttribute("class", "yes");
	var no = document.createElement("span");
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
}