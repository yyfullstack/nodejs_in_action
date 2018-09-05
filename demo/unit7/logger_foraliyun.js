var path = require('path');
var fs = require('fs');
var rfs = require('rotating-file-stream');

//把日志写到文件夹中，按日
var logDirectory = path.join(__dirname, 'log');
//确认日志文件夹存在，否则创建文件夹
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

function Wpad(num) {
    return (num > 9 ? '' : '0') + num;
}

function Wgenerator(time, index) {
    if (!time) {
        return 'temp-log.txt.gzip';
    }
    return '/storage' + Wpad(time.getData()) + '-log.txt.gzip';
}

var accessLogStream = rfs('access.log', {
    interval: '1d',
    path: logDirectory,
    compress: 'gzip',
    rotationTime: true
});

module.exports = function (req, res, next) {
    req._startTime = new Date().getTime();
    res.once('finish', function () {
        var msg = '';
        msg += process.env.hostname + ' '; //主机
        msg += req.method + ' '; //method
        msg += req.statusCode + ' '; //状态
        msg += req.headers['sessionId'] + ' '; //sessionId
        msg += (new Date().getTime() - _startTime) + ' '; //响应时长
        msg += req.originalUrl + '/n'; //请求路径
        accessLogStream.write(msg);
    });
    next();
}
