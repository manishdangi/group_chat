var socket = io('/');

document.onload = function(){
	room = document.getElementById('room');
	submit = document.getElementById('submit');	
}
submit.addEventListener('click',function(){
	socket.emit('room_creation',JSON.stringify({room_no:room.value}))
})

socket.on('room_creation_success',function(msg){
	msg = JSON.parse(msg);
	if(msg.value)
	{
		alert("your room has been successfully created");
	}
	else
	{
		alert("the room is already created so try with new one");
	}
})