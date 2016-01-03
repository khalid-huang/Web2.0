var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var querystring = require('querystring');

var html = fs.readFileSync('./index.html');
fs.openSync("AllUser.txt",'a+', function(err, fd) {
    if(err)
        throw err;
});

var mimetype = {
    'txt': 'text/plain',
    'html': 'text/html',
    'css': 'text/css',
    'js':'text/javascript'
}
var server = http.createServer(function(request, response) {
    request.setEncoding("utf8");
    if(request.method === "GET") {
        var username = querystring.parse(url.parse(request.url).query).username;
        if(username !== undefined && queryUser(username)) {
            userInfoPage(response, getUser(username));
            return;
        }
        var pathname = path.parse(url.parse(request.url).pathname);
        var ext = pathname['ext'].substr(1);
        var base = pathname['base'];
        if(ext in mimetype) {
            response.writeHeader(200, {"Content-Type": mimetype[ext]});
            var data = fs.readFileSync('./'+base);
            response.write(data);
            response.end();
            return;
        }
        response.writeHeader(200, {"Content-Type": "text/html"}); 
        response.write(html);
        response.end();
    }
    if(request.method === "POST") {
        request.on('data', function(data) {
            var userInfo = querystring.parse(data);
            var error = "";
            if(counter(userInfo) === 1) {
                for(item in userInfo) {
                    error = validItem(response, userInfo[item], item);
                }
                errorJson = JSON.stringify(error);
                response.end(errorJson);
            } else {
                updateUser(userInfo);
                userInfoPage(response, userInfo);
            }
        });
    }
});
server.listen(8000);

function getAllUser() {
    var AllUser = [];
    var AllUserInfo = fs.readFileSync("AllUser.txt");
    if(AllUserInfo.length !== 0) {
        AllUser = JSON.parse(AllUserInfo);
    }
    return AllUser;            
}

function getUser(username) {
    var users=  getAllUser();
    for(var i = 0; i < users.length; i++) {
        if(username === users[i]['username'])
            return users[i];
    }
}

function queryUser(username) {
    var users = getAllUser();
    for(var i = 0; i < users.length; i++) {
        if(username === users[i]['username']) {
            return true;
        }
    }
    return false;
}

function updateUser(userInfo) {
    var users = getAllUser();
    users.push(userInfo);
    usersJson = JSON.stringify(users);
    fs.writeFileSync("AllUser.txt", usersJson);
}

/*判断信息是否与其他用户有重复*/;
function validItem(response, userItem, item) {
    var users = getAllUser();
    var error = "";
    for(var i = 0; i < users.length; i++) {
        if(userItem === users[i][item]) {
/*            error = item + " is repeated";*/
            error = "请更换一个，该内容已经被其他用户占用"
            return error;
        }
    }
    return error;
}

function counter(object) {
    var count = 0;
    for(var item in object) {
        count++;
    }
    return count;
}

function userInfoPage(response, userInfo) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write('<!DOCTYPE html>');
    response.write('<html>');
    response.write('<head>');
    response.write('<meta charset="UTF-8">');
    response.write('<title>UserInfo Page</title>');
    response.write('<link rel="stylesheet" type="text/css" href="userInfo.css" />');
    response.write('</head>');
    response.write('<body>');
    response.write('<section id="InfoArea">');
    response.write('<h2>Welcome</h2>')
    response.write('<p><span class="item">用户名</span><span class="info">'+userInfo['username']+'</span></p>');
    response.write('<p><span class="item">学号</span><span class="info">'+userInfo['number']+'</span></p>');
    response.write('<p><span class="item">电话</span><span class="info">'+userInfo['phone']+'</span></p>');
    response.write('<p><span class="item">邮箱</span><span class="info">'+userInfo['email']+'</span></p>');
    response.write('<form action="/">');
    response.write('<input type="submit" value="退出">');
    response.write('</form>');
    response.write('</section>');        
    response.write('</body>');
    response.write('</html>');
    response.end();
}