var fs = require('fs');
var zlib = require('zlib');
fs.createReadStream('./res2.json').pipe(zlib.createGzip()).pipe(fs.createWriteStream('res2.json.gz'));
console.log('压缩完成！');