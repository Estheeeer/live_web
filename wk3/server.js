// Express is a node module for building HTTP servers
var express = require('express');
var app = express();

// read files
var fs = require('fs');

// Tell Express to look in the "public" folder for any files first
app.use(express.static('public'));

// If the user just goes to the "route" / then run this function
app.get('/', function (req, res) {
  res.send('Hello World!')
});


// Here is the actual HTTP server
var http = require('http');
// We pass in the Express object
var httpServer = http.createServer(app);
// Listen on port 80
httpServer.listen(80);


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);


// socket.on('connect', function() {
// });
// 
// socket.on('connect', () => {
// });


// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
	// We are given a websocket object in our function
	function (socket) {
	
		console.log("We have a new client: " + socket.id);
		
		socket.on('drawing', function(data) {
			io.emit('drawing', data);
		});

		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);
