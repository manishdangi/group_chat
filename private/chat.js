var chat = {};
chat.room_join = function(io ,admin_id)
{
	var connect = io.of('/chat');
	console.log(admin_id);
	connect.on('connection',function(socket){
		socket.on('is_room_join_permission',function(value){
			msg = JSON.parse(value);
			socket.join(admin_id);
			socket.to(admin_id).broadcast.emit('is_chat_allow_emit_admin',JSON.stringify({
				user:msg.user
			}))
		})
		socket.on('is_chat_allow_result',function(value){
			msg  = JSON.parse(value);
			socket.leave(admin_id);
			console.log(admin_id + " has left the room");
			if(msg.permission)
			{
				socket.join(msg.room);
				connect.to(msg.room).emit('room_join_success',JSON.stringify({
					value:true,user:msg.user
				}));
			}
			else
			{

				socket.disconnect();
			}
		});
		socket.on('message_sent',function(value){
			msg = JSON.parse(value);
			socket.to(msg.room_no).broadcast.emit('message_broadcast',JSON.stringify({
				text:msg.text,user:msg.user
			}));
		})
	})
}

module.exports = chat;