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
  if (action == null) {
    return;
  }
  console.log('player: ' + playerID + ' dispatches ' + action.type);
  // some actions need to be sent to ALL clients, not just those in this player's game:
  let allClients = false;
  switch (action.type) {
    case 'START':
      dispatchToOtherClients(
        playerID,
        {type: 'START', gameID: action.gameID},
        false, // not all other clients
        true // dispatch to self
      );
      return; // this is kinda hacky *shrug emoji*
    case 'CREATE_GAME':
      games[action.gameID] = {id: action.gameID, players: [], mode: action.mode};
      // fallthrough
    case 'JOIN_GAME':
      clientToGame[playerID] = action.gameID; // assign player to game
      games[action.gameID].players.push(action.playerID);
      allClients = true;
      break;
    case 'SET_PLAYER_NAME':
      allClients = true;
      clientNames[action.playerID] = action.name;
      break;
    case 'CHAT':
      allClients = true;
      chat += clientNames[action.playerID] + ': ' + action.message + '\n';
      break;
  }

  dispatchToOtherClients(playerID, action, allClients);
}

// ------------------------------------------------------------------------------
// Server state
// ------------------------------------------------------------------------------
let nextPlayerID = 0;
const eurecaClients = {}; // PlayerID -> socket.clientProxy
const clientNames = {}; // PlayerID -> string

const LOBBY_ID = 0;
const clientToGame = {}; // PlayerID -> GameID
const games = {}; // GameID -> {id: GameID, players: Array<PlayerID>, mode: GameMode}
let chat = ''

// ------------------------------------------------------------------------------
// each time a client is connected we call
// ------------------------------------------------------------------------------
eurecaServer.onConnect(function (socket) {
  const client = socket.clientProxy; // get remote client ref

  client.receiveAction({
    type: 'CREATE_PLAYER',
    playerID: String(nextPlayerID),
    isThisClient: true,
    name: nextPlayerID, // default name
    gameID: LOBBY_ID
  });

  // update the just-connected client with other clients that may exist
  for (const clientID in eurecaClients) {
    client.receiveAction({
      type: 'CREATE_PLAYER',
      playerID: String(clientID),
      isThisClient: false,
      name: clientNames[clientID] || clientID,
      gameID: clientToGame[clientID] || LOBBY_ID
    });
  }
  // update the just-connected client with other games that may exist
  for (const gameID in games) {
    client.receiveAction({
      type: 'CREATE_GAME',
      playerID: String(games[gameID].players[0]),
      gameID: gameID,
      mode: games[gameID].mode
    });
    if (games[gameID].players.length > 1) {
      for (let i = 1; i < games[gameID].players.length; i++) {
        client.receiveAction({
          type: 'JOIN_GAME',
          gameID: gameID,
          playerID: String(games[gameID].players[i]),
        });
      }
    }
  }
  // update the just-connected client with the chat
  client.receiveAction({
    type: 'SET_CHAT',
    chat: chat + '**** Welcome to UFO Wars ****\n'
  });

  // send chat to the other clients that this one exists
  dispatchToOtherClients(nextPlayerID, {
    type: 'CHAT',
    playerID: nextPlayerID,
    message: 'Hi I have just joined'
  });

  // update the other clients that this one exists
  dispatchToOtherClients(nextPlayerID, {
    type: 'CREATE_PLAYER',
    playerID: String(nextPlayerID),
    isThisClient: false,
    name: nextPlayerID, // default name
    gameID: LOBBY_ID
  }, true /* ALL clients */);

  eurecaClients[nextPlayerID] = client;
  clientNames[nextPlayerID] = nextPlayerID; // default name
  clientToGame[nextPlayerID] = LOBBY_ID;

  nextPlayerID++;
});

// ------------------------------------------------------------------------------
// helpers
// ------------------------------------------------------------------------------

function dispatchToOtherClients(playerID, action, allClients, alsoSelf) {
  const clientsToSendTo = allClients
    ? eurecaClients
    : clientsInGame(clientToGame[playerID]);
  for (const clientID in clientsToSendTo) {
    if (clientID != playerID || alsoSelf) {
      eurecaClients[clientID].receiveAction(action);
    }
  }
}

function clientsInGame(gameID) {
  const clients = {}
  for (const clientID in clientToGame) {
    if (clientToGame[clientID] == gameID) {
      clients[clientID] = eurecaClients[clientID];
    }
  }
  return clients;
}

// ------------------------------------------------------------------------------
// listen to port
// ------------------------------------------------------------------------------
const port = process.env.PORT || 8000;
console.log('\033[96m'+'Listening on localhost: ' + port + '\033[39m');
server.listen(port);
