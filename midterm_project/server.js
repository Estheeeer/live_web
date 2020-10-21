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
var https = require('https');

// Security options - key and certificate
var options = {
  key: fs.readFileSync('star_itp_io.key'),
  cert: fs.readFileSync('star_itp_io.pem')
};

// We pass in the Express object and the options object
var httpServer = https.createServer(options, app);

// Default HTTPS port
httpServer.listen(443);


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);


// socket.on('connect', function() {
// });
// 
// socket.on('connect', () => {
// });

let hiddenSurpriseLocation = {
	x: Math.random(),
	y: Math.random()
}

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
	// We are given a websocket object in our function
	function (socket) {
	
		console.log("We have a new client: " + socket.id);

		// tell the surprise location to new client
		socket.emit('surpriselocation', hiddenSurpriseLocation)

		socket.on('surprise', function(data) {
			// send surprise image to all clients
			io.emit('surpriseimage', data)

			// generate new location
			hiddenSurpriseLocation = {
				x: Math.random(),
				y: Math.random()
			}
			
			// tell all clients to update the surprise location
			io.emit('surpriselocation', hiddenSurpriseLocation)
		});

		socket.on('chatmessage', function(data) {
			const datatosend = {
				id: socket.id,
				message: data
			}
			io.emit('chatmessage', datatosend);
		});

		socket.on('locationchange', function(data) {
			const datatosend = {
				id: socket.id,
				location: data
			}
			io.emit('locationchange', datatosend);
		})

		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);
