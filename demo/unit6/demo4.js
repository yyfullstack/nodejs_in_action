var connect = require('connect');
var app = connect();
//admin 挂载点，restrict 组件确保访问页面的是有效用户，admin组件会给用户呈现管理区域。
// app
//     .use(logger)
//     .use('/admin', restrict)
//     .use('/admin', admin)
//     .use(hello)
//     .listen(3000);

app
    .use(logger)
    .use('/admin', restrict)
    .use('/admin', admin)
    .use(hello)
    .listen(3000);


function logger(req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
}

function hello(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world');
}

var realm = 'Authorization Required';

function restrict(req, res, next) {
    var authorization = req.headers.authorization;
    //没有认证，服务器发送400，并设置field

    if (!authorization) {
        return unauthorized(res, realm)
    }

    // //已经认证了
    if (req.user) {
        console.log('-------------------------------' + req.user);
    //     console.log(req.pass);
    //     return next();
    }

    //获取用户名，密码进行认证
    var parts = authorization.split(' ');
    if (parts.length !== 2) {
        return next(error(400));
    }

    var scheme = parts[0], //Basic
        auth = new Buffer(parts[1], 'base64').toString().split(':'),
        user = auth[0],
        pass = auth[1];

    if (authenticateWithDatabase(user, pass)) {
        next();
    } else {
        unauthorized(res, realm);
    }
}

function authenticateWithDatabase(user, pass) {
    var result = false;
    if (user === 'admin' && pass === '123456') {
        result = true;
    }
    return result;
}

function admin(req, res, next) {
    switch (req.url) {
        case '/':
            res.end('try /users');
            break;
        case '/users':
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(['tobi', 'loki', 'jane']));
            break;
    }
}

function unauthorized(res, realm) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="' + realm + '"');
    res.end('Unauthorized');
}

function error(code, msg) {
    var err = new Error(msg || http.STATUS_CODES[code]);
    err.status = code;
    return err;
};