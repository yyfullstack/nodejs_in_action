var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
    if(req.url === '/' || req.url === '' || req.url === '/index.html') {
        fs.readFile('./index.html',function(err, file) {
            console.log(req.url);
            //对主文档设置缓存，无效果
            res.setHeader('Cache-Control', 'max-age=' + 5);
            res.setHeader('Content-Type', 'text/html');
            res.writeHead('200', 'OK');
            res.end(file);
        })
    }

    //服务器确认资源是否被更改过（依靠If-None-Match和Etag）
    if(req.url ==='/cache.png') {
        console.log(req.headers);
        fs.readFile('./cache.png', function (err, file) {

            if(!req.headers['if-none-match']) {
                res.setHeader('Cache-Control', 'max-age=' + 10);
                res.setHeader('Cache-Type', 'images/png');
                res.setHeader('Etag', 'ffff');
                res.writeHead('200', 'Not Modified');
                res.end(file)
            }else{
                if(req.headers['if-none-match'] === 'ffff'){
                    res.writeHead('304', 'Not Modified');
                    res.end()
                }else{
                    res.setHeader('Cache-Control', 'max-age=' + 10);
                    res.setHeader('Cache-Type', 'images/png');
                    res.setHeader('Etag', 'ffff');
                    res.writeHead('200', 'Not Modified');
                    res.end(file)
                }

            }



        });
    }
}).listen(3000);