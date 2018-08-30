var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);



app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function () {
    console.log('http://localhost:3000');
})

io.on('connection', function (socket) {
    console.log('a user connected');

    //socket.broadcast.emit('hi');

    socket.on('chat message', function (msg) {
        console.log('message: ' + msg + ',id ' + socket.id);
        io.emit('chat message', msg);
    });

    //刷新标签页,触发了disconnect事件
    socket.on('disconnect', function () {
        console.log('user disconnected');
    })
});