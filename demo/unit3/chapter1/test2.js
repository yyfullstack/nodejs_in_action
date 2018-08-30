var Demo2 = require('./demo2');
var canadianDollar = 0.91;
var currenty = new Demo2(canadianDollar);

console.log('50 Canadian dollars equals this amount of US dollars:');
console.log(currenty.canadianToUs(50));

console.log('30 US dollars equals this amount of Canadian dollars:');
console.log(currenty.USToCanadian(30));