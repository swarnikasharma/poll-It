var express = require('express');
//var session = require('express-session');
var pollController = require('./controller/connectToDb');
//app.use(session({secret: 'pollsession'}));


var app = express();

app.set('view engine','ejs');

pollController(app);

app.use(express.static(__dirname + 'views')); 
app.listen(3443,function(){

  console.log("server for poll taking started");

});
