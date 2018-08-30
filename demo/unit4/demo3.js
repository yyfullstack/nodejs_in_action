var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');
var root = __dirname;

var server = http.createServer(function (req, res) {

    // var url = parse(req.url);
    // console.log('------------url---------' + url);
    // var path = join(root, url.pathname);
    // console.log('------------path---------' + path);
    //
    // fs.exists(path, function (exists) {
    //     if (!exists) {
    //         console.log('文件不存在！');
    //         return;
    //     }
    //     var stream = fs.createReadStream(path);
    //     stream.on('data', function (chunk) {
    //         res.write(chunk);
    //     })
    //     stream.on('end', function () {
    //         res.end();
    //     });
    // })

    //pipe 改造后
    //  var url = parse(req.url);
    //  console.log('------------url---------' + url);
    //  var path = join(root, url.pathname);
    //  console.log('------------path---------' + path);
    //
    //  fs.exists(path, function (exists) {
    //      if (!exists) {
    //          console.log('文件不存在！');
    //          return;
    //      }
    //
    //      var writeStream = fs.createWriteStream('./req_body.txt');
    //      req.pipe(writeStream);
    //
    //      var stream = fs.createReadStream(path);
    //      stream.pipe(res);
    //      //res.end 会在stream.pipe()内部调用
    //  })


    //pipe 改造后
    var url = parse(req.url);
    console.log('------------url---------' + url);
    var path = join(root, url.pathname);
    console.log('------------path---------' + path);

    fs.exists(path, function (exists) {
        if (!exists) {
            console.log('文件不存在！');
            return;
        }

        var writeStream = fs.createWriteStream('./req_body.txt');
        req.pipe(writeStream);

        var stream = fs.createReadStream(path);
        stream.pipe(res);

        stream.on('error', function (err) {
            res.statusCode = 500;
            res.end('Internal Server Error');
        })
        //res.end 会在stream.pipe()内部调用
    })


});
server.listen(3000);
