## Connect

Connect 是一个框架，它是以被称为中间件的模块化组件，可以重用的方式实现web程序中的逻辑。在Connect中，中间件组件是一个函数，它拦截HTTP服务器提供的请求和响应对象，执行逻辑，或者结束逻辑，或把它传递给下一个中间件组件。Connect用分派器把中间件“连接”在一起。

在Connect中，你可以使用自己编写的中间件，但它也提供了几个常用的组件，可以用来做请求日志、静态文件服务、请求体解析、会话管理等。对于想构建自己的高层web框架的开发人员来说，Connect就像一个抽象层，因为Connect很容易扩展，在其上构建东西也很容易。

Connect和Express，本章所讨论的概念可以直接套用到更高层的Express框架上，因为它是构建在Connect上的扩展，添加了更多高层的糖衣。

![1535941698810](H:\Node_workspace\nodejs_in_action\doc\1535941698810.png)

#### 6.2 Connect 工作机制

在Connect中，中间件组件是一个javascript函数，按惯例会接收三个参数：一个请求对象，一个响应对象，还有一个通常命名为next的参数，它是一个回调函数，表明这个组件已经完成了它的工作，可以执行下一个中间件组件了。

中间件的概念最初是受到Ruby的Rack框架的启发，它有一个非常相似的模块接口，但由于Node的流特性，它的API与其不同。中间件组件很棒，因为它们小巧、自包含，并且可以在整个程序中重用。

#### 6.3 为什么中间件的顺序很重要

为了让程序和框架开发人员得到最大的灵活性，Connect尽量不做假设。Connect允许你定义中间件的执行顺序就是例证之一。这是一个简单的概念，但经常被忽视。

**当一个组件不调用next()方法时，命令链中的后续中间件都不会被调用。**

#### 6.4 挂载中间件和服务器

Connect中有一个挂载的概念，这是一个简单而强大的组织工具，可以给中间件或整个程序定义一个路径前缀。使用挂载，你可以像在根层次下那样编写中间件（/根 req.url），并且不修改代码就可以把它们用在任一路径前缀上。

比如说，如果一个中间件组件或服务器挂载到了/blog上，代码中/article/1的req.url 通过客户端来访问就是 /blog/article/1。 这种分离意味着你可以在多个地方重用博客服务器，不用为不同的访问源来修改代码。比如说，如果你决定改用/arcticles（articles/article/1）提供文章服务，不再用/blog了，只要修改挂载路径前缀就可以了。

我们再看一个挂载的例子。程序通常都有它们自己的管理区域，比如干预评论和批准新用户。在我们的例子中，这个管理区域会在/admin上，你需要有办法确保只有被授权的用户才能访问/admin, 而网站的其他区域对所有用户都是开放的。

除了为/根 req.url 重写请求，挂载还将只对前缀（挂载点）内的请求调用中间件或程序。在后面的代码清单中，第二个和第三user()调用中的第一个参数是字符串”/admin“，然后是中间件组件。这意味着这些组件只用于带有/admin 前缀的请求。

##### 6.4.1 认证中间件

这是一个通用的认证组件，不会以任何方式专门绑定在/admin req.url 上。但当你把它挂载到程序上时，只有请求URL以/admin开始时，才会调用它。Basic认证是一种简单的认证机制，借助带着Base64编码认证信息的HTTP请求头中的authorization自动进行认证。

**HTTP Basic Authentication**

![](H:\Node_workspace\nodejs_in_action\doc\8098263-6ad1e092ddf39e51.webp)

在一个HTTP事务 上下文中，basic access authentication 是HTTP用户代理在请求时提供用户名和密码的一种方法

**Features**

HTTP Basic authentication(BA) 的实现是强制控制访问web resources的最简单方式。因为它不需要cookies，session identifiers, login pages。 HTTP Basic authentication 采用HTTP头中标准的filed,避免握手（handshakes）的需求。

**Security**

BA机制由于传输证书提供不机密的保护。他们仅在传输时使用Base64来编码，但不会在任何地方加密或者hash。因此，HTTPS是经常和BA一起结合使用。

由于BA filed必须在每个http请求的header中被发送，所以浏览器需要在一个合理的周期中缓存证书来避免不断的提示用户输入用户名和密码。不同的浏览器缓存策略不同。IE默认缓存证书是15min。

HTTP不为web server 提供方法来指导客户端用户login out。但是，在一些浏览器中有很多清除cache 证书的方法。其中可以重定向用户到相同域中但是包括不正确的证书的URL

**Server side**

当服务端想要用户代理 通过服务器认证，它必须response合适的未认证的请求。未认证的请求需要返回一个response，其中http header包括HTTP401 Unanthorized status和 WWW-Authenticate field。WWW-Authenticate field在BA红的结构如下：

```
WWW-Authenticate: Basic realm="User Visible Realm"
```

**Client side**

当用户代理想要发送认证证书到服务端，他需要使用 Authorization field。Authorization filed的结构通过如下步骤构成： 

1. 用户名和密码通过冒号相连 
2. 该结果使用RFC2045-MIME Base64转化，除了不限制一行76个字符 
3. 认证方法和一个空格会放在刚编码后字符串的前面



**用Error做参数调用next** 

注意前面的例子中用Error对象做参数的next函数调用，这相当于通知Connect程序中出现了错误，也就是对于中国HTTP请求而言，后续执行的中间件只有错误处理中间件。

通过挂载，不用修改博客程序代码就可以让博客程序的URL从http://foo.com/blog上移到http://bar.com/posts上。因为在挂载后，Connect会去掉req.url的前缀部分。最终结果是博客程序可以用相对（/）的路径编写，不需要知道是挂载在/blog还是/posts上。



#### 6.5 创建可配置中间件

可重用是我们编写中间件的主要原因，并且我们会在这一节创建可以配置日志、路由请求、URL等的中间件。你只要额外做些配置就能在程序中重用这些组件，无需从头实现这些组件来适应你的特定程序。

为了向开发人员提供可配置的能力，中间件通常会遵循一个简单的惯例：用函数返回另一个函数（这是一个强大的javascript特性，通常称为闭包）。这种可配置中间件的基本几个就是闭包。

##### 6.5.2 构建路由中间件组件

在web程序中，路由是个至关重要的概念。简言之，它会把请求URL映射到实现业务逻辑的函数上。路由的实现方式多种多样，从RoR等框架上用的那种高度抽象的控制器，到比较简单、抽象程度较低、基于HTTP方法和路径的路由，比如Express和Ruby的Sinatra等框架提供的路由。

HTTP谓词和路径被表示为一个简单的对象和一些回调函数。其中一些路径中包含带有冒号（：）前缀的标记，代表可以接受用户输入的路径段。

![1536023294401](H:\Node_workspace\nodejs_in_action\doc\1536023294401.png)

#### 6.6 使用错误处理中间件

所有程序都有错误，不管在系统层面还是在用户层面。为错误状况，甚至是那些你没有预料到的错误状况而未雨绸缪是明智之举。Connect按照常规中间件所用的规则实现了一种用来处理错误的中间件变体，除了请求和响应对象，还接受一个错误对象作为参数。

**用NODE_ENV 设定程序的模式**：

Connect 通常是用环境变量NODE_ENV(process.env.NODE_ENV)在不同的服务器环境之间切换，比如生成环境和开发环境。

![1536026460667](H:\Node_workspace\nodejs_in_action\doc\1536026460667.png)

![1536028198179](H:\Node_workspace\nodejs_in_action\doc\1536028198179.png)