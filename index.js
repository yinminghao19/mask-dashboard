var express = require("express");
var app = express();
const bodyParser = require('body-parser')
const multer = require('multer') // v1.0.5
const upload = multer() // for parsing multipart/form-data
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
var fs = require('fs');

var request = require('request');

app.use(express.static("public")).listen(8080,()=>{
    console.log('启动成功');
    // dk();
});

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
});

post('/profile', function(res){
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
    fs.writeFileSync('./public/data/data'+ time + '.json', JSON.stringify({time: time, data: jsonToday, zs: req.body.zs}),'utf8');
});

post('/toDayTj', function(res){
    var data = res.data;
    var time = res.time;
    if (!time) {
        time = new Date().toLocaleDateString();
    }
    time = getFirstDayOfWeek(time);
    fs.writeFileSync('./public/data/data'+ time + '.json', JSON.stringify(data),'utf8');
});

get('/all', function(res){
    var data = fs.readFileSync('./public/data/data.json', {flag: 'r+', encoding: 'utf8'});
    return data;
});

get('/timeDate/:time', function(res){
    var time = getFirstDayOfWeek(res.time);
    var data = fs.readFileSync('./public/data/data'+ time +'.json', {flag: 'r+', encoding: 'utf8'});
    return data;
});


function post(url, callback){
    app.post(url, upload.array(), function (req, res, next) {
        callback(req.body);
        res.send('OK');
        next();
    });
}

function get(url, callback){
    app.get(url, (req, res)=>{
        var data = callback(req.params);
        res.send(data);
    });
}

function getFirstDayOfWeek (date) {
    var day = new Date(date).getDay() || 7;
    var one = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day).getTime();
    var fire = one + (1000 * 60 * 60 * 24 * 4);
    return new Date(fire).toLocaleDateString();
};

// function dk(){
//     now = new Date();
//     request.get({
//         // url:'https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5&_t=0.9760834383815831&callback=__jpcb0',
//         url: 'https://api.inews.qq.com/newsqa/v1/automation/foreign/country/ranklist',
//         headers: {
//             "Accept": "application/json;charset=UTF-8",
//             "Cookie": "pac_uid=0_9cbc24b5f14b5; XWINDEXGREY=0; pgv_info=ssid=s8512551360; pgv_pvid=6405351180",
//             "Content-Type": "application/json;charset=UTF-8",
//             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"
//         }
//     },function(error, response, body) {
//         console.log(JSON.parse(body));
//     })
// }