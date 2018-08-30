//test 1
var x = require('./demo4');
console.log(x); //{ [Function: View] test1: [Function] }
console.log(x.test); //undefined
console.log(x.test1);  //[Function]


//test 2
// var y = require('./demo4');
// var x = new y();
// console.log(x); //View {}
// console.log(x.test); //[Function]
// console.log(x.test1);  //undefined