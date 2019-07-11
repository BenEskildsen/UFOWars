"use strict";

/**
 * Call these functions to send info to the server
 */

var server = null;
var setupClientToServer = function setupClientToServer(store) {
  var client = new Eureca.Client();
  // relay actions received from the server to this client's store
  client.exports.receiveAction = function (action) {
    store.dispatch(action);
  };
  client.ready(function (serverProxy) {
    server = serverProxy;
  });
  return client;
};

var dispatchToServer = function dispatchToServer(playerID, action) {
  server.dispatch(playerID, action);
};

module.exports = {
  setupClientToServer: setupClientToServer,
  dispatchToServer: dispatchToServer
};