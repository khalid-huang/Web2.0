var express = require('express');
var validator = require("../public/javascripts/validator");
var url = require('url');
var path = require('path');
var querystring = require('querystring');

module.exports = function(db) {
	var router = express.Router();
	var userManager = require("../module/userManager")(db);
	var users = db.collection('users');
	router.get('/', function(req, res, next) {
		console.log(req.session.user);
		var username = querystring.parse(url.parse(req.url).query).username;
		if(username && req.session.user.username !== username) {
			res.render('detail', {user: req.session.user, message: "只能够访问自己的数据"});
		} else if(username && req.session.user.username === username) {
			res.redirect('/detail');
		} else if(!username && req.session.user){
			res.redirect('/detail');
		} else {
			res.redirect('/signin');
		}
	});

	//注册
	router.get('/regist', function(req, res, next) {
		res.render('signup',{user:{}, error:{}});
	});

	//登录
	router.get('/signin', function(req, res, next) {
		res.render('signin', {user:{}, error:{}});
	});

	router.get('/detail', function(req, res, next) {
		//用session得到用户
		if(req.session.user)
			res.render('detail', {user: req.session.user, message: ""});
		else
			res.redirect('/signup');
	})

	router.get('/signout', function(req, res, next) {
		delete req.session.user;
		res.redirect('/signin');
	})

	//提交表单
	router.post('/regist', function(req, res, next) {
		var user = req.body;
		delete user.repeatedPassword;
		userManager.createUser(user).then(function() {
			delete user.password;
			req.session.user = user;
			req.session.cookie.maxAge = 3600000;
			res.redirect("/detail");
		}).catch(function(error) {
			console.log(error);
		})
	});

	router.post('/signin', function(req, res, next) {
		var user = req.body;
		userManager.findUser(user.username, user.password).then(function(user) {
			//要删掉id的
			delete user._id;
			delete user.password;
			req.session.user = user;
			req.session.cookie.maxAge = 3600000;
			res.redirect('/detail');
		}).catch(function(error) {
			res.render('signin', {user: user, error: error});
		});
		
	});

	//进行单项的检验
	router.post('/repeated', function(req, res, next) {
		var userInfo = req.body;
		userManager.checkItem(userInfo).then(function(errorMessage) {
			res.end(JSON.stringify(errorMessage));
		})
	});

	return router;
};

/*module.exports = router;*/
