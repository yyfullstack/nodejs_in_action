var fs = require('fs');
var completedTasks = 0;
var tasks = [];
var wordCounts = {};
var filesDir = './text';

function checkIfComplete() {
    completedTasks++;
    if (completedTasks == tasks.length) {
        for (var index in wordCounts) {
            console.log(index + ' : ' + wordCounts[index]);
        }
    }
}

/**
 \s：用于匹配单个空格符，包括tab键和换行符；
 \S：用于匹配除单个空格符之外的所有字符；
 \d：用于匹配从0到9的数字；
 \w：用于匹配字母，数字或下划线字符；
 \W：用于匹配所有与\w不匹配的字符；
 . ：用于匹配除换行符之外的所有字符。
 * @param text
 */
function countWordsInText(text) {
    var words = text.toString().toLowerCase().split(/\W+/).sort();
    console.log(words);
    for (var index in words) {
        var word = words[index];
        if (word) {
            wordCounts[word] = wordCounts[word] ? wordCounts[word] + 1 : 1;
        }
    }
}

fs.readdir(filesDir, function(err,files) {
    if(err) {
        throw err;
    }
    //得到text目录的文件列表
    for(var index in files) {
        //定义处理每个文件的任务，每个任务中都会调用一个异步读取文件的函数并对文件中使用的单词计数
        var task = (function(file){
            return function () {
                fs.readFile(file, function (err, text) {
                    if(err) {
                        throw err;
                    }
                    countWordsInText(text);
                    checkIfComplete();
                })
            }
        })(filesDir + '/' + files[index]);
        //把所有任务添加到函数调用数组中
        tasks.push(task);
    }

    //执行所有任务
    for(var task in tasks) {
        tasks[task]();
    }
})