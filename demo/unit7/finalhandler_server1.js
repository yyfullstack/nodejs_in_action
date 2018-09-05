// demo1
// var finalhandler = require('finalhandler');
// var http = require('http');
//
// var server = http.createServer(function (req, res) {
//     var done = finalhandler(req, res);
//     done();
// }).listen(3000);

//demo2
// var finalhandler = require('finalhandler');
// var http = require('http');
// var fs = require('fs');
//
// var server = http.createServer(function (req, res) {
//     var done = finalhandler(req, res);
//     fs.readFile('index1.html', function (err, buf) {
//         if(err) {
//             return done(err);
//         }
//         res.setHeader('Content-Type', 'text/html');
//         res.end(buf);
//     })
// }).listen(3000);


var finalhandler = require('finalhandler');
var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    var done = finalhandler(req, res, {onerror:logerror});
    fs.readFile('index1.html', function (err, buf) {
        if(err) {
            return done(err);
        }
        res.setHeader('Content-Type', 'text/html');
        res.end(buf);
    })
}).listen(3000);
//记录错误日志
function logerror(err) {
    console.error(err.stack || err.toString());
}