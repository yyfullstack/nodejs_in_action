var connect = require('connect');
var multiparty = require('connect-multiparty');

var app = connect()
    .use(multiparty())
    .use(function (req, res) {
        console.log(req.body);
        console.log(req.files);
        res.end('hello\n');
    }).listen(3000);