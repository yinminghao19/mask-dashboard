var http = require("local-httpjson");
var fs = require('fs');
var path = require('path');
var filePath = path.resolve('./public/data');
http.jsonHttp(8080, 'public');
var request = require('request');
/**
 * 当週取得マスクデータ登録
 */
http.post('/profile', function(res){
    var data = res.data;
    var d = data.split('\n');
    var jsonToday = [];
    d.forEach((lineOne)=>{
        jsonToday.push({entity: lineOne.split('\t')[0], city: lineOne.split('\t')[1], numberOfMasksReceived: lineOne.split('\t')[2]});
    });

    var time = res.time;
    if (!time) {
        time = new Date().toLocaleDateString();
    }
    time = getFirstDayOfWeek(time);
    fs.writeFileSync('./public/data/data'+ time + '.json', JSON.stringify({time: time, data: jsonToday, zs: res.zs}),'utf8');
    return 'OK';
});

/**
 * マスク情報更新
 */
http.post('/toDayTj', function(res){
    var data = res.data;
    var time = res.time;
    if (!time) {
        time = new Date().toLocaleDateString();
    }
    time = getFirstDayOfWeek(time);
    fs.writeFileSync('./public/data/data'+ time + '.json', JSON.stringify(data),'utf8');
    return 'OK';
});

/**
 * 一覧データを取得
 */
http.get('/all', function(res){
    dataFormat();
    var data = fs.readFileSync('./public/data/data.json', {flag: 'r+', encoding: 'utf8'});
    return data;
});

/**
 * 日付ファイル取得
 */
http.get('/timeDate/:time', function(res){
    var time = getFirstDayOfWeek(res.time);
    var data = {};
    var exists = fs.existsSync('./public/data/data'+ time +'.json');
    if (exists) {
        data = fs.readFileSync('./public/data/data'+ time +'.json', {flag: 'r+', encoding: 'utf8'});
    }
    return data;
});

http.get('/allTime', function(){
    var list = [];
    var files  = fs.readdirSync(filePath);
    files.forEach(function(filename){
        if(filename !== 'data.json') {
            var filedir = path.join(filePath, filename);
            var content = fs.readFileSync(filedir, {flag: 'r+', encoding: 'utf8'});
            var data = JSON.parse(content);
            list.push(data.time);
        }
    });
    return list;
});

/**
 * 本週の金曜日の日付を取得する
 * @param {日付} date 
 */
function getFirstDayOfWeek (date) {
    date = new Date(date);
    var day = new Date(date).getDay() || 7;
    var one = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day).getTime();
    var fire = one + (1000 * 60 * 60 * 24 * 4);
    return new Date(fire).toLocaleDateString();
};

function dataFormat(){
    var files  = fs.readdirSync(filePath);
    var masterCount = 0;
    var numberOfRecipients = 0;
    var timeList = [];
    var allList = [];
    files.forEach(function(filename){
        if(filename !== 'data.json') {
            var filedir = path.join(filePath, filename);
            var content = fs.readFileSync(filedir, {flag: 'r+', encoding: 'utf8'});
            var data = JSON.parse(content);
            data.data.forEach((obj)=>{
                
                var oneItme = allList.find((item)=>{
                    return item.entityName === obj.entity;
                });
                var sj = obj.sj;
                if(obj.sj === undefined || obj.sj ===  null){
                    sj = 0;
                }

                if (oneItme) {
                    oneItme[data.time] = obj.numberOfMasksReceived - sj;
                } else {
                    oneItme = {};
                    if (obj.entity !== '' && obj.entity !== undefined && obj.entity !== null) {
                        oneItme['entityName'] = obj.entity;
                        oneItme[data.time] = obj.numberOfMasksReceived - sj;
                        allList.push(oneItme);
                    }
                }
                numberOfRecipients = numberOfRecipients + Number(sj);
            });
            
            timeList.push(data.time);
            masterCount = masterCount + Number(data.zs);
        }
    });

    var result = {
        masterCount: masterCount, 
        numberOfRecipients: numberOfRecipients, 
        numberOfLibraries: masterCount - numberOfRecipients,
        timeList: timeList,
        allList: allList
    };
    fs.writeFileSync('./public/data/data.json', JSON.stringify(result),'utf8');
}