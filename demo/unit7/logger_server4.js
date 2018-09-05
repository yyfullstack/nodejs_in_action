var connect = require('connect');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var finalhandler = require('finalhandler');
var path = require('path');
var fs = require('fs');
var rfs = require('rotating-file-stream');

//把日志写到文件夹中，按日
var logDirectory = path.join(__dirname, 'log');
//确认日志文件夹存在，否则创建文件夹
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var accessLogStream = rfs('access.log', {
    interval: '1d',
    path: logDirectory
})

var app = connect()
    .use(morgan('combined', {stream: accessLogStream}))
    // parse application/json
    .use(bodyParser.json({limit: '1mb'}))
    //parse application/x-www-form-urlencoded
    .use(bodyParser.urlencoded({extended: false}))
    .use(function (req, res) {
        res.end('hello world\n');
    }).listen(3000);