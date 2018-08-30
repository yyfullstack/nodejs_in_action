var net = require('net');
var socket = new net.Socket();
socket.on('connect', function () {
    console.log('client 连接成功');
})
socket.connect(8888);
