var fs = require('fs');
var path = require('path');

var args = process.argv.splice(2);//删除前两项

var command = args.shift(); //取出第一个参数

var taskDescription = args.join(' '); //合并剩余参数

var file = path.join(process.cwd(), '/.tasks'); //获取数据库文件

switch (command) {
    case 'list':
        listTasks(file);
        break;
    case 'add':
        addTask(file, taskDescription);
        break;
    default:
        console.log('Usage: ' + process.argv[0] + ' list|add [taskDescription] ');

}

function loadOrInitTaskArray(file, cb) {
    fs.exists(file, function (exists) {
        var tasks = [];
        if (exists) {
            fs.readFile(file, 'utf8', function (err, data) {
                if (err) {
                    throw err;
                }
                var data = data.toString();
                tasks = JSON.parse(data || '[]');
                cb(tasks);
            })
        } else {
            cb(tasks);
        }
    })
}

function listTasks(file) {
    loadOrInitTaskArray(file, function (tasks) {
        for (var i in tasks) {
            console.log(tasks[i]);
        }
    })
}

function storeTasks(file, tasks) {
    fs.writeFile(file, JSON.stringify(tasks), 'utf8', function (err) {
        if (err) {
            throw err;
        }
        console.log('Saved.');
    })
}

function addTask(file, taskDescription) {
    loadOrInitTaskArray(file, function (tasks) {
        tasks.push(taskDescription);
        storeTasks(file, tasks);
    })
}