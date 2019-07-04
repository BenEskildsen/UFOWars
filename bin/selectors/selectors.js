'use strict';

var _require = require('../utils/errors'),
    invariant = _require.invariant;

var getClientPlayerID = function getClientPlayerID(state) {
  var playerID = null;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = state.players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var player = _step.value;

      if (player.isThisClient) {
        playerID = player.id;
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

  invariant(playerID != null, 'no playerID matches this client');
  return playerID;
};

module.exports = {
  getClientPlayerID: getClientPlayerID
};