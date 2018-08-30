var http = require('http');
var formidable = require('formidable');

var items = [];

var server = http.createServer(function (req, res) {
    console.log(req.url);
    console.log(req.method);
    if ('/' === req.url) {
        switch (req.method) {
            case 'POST':
                upload(req, res);
                break;
            case 'GET':
                //优化的GET处理器
                show(res);
                break;
            default:
                badRequest(res);
        }
    } else {
        notFound(res);
    }
});
server.listen(3000);

function notFound(res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
}

function badRequest(res) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Bad Request');
}

function upload(req, res) {
    if (!isFormData(req)) {
        badRequest(res);
        return;
    }
    var form = new formidable.IncomingForm();
    form.uploadDir = './upload';

    form.on('field', function (field, value) {
        console.log(field);
        console.log(value);
    })

    form.on('file', function (name, file) {
        console.log(name);
        console.log(file);
    })

    form.on('end', function (name, file) {
        res.end('Upload Complete!');
    })

    form.parse(req, function (err, fields, files) {
        if (err) {
            throw err;
        }
        console.log(fields);
        console.log(files);
        res.end('Upload Complete!');
    })

    form.on('progress', function (bytesReceived, bytesExpected) {
        var percent = Math.floor(bytesReceived / bytesExpected * 100);
        console.log(percent);
    });
}

function isFormData(req) {
    var type = req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
}


function show(res) {
    var html = '<html><head><title>Upload Demo</title></head><body><h1>Upload Demo</h1>' +
        '<form method="post" action="/" enctype="multipart/form-data"><p><input type="text" name="name"></p><p><input type="file" name="file"></p><p><input type="submit" value="upload"></p></form></body></html>';

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}