var chat = {};
chat.room_join = function(io, admin_id)
{
	var connect = io.of('/chat');
	connect.on('connection',function(socket){
		socket.join(admin_id);
		socket.on('is_room_join_permission',function(value){
			chat.remove = socket.id;
			msg = JSON.parse(value);
			socket.to(admin_id).emit('is_chat_allow_emit_admin',JSON.stringify({
				user:msg.user
			}))						
		})
		socket.on('is_chat_allow_result',function(value){
			msg  = JSON.parse(value);
			if(msg.permission)
			{
				socket.to(admin_id).emit("is_chat_allow_result_emit_admin",JSON.stringify({
					result:true
				}));
				delete io.nsps['/chat'].adapter.rooms[admin_id].sockets[chat.remove];
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