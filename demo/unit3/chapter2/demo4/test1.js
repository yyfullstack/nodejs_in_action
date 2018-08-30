var net = require('net');
var events = require('events');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function (id, client) {
    this.clients[id] = client;
    this.subscriptions[id] = function (senderId, message) {
        if (id != senderId) {
            this.clients[id].write(message);
        }
    };
    var welcome = "Welcome!\n" + "Guests online " + this.listeners('broadcast').length;
    client.write(welcome + '\n');
    this.on('broadcast', this.subscriptions[id]);
});

//当有用户离开时,通知其他用户
channel.on('leave',function (id) {
    channel.removeListener('broadcast',this.subscriptions[id]);
    channel.emit('broadcast',id, id + "has left the chat.\n");
});

channel.on('shutdown', function(){
    console.log('chat has shut down');
    channel.emit('broadcast', '', 'Chat has shut down.\n');
    channel.removeAllListeners('broadcast');
})

var server = net.createServer(function (client) {
    client.setEncoding('utf8');

    client.write('\n > welcome to net-chat ' +
        '\r\n > other people are connected at this time. ' +
        '\r\n > please write your name and press enter: ');

    var id = client.remoteAddress + ' : ' + client.remotePort;

    //data 事件只被处理一次
    client.on('data', function (data) {
        //console.log('----------------1-------' + data);
        client.setEncoding('utf8');

        data = data.toString();
        console.log(data);
        if(data == 'shutdown'){
            channel.emit('shutdown');
        }
        channel.emit('broadcast', id, data)
    })

    client.on('error', function (err) {
        console.log(err);
    })


    client.on('close', function () {
        channel.emit('leave', id);
    })

    //client.on('connect', function () {
        console.log('----------------1-------' + 'join');
        channel.emit('join', id, client)
    //})
});



server.listen(8888, function () {
    console.log('\033[96m   server listening on *:8888\033[39m', server.address());
});

server.on('error', function (e) {
    console.log('Address is use, retrying...');
    setTimeout(function () {
        server.close();
        server.listen(8888);
    }, 1000);
});
