var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var port = 3000;

http.createServer(function(req,res){
  var pathname = url.parse(req.url).pathname;
  //设置默认请求index.html文件
  if(pathname === "/") {
    /*pathname = "/index.html"*/
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 200;
    res.write('<h3>Please input localhost:3000/S1/index.html to get the s1 page.</h3>');
    res.write('<h3>Please input localhost:3000/S2/index.html to get the s2 page.</h3>');
    res.write('... other page just like the s1 and s2');
    res.end();
    return;
  }
  var mimeType = getMimeType(pathname);
  if (!!mimeType) {
    handlePage(req, res, pathname);
  } else {
    handleAjax(req, res);
  }
}).listen(port, function(){
  console.log('server listen on ', port);
});

function getMimeType(pathname) {
  var validExtensions = {
    ".html" : "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".png": "image/png"
  };
  var ext = path.extname(pathname);
  var type = validExtensions[ext];
  return type;
}

function handlePage(req, res, pathname) {
  var filePath = __dirname + pathname;
  var mimeType = getMimeType(pathname);
  if (fs.existsSync(filePath)) {
    fs.readFile(filePath, function(err, data){
      if (err) {
        res.writeHead(500);
        res.end();
      } else {
        res.setHeader("Content-Length", data.length);
        res.setHeader("Content-Type", mimeType);
        res.statusCode = 200;
        res.end(data);
      }
    });
  } else {
    res.writeHead(500);
    res.end();
  }
}

function handleAjax(req, res) {
  var random_time = 1000 + getRandomNumber(2000);
  var random_num  = 1 + getRandomNumber(9);
  setTimeout(function(){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("" + random_num);
  }, random_time);
}

function getRandomNumber(limit) {
  return Math.round(Math.random() * limit);
}