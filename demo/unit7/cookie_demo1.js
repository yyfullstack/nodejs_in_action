var connect = require('connect');
var cookieParser = require('cookie-parser');
var singnature = require('cookie-signature');

console.log(singnature.sign('eliza', 'eliza is smart'));


var app = connect()
    .use(cookieParser('eliza is smart'))
    .use(function (req, res) {
        console.log(req.cookies);
        console.log(req.signedCookies);
        res.end('hello\n');
    }).listen(3000);