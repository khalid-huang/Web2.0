$(function() {
	$('table').on('click', thClickHandler);
});

var thClickHandler = function(e) {
	if(e.target.tagName.toUpperCase() === "TH") {
		changeCss(e);
		sortTable(e);
	}
}

var changeCss = function(e) {
	var id= e.currentTarget.id;
	Array.prototype.slice.call($("#"+id+" th")).forEach(function(value) {
		if(value !== e.target) {
			value.className = "";
		}
	})
	if(e.target.className === "" || e.target.className === "descend") {
		e.target.className = "ascend";
	} else if(e.target.className === "ascend") {
		e.target.className = "descend";
	}
}

var sortTable = function(e) {
	var id = e.currentTarget.id;
	var Set = createSet(id);
	if(e.target.className ===  "ascend") {
		Set = _.sortByOrder(Set, e.target.innerText, 'asc');
	} else {
		Set = _.sortByOrder(Set, e.target.innerText, 'desc');
	}
	Set = mymap(Set);//get the value only
	Array.prototype.slice.call($("#"+id+" td")).forEach(function(value, i) {
		value.innerText = Set[i];
	});
}

var mymap = function(Set) {
	var tempSet = [];
	Set.forEach(function(dic) {
		tempSet = tempSet.concat(_.map(dic, function(value) {return value;}
	))});
	return tempSet;
}

var createSet = function(id) {
	Set = [], Key = [];
	Array.prototype.slice.call($("#" + id +" th")).forEach(function(value, i) {
		Key[i] = value.innerText;
	});
	temptd = Array.prototype.slice.call($("#" + id + " td"));
	for(var i = 0, len = temptd.length; i < len;) {
		if(id === "todo") {
			var obj = {'What?' : temptd[i++].innerText,'When?' : temptd[i++].innerText,'Location' : temptd[i++].innerText};
		} else {
			var obj = {'First name':temptd[i++].innerText,'Last name':temptd[i++].innerText, 'Latest checkin': temptd[i++].innerText};
		}
		Set.push(obj);
	}
	return Set;
}

document.onselectstart = function() {
    return false;
}
