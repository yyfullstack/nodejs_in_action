var connect = require('connect');
// var cookieParser = require('cookie-parser');
// var singnature = require('cookie-signature');
//
// console.log(singnature.sign('eliza', 'eliza is smart'));


var app = connect()
    .use(function (req, res) {
        res.setHeader('status', '200 OK');
        res.setHeader('Set-Cookie', 'isVisit=true; domain=.yourdomian.com; path=/; max-age=1000');
        res.end('hello\n');
    }).listen(3000);

//封装对cookie的设置过程

var serilize = function (name, val, options) {
    if (!name) {
        throw new Error('cookie must have name');
    }
    var enc = encodeURIComponent;
    var parts = [];
    val = (val != null) ? val.toString() : '';
    options = options || {};
    parts.push(enc(name) + '=' + enc(val));

    if (options.domain) {
        parts.push('domain=' + options.domain);
    }

    if (options.path) {
        parts.push('path=' + options.path);
    }
    //如果不设置expires和max-age 浏览器会在页面关闭是清空cookie
    if (options.expires) {
        parts.push('expires=' + options.expires.toGMTString());
    }

    if (options.maxAge && typeof options.maxAge === 'number') {
        parts.push('max-age=' + options.maxAge);
    }

    if (options.httpOnly) {
        parts.push('HTTPOnly');
    }

    if (options.secure) {
        parts.push('secure');
    }

    return parts.join(';');

};