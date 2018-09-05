var connect = require('connect');
var url = require('url');
var app = connect().use(rewrite).listen(3000);


/**
 * 接收一个到/blog/posts/my-post-title 请求，基于这个URL最后的文字标题查找文章的ID,
 * 然后将URL转换成/blog/posts/id 。
 * @param req
 * @param res
 * @param next
 */
function rewrite(req, res, next) {
    var path = url.parse(req.url).pathname;
    var match = path.match(/^\/blog\/posts\/(.+)/);
    if(match) {
        findPostIdBySlug(match[1], function (err, id) {
            if(err) {
                return next(err);
            }
            if(!id) {
                return next(new Error('User not found'));
            }

            req.url = '/blog/posts/' + id;
            next();
        })
    }else{
        next();
    }
}