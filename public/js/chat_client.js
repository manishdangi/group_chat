var socket = io('/chat');
var chat = {};

chat.room_no = location.search.split('?')[1].slice(5);
chat.username = prompt('Enter your username');

socket.emit('room_join_permission',JSON.stringify({user:chat.username}));

socket.on("admin_room_join",function(value){
	webrtc.joinRoom(chat.room_no);
})

socket.on('is_chat_allow_admin',function(value){
	msg = JSON.parse(value);
	var chat_permission = confirm(msg.user+" wants to join the room");
	socket.emit('is_chat_allow_result',JSON.stringify({
		permission:chat_permission,room:chat.room_no,user:msg.user
	}))
})

socket.on('room_join_success',function(value){
	msg = JSON.parse(value);
	if(msg)
	{
		$("#room_messages").append('<p>'+msg.user + " has joined the room" + '</p>');
	}
});

socket.on('chat_allow_result_to_admin',function(value){
	msg = JSON.parse(value);
	if(msg.result)
	{
		alert("admin has allowed to join the room");
		webrtc.joinRoom(chat.room_no);
	}
	else
	{
		window.location = "/";
		alert("admin has not allowed to join the room")
	}
})

$("#send_message").click(function(){
	if($("#messages").val()!=null)
	{
		socket.emit("message_sent",JSON.stringify({
			text:$("#messages").val(),user:chat.username,room_no:chat.room_no
		}));
		$("#inbox_messages").append(
			"<div> <p class='inline-block' >you: "+$("#messages").val()+"</p></div>"
		);

	}
	$("#messages").val(null);
})

socket.on('message_broadcast',function(value){
	msg = JSON.parse(value);
	$("#inbox_messages").append(
		"<div> <p class='inline-block'>"+msg.user + ": " +msg.text +"</p></div>"
	);
})