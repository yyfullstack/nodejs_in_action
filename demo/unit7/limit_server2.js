var connect = require('connect');
var bodyParser = require('body-parser');
var getRawBody = require('raw-body');
var contentType = require('content-type');

var app = connect()
// parse application/json
    .use(bodyParser.json())
    //parse application/x-www-form-urlencoded
    .use(bodyParser.urlencoded({ extended: false }))
    .use(function (req, res) {
        getRawBody(req, {
            length:req.headers['content-length'],
            limit:'32kb',
            encoding:contentType.parse(req).parameters.charset
        }, function (err, string) {
            if(err) {
                return next(err);
            }
            console.log(JSON.stringify(req.body));
            req.text = string;
            next();
        })
        res.end('hello\n');
    }).listen(3000);