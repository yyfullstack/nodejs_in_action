var fs = require('fs');
var request = require('request');
var htmlparser = require('htmlparser');

var configFilename = './rss_feeds.txt';

function checkForRssFile() {
    //任务1: 确保包含RSS 预定源URL列表的文件存在
    fs.exists(configFilename, function (exists) {
        if (!exists) {
            return next(new Error('Missing RSS file: ' + configFilename));
        }
        next(null, configFilename);
    })
}

function readRssFile(configFilename) {
    //任务2: 读取并解析包含预定源URL的文件
    fs.readFile(configFilename, function (err, feedList) {
        if (err) {
            return next(err);
        }

        feedList = feedList.toString().replace(/^\s+|\s+$/g, '').split('\n');
        console.log(feedList);
        var random = Math.floor(Math.random() * feedList.length);
        console.log(random);
        next(null, feedList[random]);
    });
}

function downloadRssFeed(feedUrl) {
    //任务3: 向选定的预定源发送HTTP 请求以获取数据
    request({uri: feedUrl}, function (err, res, body) {
        if (err) {
            return next(err);
        }

        if (res.statusCode != 200) {
            return next(new Error('Abnormal response status code'));
        }
        //console.log("body: "+ body);
        next(null, body);
    });
}

function parseRssFeed(rss) {
    //任务4: 将预定源数据解析到一个条目数组中
    var handler = new htmlparser.RssHandler();
    var parser = new htmlparser.Parser(handler);

    parser.parseComplete(rss);

    if (!handler.dom.items.length) {
        return next(new Error('No Rss items found !'));
    }

    var items = handler.dom.items;
    for (var i in  items) {
        console.log(items[i].title);
        console.log(items[i].link);
    }
}

var tasks = [checkForRssFile, readRssFile, downloadRssFeed, parseRssFeed];

function next(err, result) {
    if (err) {
        throw err;
    }
    var currentTask = tasks.shift();
    if (currentTask) {
        currentTask(result);
    }
}

next();