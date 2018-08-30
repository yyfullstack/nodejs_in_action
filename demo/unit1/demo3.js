var fs = require('fs');
var readerStream = fs.createReadStream('./res2.json');
var writerStream = fs.createWriteStream('./res.json');
var data = '';

readerStream.on('data', function (chunk) {
    data += chunk;
    console.log(chunk);
});

readerStream.on('end', function () {
    console.log('读取完成');
    writerStream.write(data, 'utf-8');
    writerStream.on('finish', function () {
        console.log('写入完成');
    });
    writerStream.on('error', function () {
        console.log(err.stack);
    });
});

readerStream.on('error', function (err) {
    console.log(err.stack);
});