'use strict';

var _require = require('../utils/errors'),
    invariant = _require.invariant;

var getClientPlayerID = function getClientPlayerID(state) {
  return getClientPlayer(state).id;
};

var getClientPlayer = function getClientPlayer(state) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = state.players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var player = _step.value;

      if (player.isThisClient) {
        return player;
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

  invariant(false, 'this client has no player');
};

var getClientGame = function getClientGame(state) {
  return state.games[getClientPlayer(state).gameID];
};

/**
 *  Since the client should know about all games that exist, it can compute this?
 *  TODO this is insanely dangerous though
 */
var getNextGameID = function getNextGameID(state) {
  var nextGameID = -1;
  for (var gameID in state.games) {
    if (parseInt(gameID) > nextGameID) {
      nextGameID = parseInt(gameID);
    }
  }
  // what're the odds there's a collision!?
  return '' + (nextGameID + Math.round(Math.random() * 100));
};

module.exports = {
  getClientPlayerID: getClientPlayerID,
  getClientPlayer: getClientPlayer,
  getClientGame: getClientGame,
  getNextGameID: getNextGameID
};