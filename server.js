var express = require('express')
  , app = express(app); // ... sigh, I have no idea what this does
var http = require('http');
var fs = require('fs');
var server = http.createServer(app);

var Eureca = require('eureca.io');

// Create eureca server
// and allow it to call the following remote functions
var eurecaServer = new Eureca.Server({ allow: ['connectedToServer', 'receiveAction'] });
app.use(express.static(__dirname));

//attach it to http server
eurecaServer.attach(server);

// ------------------------------------------------------------------------------
// functions under exports namespace become callable from client side
// ------------------------------------------------------------------------------
eurecaServer.exports.dispatch = function (playerID, action) {
  if (action != null) {
    console.log('player: ' + playerID + ' dispatches ' + action.type);
  }
  dispatchToOtherClients(playerID, action);
}

// ------------------------------------------------------------------------------
// each time a client is connected we call
// ------------------------------------------------------------------------------
const clients = {}; // track clients
let nextID = 0;
eurecaServer.onConnect(function (socket) {
  const client = socket.clientProxy; // get remote client ref

  client.receiveAction({
    type: 'CREATE_PLAYER',
    id: nextID,
    isThisClient: true,
    name: nextID // TODO
  });

  // update the just-connected client with other clients that may exist
  for (const clientID in clients) {
    client.receiveAction({
      type: 'CREATE_PLAYER',
      id: clientID,
      isThisClient: false,
      name: clientID, // TODO track player names
    });
  }

  // update the other clients that this one exists
  dispatchToOtherClients(nextID, {
    type: 'CREATE_PLAYER',
    id: nextID,
    isThisClient: false,
    name: nextID // TODO
  });

  clients[nextID] = client;

  nextID++;
});

// ------------------------------------------------------------------------------
// helpers
// ------------------------------------------------------------------------------

function dispatchToOtherClients(playerID, action) {
  for (const clientID in clients) {
    if (clientID != playerID) {
      clients[clientID].receiveAction(action);
    }
  }
}

// ------------------------------------------------------------------------------
// listen to port
// ------------------------------------------------------------------------------
const port = process.env.PORT || 8000;
console.log('\033[96m'+'Listening on localhost: ' + port + '\033[39m');
server.listen(port);
