## Connect自带的中间件

#### 7.1 解析cookie、请求主体和查询字符串的中间件

Node中没有解析cookie、缓存请求体、解析复杂查询字符串之类的高层web程序概念的核心模块，所以connect为你提供了实现这些功能的中间件。

- cookieParser() 解析来自浏览器的cookie，放到req.cookies中
- bodyParser() 读取解析请求体，放到req.body中
- limit() 跟bodyParser() 联手防止读取过大的请求
- query() 解析请求URL的查询字符串，放到req.query中

##### 7.1.1 cookieParser() ，解析HTTP cookie

Connect的cookie解析器支持常规cookie、签名cookie和特殊的JSON cookie。req.cookies默认是常规未签名的cookie组装而成的。如果你想支持session()中间件要求的签名cookie，在创建cookieParser() 实例是要传入一个加密用的字符串。

**在服务器端设定cookie**

 中间件cookieParser() 不会为设定出站cookie提供任何帮助。为此你应该用res.setHeader()函数设定名为Set-Cookie的响应头。Connect针对Set-Cookie响应头这一特殊情况为Node默认的res.setHeader() 函数打了补丁，所以它可以按你期望的方式工作。

cookieParser()实际上是对http传入的cookie进行解析后赋值给req.cookies，使得中间件可用，如果你传入了一个string类的参数那么说明你需要对用这个参数进行了加密的值进行解密(注意！这个方法不是加密是解密！)并且要求**传入的cookie加密值必须以s: 这个形式开头**（这是本书没有提到的，可能独立出来的cookieParser有改动）

中间件cookieParser正确的解密了我的加密cookie，并且赋值给了req.signedCookies

中间件无法正确解析，这就避免了cookie被篡改的可能性

最后注意一定要有s:如果没有 xx.xxxxx这样的写法会被认为是普通cookie而被赋值给req.cookies

**JSON cookie**

特别的JSON cookie 带有前缀j:, 告诉Connect 它是以串行化的JSON.  JSON cookie既可以是签名的，也可以是未签名的。

**设定出站cookie**

cookieParser() 中间件没有提供任何通过Set-Cookie响应头向HTTP客户端写出站cookie的功能。但Connect可以通过res.setHeader()函数写入多个Set-Cookie 响应头。

如果不设置expires和max-age浏览器会在页面关闭时清空cookie，如果给cookie设置一个过去的时间，浏览器会立即删除该cookie；此外domain项必须有两个点，因此不能设置为localhost:

**缓存种类**

缓存可以是单个用户专用的，也可以是多个用户共享的。专用缓存被称为私有缓存，共享的缓存被称为公有缓存

**私有缓存**

私有缓存只针对专有用户，所以不需要很大空间，廉价。Web浏览器中有内建的私有缓存——大多数浏览器都会将常用资源缓存在你的个人电脑的磁盘和内存中。如Chrome浏览器的缓存存放位置就在：C:\Users\Your_Account\AppData\Local\Google\Chrome\User Data\Default中的Cache文件夹和Media Cache文件夹。

**公有缓存**

公有缓存是特殊的共享代理服务器，被称为缓存代理服务器或代理缓存（反向代理的一种用途）。公有缓存会接受来自多个用户的访问，所以通过它能够更好的减少冗余流量。事实上在实际应用中通常采用层次化的公有缓存，基本思想是在靠近客户端的地方使用小型廉价缓存，而更高层次中，则逐步采用更大、功能更强的缓存在装载多用户共享的资源

**注意**，我们讨论的所有关于缓存资源的问题，都仅仅针对GET请求。而对于POST, DELETE, PUT这类行为性操作通常不做任何缓存

**新鲜度限值**

HTTP通过缓存将服务器资源的副本保留一段时间，这段时间称为新鲜度限值。这在一段时间内请求相同资源不会再通过服务器。HTTP协议中Cache-Control和 Expires可以用来设置新鲜度的限值，前者是HTTP1.1中新增的响应头，后者是HTTP1.0中的响应头。二者所做的事时都是相同的**，但由于Cache-Control使用的是相对时间，而Expires可能存在客户端与服务器端时间不一样的问题，所以我们更倾向于选择Cache-Control**。

public 指定响应可以在代理缓存中被缓存，于是可以被多用户共享。如果没有明确指定private，则默认为public。private 响应只能在私有缓存中被缓存，不能放在代理缓存上。对一些用户信息敏感的资源，通常需要设置为private。**no-cache 表示必须先与服务器确认资源是否被更改过（依靠If-None-Match和Etag），然后再决定是否使用本地缓存**。

no-store 绝对禁止缓存任何资源，也就是说每次用户请求资源时，都会向服务器发送一个请求，每次都会下载完整的资源。通常用于机密性资源

![](H:\Node_workspace\nodejs_in_action\doc\2016061414573360.png)

**Etag与If-None-Match**

根据实体内容生成一段hash字符串，标识资源的状态，由服务端产生。浏览器会将这串字符串传回服务器，验证资源是否已经修改，如果没有修改，过程如下(图片来自浅谈Web缓存)：

![60HQ8__TL_6I_P_0Q15O7](H:\Node_workspace\nodejs_in_action\doc\2016061414573362.png)

由于Etag有服务器构造，所以在集群环境中一定要保证Etag的唯一性





##### 7.1.2 bodyParser() 解析请求主体

form表单有三种提交格式：即enctye可以有三种值：

```
enctype = "application/x-www-form-urlencoded"
enctype = "multipart/form-data"
enctype = "text/plain"
```

分别对应不同的提交数据，其中multipart是提交文件数据。如果需要解析multipart/form-data格式的数据时，需要用到multiparty或者connect-multiparty。

**发送 “application/json"格式的数据**

![1536066352884](H:\Node_workspace\nodejs_in_action\doc\1536066352884.png)

##### 7.1.3 limit() 请求主体的限制

设计limit() 中间件组件的目的是帮助过滤巨型的请求，不管他们是不是恶意的。比如说，一个无心的用户上传照片时可能不小心发送了一个未经压缩的RAW图片，里面有几百兆的数据，或者一个恶意用户可能会创建一个超大的JSON字符串把bodyParser()锁住，并最终锁住V8的JSON.parse()方法。该方案被bodyParser() 的一个limit选项替代。

##### 7.1.4 query() 查询字符串解析，

现在已经被qs 中间件替代了，直接node的url组件就可以解析出来。

#### 7.2 实现web程序的核心功能的中间件

##### 7.2.1 logger() 记录请求

现在已经使用morgan替代logger了，

##### 7.2.2 favicon() 提供favicon
现在已经使用serve-favicon替代了

##### 7.2.3 methodOverride(); 伪造HTTP方法

当你构建一个使用特殊HTTP谓词的服务器时，如PUT或DELETE,在浏览器中会出现一个有趣的问题，浏览器的<form>只能GET或POST, 所以你在程序中也不能使用其他方法。

一种常见的解决办法是添加一个<input type=hidden>，将其值设定为你想用的方法名，然后让服务器检查那个值并“假装”它是这个请求的请求方法。methodOverride()是这项技术中的服务器这边的解决办法。