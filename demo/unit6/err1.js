var connect = require('connect');

connect().use(function hello(req, res) {
    foo(); //默认的错误处理
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
}).listen(3000);
