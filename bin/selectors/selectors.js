'use strict';

var _require = require('../utils/errors'),
    invariant = _require.invariant;

var _require2 = require('../config'),
    config = _require2.config;

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

var getOtherPlayerID = function getOtherPlayerID(state) {
  var game = getClientGame(state);
  var clientPlayerID = getClientPlayerID(state);

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = game.players[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var id = _step2.value;

      if (id !== clientPlayerID) {
        return id;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
};

var getPlayerByID = function getPlayerByID(state, playerID) {
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = state.players[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var player = _step3.value;

      if (player.id == playerID) {
        return player;
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  invariant(false, 'no player with id ' + playerID);
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

var getPlayerColor = function getPlayerColor(state, playerID) {
  var colorIndex = state.game.gamePlayers.indexOf(playerID) + 1;
  return config.playerColors[colorIndex];
};

var getNextTarget = function getNextTarget(state, playerID) {
  var ships = state.ships,
      planets = state.planets,
      projectiles = state.projectiles;

  var entities = Object.values(ships).concat(projectiles).concat(planets);
  var entityIDs = entities.map(function (entity) {
    return entity.id;
  });

  var currentShip = ships[playerID];
  var currentTarget = currentShip.target;
  var currentIndex = entityIDs.indexOf(currentTarget);
  console.log('currentIndex ', currentIndex);

  var nextIndex = (currentIndex + 1) % entities.length;
  while (entities[nextIndex].playerID == playerID) {
    nextIndex = (nextIndex + 1) % entities.length;
  }

  return entities[nextIndex].id;
};

var getEntityByID = function getEntityByID(state, id) {
  var ships = state.ships,
      planets = state.planets,
      projectiles = state.projectiles;

  var entities = Object.values(ships).concat(projectiles).concat(planets);
  var entityIDs = entities.map(function (entity) {
    return entity.id;
  });

  var index = entityIDs.indexOf(id);
  if (index == -1) {
    return null;
  }
  return entities[index];
};

module.exports = {
  getClientPlayerID: getClientPlayerID,
  getOtherPlayerID: getOtherPlayerID,
  getClientPlayer: getClientPlayer,
  getClientGame: getClientGame,
  getPlayerByID: getPlayerByID,
  getNextGameID: getNextGameID,
  getPlayerColor: getPlayerColor,
  getNextTarget: getNextTarget,
  getEntityByID: getEntityByID
};