'use strict';

var _require = require('../utils/clientToServer'),
    dispatchToServer = _require.dispatchToServer;

/**
 * Relay actions received from the server to this client's store
 */


var initServerRelaySystem = function initServerRelaySystem(store, client) {
  client.exports.receiveAction = function (action) {
    store.dispatch(action);
  };
};

module.exports = { initServerRelaySystem: initServerRelaySystem };