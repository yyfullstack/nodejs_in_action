var fs = require('fs');
var readerStream = fs.createReadStream('./res2.json');
var writerStream = fs.createWriteStream('./res.json');
readerStream.pipe(writerStream);
console.log('读写完成！');