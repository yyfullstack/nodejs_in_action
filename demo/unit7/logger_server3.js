var connect = require('connect');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var finalhandler = require('finalhandler');
var path = require('path');
var fs = require('fs');

//把日志写到一个文件中去
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});


var app = connect()
    .use(morgan('combined', {stream:accessLogStream}))
    // parse application/json
    .use(bodyParser.json({limit:'1mb'}))
    //parse application/x-www-form-urlencoded
    .use(bodyParser.urlencoded({ extended: false }))
    .use(function (req, res) {
        res.end('hello world\n');
    }).listen(3000);