var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1');

function zadd(key, score, member) {
    client.zadd(key, score, member, function () {
        client.publish('chat1', member);
    })
}

for (var i = 0; i < 10; i++) {
    zadd('z', i, '' + i);
    console.log('第 ' + i + '次');
}