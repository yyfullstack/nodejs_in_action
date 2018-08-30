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
        console.log('Usage: ' + process.argv(0) + ' list|add [taskDescription] ');

}
