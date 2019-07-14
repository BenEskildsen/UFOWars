'use strict';

var _require = require('../selectors/selectors'),
    getPlayerByID = _require.getPlayerByID,
    getClientPlayerID = _require.getClientPlayerID,
    getClientGame = _require.getClientGame;

var _require2 = require('../utils/clientToServer'),
    dispatchToServer = _require2.dispatchToServer;

var initPlayerReadySystem = function initPlayerReadySystem(store) {
  store.subscribe(function () {
    // don't do anything if we're already running
    var state = store.getState();
    if (state.game && state.game.tickInterval) {
      return;
    }

    var allReady = true;
    var clientGame = getClientGame(state);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = clientGame.players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var id = _step.value;

        var player = getPlayerByID(state, String(id));
        if (!player.ready) {
          allReady = false;
          break;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    var playerID = getClientPlayerID(state);
    // only start if everyone is ready, we're not in the lobby, and this player
    // is the "host"
    if (allReady && clientGame.id != '0' && clientGame.players[0] == playerID) {
      dispatchToServer(playerID, { type: 'START', gameID: clientGame.id });
    }
  });
};

module.exports = { initPlayerReadySystem: initPlayerReadySystem };