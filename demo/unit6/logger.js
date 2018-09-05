/**
 * 实现可配置的logger组件需要先定义一个setup函数，它能接受一个字符串参数
 * setup被调用后，会返回一个函数，即Connect所用的真正的中间件组件。
 * @param format
 * @returns {logger}
 */
//setup函数可以用不同的配置调用多次
function setup(format) {
    //logger组件用正则表达式匹配请求属性
    var regexp = /:(\w+)/g;

    //Connect使用的真实logger组件
    return function logger(req, res, next) {

        //用正则表达式格式化请求的日志条目
        var str = format.replace(regexp, function (match, property) {
            return req[property];
        });

        //将日志条目输出到控制台
        console.log(str);

        //将控制权交给下一个中间件组件
        next();
    }
}

module.exports = setup;