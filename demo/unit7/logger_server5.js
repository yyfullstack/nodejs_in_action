var connect = require('connect');
//var morgan = require('morgan');
var bodyParser = require('body-parser');
var finalhandler = require('finalhandler');
var path = require('path');
var fs = require('fs');
var log = require('./logger_foraliyun');
//var rfs = require('rotating-file-stream');



var app = connect()
    .use(log)
    // parse application/json
    .use(bodyParser.json({limit: '1mb'}))
    //parse application/x-www-form-urlencoded
    .use(bodyParser.urlencoded({extended: false}))
    .use(function (req, res) {
        res.end('hello world\n');
    }).listen(3000);