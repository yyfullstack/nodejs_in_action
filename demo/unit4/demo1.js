var http = require('http');
var server = http.createServer(function (req, res) {
    // res.write('Hello World');
    // res.end();

    res.end('Hello World');
});
server.listen(3000);
