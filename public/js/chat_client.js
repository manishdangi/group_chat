var socket = io('/chat');

var chat = {};
chat.room_no = location.search.split('?')[1].slice(5);

chat.username = prompt('Enter your username');
socket.emit('room_join',JSON.stringify({room_no:chat.room_no,user:chat.username}));	

socket.on('room_join_success',function(value){
	msg = JSON.parse(value);
	if(msg)
	{
		$("#room_messages").append('<p>'+msg.user + " has joined the room" + '</p>');
	}
});

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