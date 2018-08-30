//设置socket.io 服务器
var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function (server) {
    //启动socket.io 服务， 并搭载载已有的http服务器上
    io = socketio.listen(server);
    //io.set('log level', 1);

    //用户连接处理逻辑
    io.sockets.on('connection', function (socket) {

        //设置访客名
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);

        //用户连接上，并把它放入聊天室 Lobby
        joinRoom(socket, 'Lobby');

        //处理用户的消息， 更名，以及聊天室的创建和变更
        handleMessageBroadcasting(socket);

        handleNameChangeAttempts(socket, nickNames, namesUsed);

        handleRoomJoining(socket);

        //用户发出请求时，向其提供已经被占用的聊天室的列表
        socket.on('rooms', function () {
            //console.log(io.sockets);
            socket.emit('rooms', io.sockets.adapter.rooms);
            //var rooms = Object.keys(socket.rooms);
            //console.log(rooms);
            //socket.emit('rooms', rooms);
        });

        //用户断开连接后的清除逻辑
        handleClientDisconnection(socket, nickNames, namesUsed);
    })
};

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    //生成新昵称
    var name = 'Guest' + guestNumber;
    //昵称和socket.id 关联上
    nickNames[socket.id] = name;

    //告知用户新的昵称
    socket.emit('nameResult', {
        success: true,
        name: name
    });

    //存放昵称
    namesUsed.push(name);

    return guestNumber + 1; //计数器
}

function joinRoom(socket, room) {
    //用户进入房间
    socket.join(room);
    //记录用户的当前房间
    currentRoom[socket.id] = room;

    //让用户知道他们进入了新的房间
    socket.emit('joinResult', {room: room});

    //让房间里的其他用户知道有新用户进入了房间
    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + ' has joined ' + room + '.'
    });

    //汇总房间内的所有用户
    var usersInRoom = io.sockets.adapter.rooms[room];
    //console.log(usersInRoom);
    //如果不止一个用户在这个房间里,汇总一下都是谁
    if (usersInRoom && usersInRoom.length && usersInRoom.length > 1) {
        var usersInRoomSummary = 'Users currently in ' + room + ':';
        for (var index in usersInRoom.sockets) {
            //console.log(index);
            if (index != socket.id) {
                usersInRoomSummary += nickNames[index] + ', ';
            }
        }
        usersInRoomSummary += '.';
        //将房间里其他用户的汇总发送给这个用户
        socket.emit('message', {text: usersInRoomSummary});
    }


    // io.in(room).clients(function (error, usersInRoom) {
    //     if (usersInRoom.length > 1) {
    //         var usersInRoomSummary = 'Users currently in ' + room + ': ';
    //         for (var index in usersInRoom) {
    //             var userSockedId = usersInRoom[index].id;
    //             if (userSockedId != socket.id) {
    //                 if (index > 0) {
    //                     usersInRoomSummary += ', ';
    //                 }
    //                 usersInRoomSummary += nickNames[userSockedId];
    //             }
    //         }
    //
    //         usersInRoomSummary += '.';
    //
    //         socket.emit('message', {
    //             text: usersInRoomSummary
    //         });
    //     }
    // })
    //var usersInRoom = io.sockets.clients(room);

}

//发送聊天消息 Socket.IO的broadcase函数是用来转发消息的.
function handleMessageBroadcasting(socket) {
    socket.on('message', function (message) {
        socket.broadcast.to(message.room).emit('message', {
            text: nickNames[socket.id] + ': ' + message.text
        })
    })
}

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    //添加nameAttempt 事件监听器
    socket.on('nameAttempt', function (name) {
        //昵称不能以Guest开头
        if (name.indexOf('Guest') == 0) {
            socket.emit('nameResult', {
                success: false,
                message: 'Names cannot begin with "Guest" .'
            });
        } else {
            //如果昵称还没注册就注册上
            if (namesUsed.indexOf(name) == -1) {
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;
                //删掉之前用的昵称,让其他用户可以使用
                delete namesUsed[previousNameIndex];

                socket.emit('nameResult', {
                    success: true,
                    name: name
                });

                socket.broadcast.to[currentRoom[socket.id]].emit('message', {
                    text: previousName + ' is now known as ' + name + '.'
                });
            } else {
                //如果用户名已经被占用,给客户端发送错误消息
                socket.emit('nameResult', {
                    success: false,
                    message: 'That name is already in use'
                });
            }
        }
    })
}

function handleRoomJoining(socket) {
    socket.on('join', function (room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
    })
}

function handleClientDisconnection(socket, nickNames, namesUsed) {
    socket.on('disconnect', function () {
        var nameIndex = namesUsed.indexOf(nickNames[socket.id]);

        delete namesUsed[nameIndex];

        delete nickNames[socket.id];
    });
}