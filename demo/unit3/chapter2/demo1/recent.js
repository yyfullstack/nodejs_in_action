var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
    if (req.url == '/') {
        fs.readFile('./titles.json', function (err, data) {
            if (err) {
                console.error(err);
                res.send('Server Error');
            }
            else {
                var titles = JSON.parse(data.toString());
                fs.readFile('./template.html', function (err, data) {
                    if (err) {
                        console.error(err);
                        res.send('Server Error');
                    }
                    else {
                        console.log(titles.join('</li><li>'));
                        var tmpl = data.toString();
                        var html = tmpl.replace('%', titles.join('</li><li>'));

                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(html);
                    }
                })
            }
        })
    }
}).listen(3000, '127.0.0.1');

//该例子嵌入了三层回调，三层还算可以，但回调层数越多，代码看起来越乱，重构和测试起来也越困难， 所以最好限制一下回调的嵌套层级。
//如果把每一层回调嵌套的处理做成命名函数，虽然表示相同逻辑所用的代码变多了，但维护、测试和重构起来会更容易。