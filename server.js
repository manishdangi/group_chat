var http = require('http');
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

var server = http.createServer(app);
server.listen(3000,function(){
	console.log("server is running at port number 3000")
});
var io = require('socket.io').listen(server);

var rooms = require('./private/room');
var chats = require('./private/chat')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname,'public','views','room.html'),function(){
		res.end();	
	});
	
})
app.get('/chat',function(req,res){
	// console.log(req.body);
	res.sendFile(path.join(__dirname,'public','views','chat.html'),function(){
		res.end();	
	});
	
})

rooms.room_creation(io);
chats.room_join(io);