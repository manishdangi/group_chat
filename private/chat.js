var chat = {};
chat.room_join = function(io, admin_id)
{
	var connect = io.of('/chat');
	connect.on('connection',function(socket){
		socket.join(admin_id); 
		socket.emit("admin_room_join")
		/*	this admin_id will come from dtabase in actual app as many
			rooms can be activated in the app on the same time */ 
		socket.on('room_join_permission',function(value){
			chat.remove = socket.id;
			msg = JSON.parse(value);
			socket.to(admin_id).emit('is_chat_allow_admin',JSON.stringify({
				user:msg.user
			}))						
		})
		socket.on('is_chat_allow_result',function(value){
			msg  = JSON.parse(value);
			delete io.nsps['/chat'].adapter.rooms[admin_id].sockets[chat.remove];
			if(msg.permission)
			{
				socket.to(admin_id).emit("chat_allow_result_to_admin",JSON.stringify({
					result:true
				}));
			}
			else
			{
				socket.to(admin_id).emit("chat_allow_result_to_admin",JSON.stringify({
					result:false
				}));
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