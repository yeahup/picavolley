var app = require('express')();

var server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);

// localhost:3000으로 서버에 접속하면 클라이언트로 index.html을 전송한다
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/multi.html');
});

app.get("/js/:src", function (req, res) {
  res.sendFile(__dirname + '/js/'+req.params.src);
})

app.get("/css/:src", function (req, res) {
  res.sendFile(__dirname + '/css/'+req.params.src);
})

app.get("/images/:src", function (req, res) {
  res.sendFile(__dirname + '/images/'+req.params.src);
})

app.get("/sound/:src", function (req, res) {
  res.sendFile(__dirname + '/sound/'+req.params.src);
})

function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}

var room_playing = {};
var room_idle = {};
var peers = {};


// namespace /gameroom에 접속한다.
var chat = io.of('/gameroom').on('connection', function(socket) {
	
	console.log(io.sockets.adapter.rooms);
	
	socket.on('join request', function(data){
		
    console.log('join request client: ', data);
	
    console.log("playing room cnt : " + Object.keys(room_playing).length);
    console.log("idle room cnt : " + Object.keys(room_idle).length);

	
	if(Object.keys(room_idle).length > 0)
	{
		var roomCode = "";
		for(key in room_idle){
			
			item = room_idle[key];
			roomCode = key;
			
			item.peers.push(socket.id);
			
			room_playing[roomCode] = item;
			
			delete room_idle[key];
			
			break;
		}
    
	
		socket.join(roomCode);
		// room에 join되어 있는 클라이언트에게 메시지를 전송한다
		chat.to(roomCode).emit('matched', {my_team:1, peers:room_playing[roomCode].peers});
		
		console.log("matched:"+room_playing[roomCode].peers[0] + " vs " + room_playing[roomCode].peers[1]);
		
		//socket.broadcast.to(room_playing[roomCode].peers[0]).emit('matched', {my_team:1});
		//socket.broadcast.to(room_playing[roomCode].peers[1]).emit('matched', {my_team:2});
	}
	else
	{
		var roomCode = "";
		
		do{
			roomCode = makeid(8);
		} while(roomCode in room_idle || roomCode in room_playing);
		
		room_idle[roomCode] = {
			peers:[socket.id]
		};
		
		
		
		socket.join(roomCode);
		chat.to(roomCode).emit('waiting', {roomCode:roomCode});
	}
	
	peers[socket.id] = roomCode;
	
	
	
  });
  
  socket.on('hit ground', function(data){
	var roomCode = peers[socket.id];
	chat.to(roomCode).emit('game set', data);
  });
  
  socket.on('room leave', function(data){
		
	socket.leave(data.roomCode);
	
	if(data.roomCode in room_idle)
	{
		delete room_idle[data.roomCode];
	}
	else if(data.roomCode in room_playing)
	{
		chat.to(data.roomCode).emit('opposite escaped', {});
		
		var index = room_playing[data.roomCode].peers.indexOf(socket.id);
		
		if (index !== -1) {
		  room_playing[data.roomCode].peers.splice(index, 1);
		}
		
		room_idle[data.roomCode] = room_playing[data.roomCode];
		delete room_playing[data.roomCode];
	}
	
  });
  
  socket.on("time sync", function(data){
	  
	  var roomCode = peers[socket.id];  
	  var room = room_playing[roomCode];
	  var playTime = data.playTime;
	  var ballPosition = data.ballPosition;
	  
	  //chat.to(roomCode).emit('time sync user', {playTime:playTime}); 
	  
		if(room)
		{
			if(room.peers[0] == socket.id)
			{
			 socket.broadcast.to(room.peers[1]).emit('time sync user', data); 
			}
			else
			{
			 socket.broadcast.to(room.peers[0]).emit('time sync user', data); 
			} 
		}
		else
		{
		 
		}
	 
  });
  
  socket.on("time pause", function(data){
	  
	  var roomCode = peers[socket.id];  
	  var room = room_playing[roomCode];
	  var pause = data.pause;
	  
	  //chat.to(roomCode).emit('time sync user', {playTime:playTime}); 
	  
		if(room)
		{
			if(room.peers[0] == socket.id)
			{
			 socket.broadcast.to(room.peers[1]).emit('time pause user', {pause:pause}); 
			}
			else
			{
			 socket.broadcast.to(room.peers[0]).emit('time pause user', {pause:pause}); 
			} 
		}
		else
		{
		 
		}
	 
  });
  
  socket.on("positions", function(data){
	  
	  var roomCode = peers[socket.id]; 
	  
	  chat.to(roomCode).emit('positions', data); 
  });
  
  socket.on("keyDown", function(data){
	 
	 keyCode = data.keyCode;
	 
	 var roomCode = peers[socket.id];
	 var room = room_playing[roomCode];
	 
	 if(room)
	 {
		 if(room.peers[0] == socket.id)
		 {
			 socket.broadcast.to(room.peers[1]).emit('op key down', {keyCode:keyCode});
		 }
		 else
		 {
			 socket.broadcast.to(room.peers[0]).emit('op key down', {keyCode:keyCode});
		 } 
	 }
	 else
	 {
		 
	 }
  });
  
  socket.on("keyUp", function(data){
	 
	 keyCode = data.keyCode;
	 
	 var roomCode = peers[socket.id];
	 var room = room_playing[roomCode];
	 
	 if(room)
	 {
		 if(room.peers[0] == socket.id)
		 {
			 socket.broadcast.to(room.peers[1]).emit('op key up', {keyCode:keyCode});
		 }
		 else
		 {
			 socket.broadcast.to(room.peers[0]).emit('op key up', {keyCode:keyCode});
		 }
	 }
	 else
	 {
		 
	 }
  });
  
  
  
	socket.on('disconnect', function(data) {
		
		console.log(socket.id + " disconnected.");
		
		if(peers[socket.id] !== 'undefined')
		{
			var roomCode = peers[socket.id];
			
			socket.leave(roomCode);
		
			if(roomCode in room_idle)
			{
				delete room_idle[roomCode];
			}
			else if(roomCode in room_playing)
			{
				chat.to(roomCode).emit('opposite escaped', {});
				
				var index = room_playing[roomCode].peers.indexOf(socket.id);
				
				if (index !== -1) {
				  room_playing[roomCode].peers.splice(index, 1);
				}
				
				room_idle[roomCode] = room_playing[roomCode];
				delete room_playing[roomCode];
			}
			delete peers[socket.id];
		}
		
	})
  
})

server.listen(3600, function() {
  console.log('Socket IO server listening on port 3600');
});