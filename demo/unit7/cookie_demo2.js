var connect = require('connect');
// var cookieParser = require('cookie-parser');
// var singnature = require('cookie-signature');
//
// console.log(singnature.sign('eliza', 'eliza is smart'));


var app = connect()
    .use(function (req, res) {
        //res.setHeader('Set-Cookie', ' ');
        res.setHeader('Set-Cookie', 'tobi=ferret; HttpOnly; Expires=Tue, 08 Jun 2021 10:18:14 GMT');
        res.end('hello\n');
    }).listen(3000);