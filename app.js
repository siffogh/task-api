// import useful modules & set up variables

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dbUrl = require('./app/config/db').url;
var routes = require('./app/routes');

//Will be used for logs
var server_logs = "SERVER---- ";

// Application Port that can be changed if 3000 is not available
var PORT = 3000;

// Connect to database
mongoose.connect(dbUrl,function(err){
	if(err)
		throw err;

	console.log(server_logs+'Mongodb connection successful');
});

// Server
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/api',routes);

app.listen(PORT,function(){
	console.log(server_logs+'Listening on port 3000');
})