var md5 = require('md5');
var debug = require('debug')('register:user');
var validator = require("../public/javascripts/validator");

module.exports = function(db) {
	debug("userManager.js");
	var users = db.collection('users');
	var userManager = {
		findUser: function(username, password) {
			return users.findOne({username:username}).then(function(user) {
				if(user) {
					if(user.password === md5(password)) {
						return Promise.resolve(user);
					} else {
						var error = {};
						error.username = "";
						error.password = "密码错误";
						return Promise.reject(error);
					}
				} else {
					var error = {};
					error.username = "用户名不存在";
					error.password = "";
					return Promise.reject(error);
				}
			});
		},

		createUser: function(user) {
			user.password = md5(user.password);
			return users.insert(user);
		},

		checkUser: function(user) {
			var formatErrors = validator.findFormatErrors(user);
			return new Promise(function(resolve, reject) {
				formatErrors ? reject(formatErrors):resolve(user);
			}).then(function(user) {
				return users.findOne({$or : getQueryItem(user)}).then(function(existedUser) {
						return existedUser ? Promise.reject("部分信息被占用,请更换"):Promise.resolve(user);
				})
			})
		},

		checkItem: function(userInfo) {
			var item = userInfo.field;
			var value = userInfo[item];
			var query = {};
			query[item] = value;
			return users.findOne(query).then(function(user) {
				var error = "";
				if(user) {
					error = "请更换一个，该内容已经被其他用户占用";
				}
				return Promise.resolve(error);
			});
		}
	};
	return userManager;
}

function getQueryItem(user) {
	var queryArray = [];
	for(item in user) {
		if(item !== "password" && item !== "repeatedPassword") {
			var obj = {};
			obj[item] = user[item];
			queryArray.push(obj);
		}
	}
	return queryArray;
}