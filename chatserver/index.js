var express = require('express');
var config = require('./config.js');
var bodyParser = require("body-parser"); 
var router = require('./router.js');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/',router);
app.use(bodyParser.json())
app.listen(config.port,function(){
    console.log('服务器启动了,请访问：http://localhost:'+config.port)
})

