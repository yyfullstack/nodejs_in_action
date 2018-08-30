var mime = require('mime');
var path = require('path');
var fs = require('fs');
var http = require('http');
var chatServer = require('./lib/chat_server');
var cache = {};

/**
 * 请求的文件不存在时，发送404错误
 * @param res
 */
function send404(res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('Error 404 : resource not fount');
    res.end();
}

/**
 * 发送文件内容
 * @param res
 * @param filePath
 * @param fileContent
 */
function sendFile(res, filePath, fileContent) {
    res.writeHead(200, {'Content-Type': mime.getType(path.basename(filePath))});
    res.end(fileContent);
}

/**
 * 静态文件服务
 * @param res
 * @param cache
 * @param absPath
 */
function serverStatic(res, cache, absPath) {
    if (cache[absPath]) {
        sendFile(res, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function (exists) {
            if (exists) {
                fs.readFile(absPath, function (err, data) {
                    if (err) {
                        send404(res);
                    } else {
                        cache[absPath] = data;
                        sendFile(res, absPath, data);
                    }
                });
            } else {
                send404(res);
            }
        });
    }
}

//创建http服务
var server = http.createServer(function (req, res) {
    var filePath = false;
    console.log(req.url);
    if (req.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + req.url;
    }
    var absPath = './../' + filePath;
    serverStatic(res, cache, absPath);
});

server.listen(3000, function () {
    console.log('server listening on port 3000');
});

chatServer.listen(server);