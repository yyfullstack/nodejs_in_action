function asyncFunction(callback) {
    setTimeout(callback, 200);
}

//用javascript闭包可以“冻结”color的值
//用匿名函数保留全局变量的值
var color = 'blue';
(function(color){
    asyncFunction(function () {
        console.log('The color is ' + color);
    })
})(color);

color = 'green';