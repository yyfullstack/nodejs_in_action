var connect = require('connect');
var favicon = require('serve-favicon');
var path = require('path');

var app = connect()
    .use(favicon(path.join(__dirname, 'favicon.ico')))
    .use(function (req, res) {
        res.end('hello\n');
    }).listen(3000);
