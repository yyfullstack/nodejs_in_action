var connect = require('connect');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = connect()
    .use(morgan('combined'))
    // parse application/json
    .use(bodyParser.json({limit:'1mb'}))
    //parse application/x-www-form-urlencoded
    .use(bodyParser.urlencoded({ extended: false }))
    .use(function (req, res) {
        res.end('hello\n');
    }).listen(3000);