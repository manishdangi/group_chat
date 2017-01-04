var chat = {};
chat.room_join = function(io)
{

	var connect = io.of('/chat');
	connect.on('connection',function(socket){
		socket.on('room_join',function(value){
			msg = JSON.parse(value);
			socket.join(msg.room_no);
			connect.to(msg.room_no).emit('room_join_success',
				JSON.stringify({value:true,user:msg.user}));
		})
		socket.on('message_sent',function(value){
			msg = JSON.parse(value);
			socket.to(msg.room_no).broadcast.emit('message_broadcast',JSON.stringify({
				text:msg.text,user:msg.user
			}));
		})
	})
}

module.exports = chat;