var net = require('net');

var count = 0;
var users = {};


var server = net.createServer(function (socket) {
    count++;
    var nickname;

    socket.setEncoding('utf8');

    socket.write('\n > welcome to net-chat ' +
        '\r\n > ' + count + ' other people are connected at this time. ' +
        '\r\n > please write your name and press enter: ');

    var broadcast = function (msg, exceptMySelf) {
        for (var i in users) {
            if (!exceptMySelf || i != nickname) {
                users[i].write(msg);
            }
        }
    };

    socket.on('data', function (chunk) {
        socket.setEncoding('utf8');

        //删除回车符
        chunk = chunk.replace('\r\n', '');
        if (!nickname) {
            if (users[chunk]) {
                socket.write('\r\n > nickname already in use. try again: ');
                return;
            } else {
                nickname = chunk;
                users[nickname] = socket;
                broadcast('\r\n > ' + nickname + ' joined the room \r\n');
            }
        } else {
            for (var i in users) {
                if (i != nickname) {
                    broadcast('\r\n > ' + nickname + ' : ' + chunk + '\n', true);
                }
            }
        }
    })

    socket.on('error', function (err) {
        console.log(err);
    })

    socket.on('close', function (err) {
        count--;
        broadcast('\r\n > ' + nickname + ' left the room \r\n');
        delete users[nickname];
    })

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
