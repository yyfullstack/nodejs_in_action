var parse = require('url').parse;

/**
 * 它只接受一个参数，routes对象，其中包含HTTP谓词，请求URL和回调函数的映射.
 * 首先检查当前的req.method 在routes映射中是否有定义，如果没有则停止进一步处理
 * 之后它会循环遍历已定义的路径，检查是否有跟当前req.url匹配的路径
 * 如果找到匹配项，则调用匹配项的回调函数，期望完成对HTTP请求的处理。
 * @param obj
 * @returns {Function}
 */
function route(obj) {
    return function (req, res, next) {
        //检查以确保req.method 定义了
        //如果未定义，调用next(),并停止一切后续操作
        if (!obj[req.method]) {
            next();
            return;
        }

        //查找req.method 对应的路径
        var routes = obj[req.method];
        console.log('------------obj----------------' + JSON.stringify(obj));
        //解析URL,以便跟pathname匹配
        var url = parse(req.url);
        //将req.method 对应的路径存放到数组中
        var paths = Object.keys(routes);

        //遍历路径
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            var fn = routes[path];
            console.log('------------path-----------1-----' + path);
            path = path.replace(/\//g, '\\/').replace(/:(\w+)/g, '([^\\/])');
            console.log('------------path-----------2-----' + path);
            //构建正则表达式
            var re = new RegExp('^' + path + '$');
            //尝试跟pathname匹配
            var captures = url.pathname.match(re);
            if (captures) {
                console.log('------------captures---------------' + captures);
                //传递被捕获的分组
                var args = [req, res].concat(captures.slice(1));
                console.log('------------args---------------' + args);
                //当有相匹配的函数时，返回
                //以防止后续的next() 调用
                fn.apply(null, args);
                return;
            }

        }
    }
}

module.exports = route;