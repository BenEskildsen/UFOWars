/**
 * Call these functions to send info to the server
 */

let server = null;
const setupClientToServer = (store) => {
  const client = new Eureca.Client();
  // relay actions received from the server to this client's store
  client.exports.receiveAction = (action) => {
    console.log(action);
    store.dispatch(action);
  }
  client.ready(function (serverProxy) {
    server = serverProxy;
  });
  return client;
};

const dispatchToServer = (playerID, action) => {
  server.dispatch(playerID, action);
};

module.exports = {
  setupClientToServer,
  dispatchToServer,
};
