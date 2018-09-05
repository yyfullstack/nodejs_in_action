var redis = require('redis');
var client1 = redis.createClient(6379, '127.0.0.1');
// var client2 = redis.createClient(6379, '127.0.0.1');

function getRedisData() {

    client1.on('ready', function () {
        client1.subscribe('chat1');
        //client2.subscribe('chat2');
        console.log('订阅成功。。。');
    })

    client1.on('error', function (err) {
        console.log('Error: ' + err);
    });

    //监听订阅成功事件
    client1.on('subscribe', function (channel, count) {
        console.log('client subscribed to ' + channel + ', ' + count + ' total subscriptions');

    });

    client1.on('message', function (channel, message) {
        console.log('接收到来自 ' + channel + ', 信息为：' + message);
        dealWithMsg(message);
    });


    client1.on('unsubscribe', function (channel, count) {
        console.log('client unsubscribed to ' + channel + ', ' + count + ' total subscriptions');

    });

}

function dealWithMsg(message) {
    client1.zscore('z', message, function (err, reply) {
        console.log(message + '的内容是：' + reply);
    })
}

getRedisData();