var http = require('http');
var url = require('url');
var items = [];

var server = http.createServer(function (req, res) {
    switch (req.method) {
        case 'POST':
            var item = '';
            req.setEncoding('utf8');
            req.on('data', function (chunk) {
                console.log(chunk);
                item += chunk;
            });
            req.on('end', function () {
                console.log(item);
                items.push(item);
                res.end('ok');
            })
            break;

        case 'GET':
            // console.log(items.length);
            //
            // items.forEach(function (item, i) {
            //     res.write(i + ') ' + item + '\n');
            // })
            // res.end();

            //优化的GET处理器
            var body = items.map(function (item, i) {
                return i + ') ' + item;
            }).join('\n');
            res.setHeader('Content-Length', Buffer.byteLength(body));
            res.setHeader('Content-Type', 'text/plain;charset="utf-8"');
            res.end(body);
            break;

        case 'DELETE':
            var path = url.parse(req.url).pathname;
            console.log(path);
            var i = parseInt(path.slice(1), 10);
            console.log(i);
            if (isNaN(i)) {
                res.statusCode = 400;
                res.end('Invalid item id');
            } else if (!items[i]) {
                res.statusCode = 404;
                res.end('Item not fount');
            } else {
                items.splice(i, 1);
                res.end('ok');
            }
            break;

        case 'PUT':
            var path = url.parse(req.url).pathname;
            console.log(path);
            var i = parseInt(path.slice(1), 10);
            console.log(i);
            if (isNaN(i)) {
                res.statusCode = 400;
                res.end('Invalid item id');
            } else if (!items[i]) {
                res.statusCode = 404;
                res.end('Item not fount');
            } else {
                var item = '';
                req.setEncoding('utf8');
                req.on('data', function (chunk) {
                    console.log(chunk);
                    item += chunk;
                });
                req.on('end', function () {
                    console.log(item);
                    items.splice(i, 1, item);
                    res.end('ok');
                })
            }
            break;
    }
});
server.listen(3000);
