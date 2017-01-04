var room = {};
room.rooms_names = [];

room.room_creation = function(io)
{
	io.on('connection',function(socket)
	{
		console.log("a user has been connected");
		socket.on('room_creation',function(value)
		{		
			msg = JSON.parse(value);
			if(msg.room_no)
			{	
				var room_already_created = false;
				for(i=0;i<room.rooms_names.length;i++)
				{
					if(room.rooms_names[i] == msg.room_no)
					{	
						room_already_created = true;
						break;
					}
				}	
				if(room_already_created)
				{
					socket.emit('room_creation_success',JSON.stringify({value:false}));
				}
				else	
				{
					room.rooms_names.push(msg.room_no);
					socket.emit('room_creation_success',JSON.stringify({value:true}));
				}
			}
		});
	});
}
module.exports = room;