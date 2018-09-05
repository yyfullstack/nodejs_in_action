var connect = require('connect');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var finalhandler = require('finalhandler');
var logger = morgan('combined');

var app = connect()
    // parse application/json
    .use(bodyParser.json({limit: '1mb'}))
    //parse application/x-www-form-urlencoded
    .use(bodyParser.urlencoded({extended: false}))
    .use(function (req, res) {
        var done = finalhandler(req, res);
        logger(req, res, function (err) {
            if (err) {
                return done(err);
            }
            res.setHeader('Content-Type', 'text/plain');
            res.end('Hello world');
        })
    }).listen(3000);