var http = require('http');
var server = http.createServer();
server.on('request', function (req, res) {
    res.writeHead(200, {'Content-type': 'text/plain'});
    res.end('Hello World');
});
server.listen(5000);
console.log('another Server running at http://localhost:5000');