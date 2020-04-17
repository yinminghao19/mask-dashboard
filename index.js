var express = require("express");
var app = express();
const bodyParser = require('body-parser')
const multer = require('multer') // v1.0.5
const upload = multer() // for parsing multipart/form-data
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
var fs = require('fs');

app.use(express.static("public")).listen(8080,()=>{
    console.log('启动成功');
});

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
});

app.post('/profile', upload.array(), function (req, res, next) {
    var data = req.body.data;
    var d = data.split('\n');
    var jsonToday = [];
    d.forEach((lineOne)=>{
        jsonToday.push({entity: lineOne.split('\t')[0], city: lineOne.split('\t')[1], numberOfMasksReceived: lineOne.split('\t')[2]});
    });

    var time = req.body.time;
    if (!time) {
        time = new Date().toLocaleDateString();
    }
    fs.writeFileSync('./public/data/data'+ time + '.json', JSON.stringify({time: time, data: jsonToday, zs: req.body.zs}),'utf8');
    res.send('OK');
    next();
});

app.post('/toDayTj', upload.array(), function (req, res, next) {
    var data = req.body.data;
    var time = req.body.time;
    if (!time) {
        time = new Date().toLocaleDateString();
    }
    fs.writeFileSync('./public/data/data'+ time + '.json', JSON.stringify(data),'utf8');
    res.send('OK');
    next();
});

app.get('/all', (req, res)=>{
    var data = fs.readFileSync('./public/data/data.json', {flag: 'r+', encoding: 'utf8'});
    res.send(data);
});

app.get('/timeDate/:time', (req, res)=>{
    var data = fs.readFileSync('./public/data/data'+ req.params.time +'.json', {flag: 'r+', encoding: 'utf8'});
    res.send(data);
});