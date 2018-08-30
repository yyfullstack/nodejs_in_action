var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-type': 'text/plain'});
    res.end('Hello World');
}).listen(5000);
console.log('Server running at http://localhost:5000');