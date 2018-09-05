var connect = require('connect');
var bodyParser = require('body-parser');


var app = connect()
// parse application/json
    .use(bodyParser.json({limit:'1mb'}))
    //parse application/x-www-form-urlencoded
    .use(bodyParser.urlencoded({ extended: false }))
    .use(function (req, res) {
        console.log(JSON.stringify(req.body));
        console.log(req.files);
        res.end('hello\n');
    }).listen(3000);