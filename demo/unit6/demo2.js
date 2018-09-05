var connect = require('connect');
var app = connect();
//然后调用next()将控制权交给分派器。要在程序中使用这个中间件，你可以调用use()方法。
app.use(logger);
app.listen(3000);

function logger(req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
}