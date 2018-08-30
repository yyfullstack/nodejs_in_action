var fs = require('fs');
fs.readFile('./res2.json', function (err, data) {
    if (err) {
        console.log(err.message);
        return;
    }
    var obj = JSON.parse(data);
    console.log(JSON.stringify(obj));
    console.log(data);
})