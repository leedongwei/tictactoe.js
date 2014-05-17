// Remember to edit port number in config.js
var config = require('./config_node.js');

/** 
 * Initializing different worlds
 */
var worlds = {};
var list_worlds = [];
var initialState = '{"x1":{"x":20,"y":80},"x2":{"x":80,"y":80},"x3":{"x":140,"y":80},"x4":{"x":200,"y":80},"x5":{"x":260,"y":80},"o1":{"x":20,"y":140},"o2":{"x":80,"y":140},"o3":{"x":140,"y":140},"o4":{"x":200,"y":140},"o5":{"x":260,"y":140},"tttboard":{"x":20,"y":200}}';



/** 
 * Creating socket
 */
console.log("starting e8server.js...");
var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: config.port});
var outgoingMsg={};

wss.on('close', function() {
    console.log('disconnected');
});

wss.broadcast = function(ws, message) {
	console.log('broadcasting to all...');
    for(var i in this.clients){
		if (this.clients[i] != ws)
			this.clients[i].send(message);
	}
};

wss.on('connection', function(ws) {	
	// send list of worlds upon connection
	ws.send('00' + JSON.stringify(list_worlds));		// '00': op for sending list of worlds
	
	ws.on('message', function(message) {
		console.log('received: %s', message);
		var op = message.substring(0,2);
		var newdata = message.substring(2, message.length)
		
		switch (op) {
			case '00': // create a new world
				createNewWorld(newdata);
				// No break needed
			case '01': // select a existing world
				outgoingMsg = {};
				outgoingMsg[newdata] = worlds[newdata];
				ws.send('11' + JSON.stringify(outgoingMsg)); 		// '11': op for update world state
				break;
			case '11': // update a world state
				wss.broadcast(ws, message);
				deltaWorldState = JSON.parse(newdata);
				updateWorldState();
				break;
		}
	});
});



/**
 * Changes to world state
 */
var deltaWorldState = {};

function createNewWorld(new_name) {
	var isValid = true;
	for(var i in list_worlds) {
		if (list_worlds[i] == new_name) {
			isValid = false;
		}
	}
	
	if (isValid) {
		list_worlds.push(new_name);
		worlds[new_name] = JSON.parse(initialState);
		console.log("\r\n\r\nCREATED: %s", JSON.stringify(worlds));
	}
}

function updateWorldState() {	
	for (var i in deltaWorldState) {
		for (var j in deltaWorldState[i]) {
			for (var k in deltaWorldState[i][j]) {
				worlds[i][j][k] = deltaWorldState[i][j][k];
			}
		}
	}
	console.log('updated:  %s\r\n', JSON.stringify(worlds));
};