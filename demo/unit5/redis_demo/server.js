var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1');


client.on('error', function (err) {
    console.log('Error: ' + err);
});

client.set('color', 'red', redis.print);
client.get('color', function (err, value) {
    if (err) {
        throw err;
    }
    console.log('Got: ' + value);
});

client.hmset('camping', {
    'shelter': '2-person tent',
    'cooking': 'campstove'
}, redis.print);

client.hget('camping', 'cooking', function (err, value) {
    if (err) {
        throw err;
    }
    console.log('Will be cooking with: ' + value);
});

client.hkeys('camping', function (err, keys) {
    if (err) {
        throw err;
    }
    keys.forEach(function (key) {
        console.log(key);
    })
});

client.hvals('camping', function (err, vals) {
    if (err) {
        throw err;
    }
    vals.forEach(function (val) {
        console.log(val);
    })
});

client.hgetall('camping', function (err, all) {
    if (err) {
        throw err;
    }
    for (var key in all) {
        console.log('key: ' + key + ', value: ' + all[key]);
    }
});

client.lpush('tasks', 'Paint the bikeshed red.', redis.print);
client.lpush('tasks', 'Paint the bikeshed green.', redis.print);
client.lrange('tasks', 0, -1, function (err, items) {
    if (err) {
        throw  err;
    }
    items.forEach(function (item) {
        console.log(item);
    })
})

client.sadd('ip_addresses', '204.10.37.96', redis.print);
client.sadd('ip_addresses', '204.10.37.96', redis.print);
client.sadd('ip_addresses', '214.10.37.96', redis.print);
client.smembers('ip_addresses', function (err, members) {
    if (err) {
        throw err;
    }
    console.log(members);
})