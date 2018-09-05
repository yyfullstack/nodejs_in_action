var connect = require('connect');
var methodOverride = require('method-override');
var fs = require('fs');


var app = connect()
    .use(methodOverride('X-HTTP-Method-Override'))
    .use(function (req, res) {
        if(req.url === '/' || req.url === '' || req.url === '/methodoverride.html') {
            fs.readFile('./methodoverride.html', function (err, file) {
                console.log(req.url);
                //对主文档设置缓存，无效果
                res.setHeader('Cache-Control', 'max-age=' + 5);
                res.setHeader('Content-Type', 'text/html');
                res.writeHead('200', 'OK');
                res.end(file);
            })
        }else{
            console.log(JSON.stringify(req.headers));
        }

    }).listen(3000);
