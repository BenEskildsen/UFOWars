'use strict';

// no flow checking cuz it's annoying

var _require = require('../utils/vectors'),
    subtract = _require.subtract,
    distance = _require.distance;

var _require2 = require('../config'),
    config = _require2.config;

var _require3 = require('../selectors/selectors'),
    getOtherPlayerID = _require3.getOtherPlayerID,
    getPlayerByID = _require3.getPlayerByID,
    getClientPlayerID = _require3.getClientPlayerID;

var _require4 = require('../utils/clientToServer'),
    dispatchToServer = _require4.dispatchToServer;

var React = require('React');
var Button = require('../ui/Button.react');

var initCollisionSystem = function initCollisionSystem(store) {

  var time = store.getState().game.time;
  var dispatch = store.dispatch;

  store.subscribe(function () {
    var state = store.getState();
    // only check on a new tick
    if (state.game.time == time || state.game.tickInterval == null) {
      return;
    }
    time = state.game.time;

    var sun = state.game.sun;

    // projectile collides with sun
    // implemented in tickReducer

    var gameOver = false;
    var message = '';
    var loserID = null;

    // ship collides with sun
    for (var id in state.game.ships) {
      var ship = state.game.ships[id];
      var distVec = subtract(ship.position, sun.position);
      var dist = distance(distVec);
      if (dist < sun.radius) {
        gameOver = true;
        message = getPlayerByID(state, id).name + ' crashed into the sun!';
        loserID = id;
      }
    }

    // ship collides with planet
    for (var _id in state.game.ships) {
      var _ship = state.game.ships[_id];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = state.game.planets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var planet = _step.value;

          var _distVec = subtract(_ship.position, planet.position);
          var _dist = distance(_distVec);
          if (_dist < planet.radius) {
            gameOver = true;
            message = getPlayerByID(state, _id).name + ' crashed into the earth!';
            loserID = _id;
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
    }

    // ship collides with projectile
    for (var _id2 in state.game.ships) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = state.game.projectiles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var projectile = _step2.value;

          var _ship2 = state.game.ships[_id2];
          var _distVec2 = subtract(_ship2.position, projectile.position);
          var _dist2 = distance(_distVec2);
          // don't get hit by your own laser you just fired
          if (_dist2 < _ship2.radius + projectile.radius && !(projectile.playerID == _id2 && projectile.history.length < 10)) {
            gameOver = true;
            message = getPlayerByID(state, _id2).name + ' was hit by a ' + projectile.type + '!';
            loserID = _id2;
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
    }

    var thisClientID = getClientPlayerID(state);
    if (gameOver && loserID == thisClientID) {
      var otherPlayerID = getOtherPlayerID(state);

      // set ready state for both players
      var readyAction = { type: 'SET_PLAYER_READY', playerID: thisClientID, ready: false };
      dispatchToServer(thisClientID, readyAction);
      dispatch(readyAction);
      var otherReadyAction = {
        type: 'SET_PLAYER_READY', playerID: otherPlayerID, ready: false
      };
      dispatchToServer(thisClientID, otherReadyAction);
      dispatch(otherReadyAction);

      // stop game
      var stopAction = { type: 'STOP_TICK' };
      dispatch(stopAction);
      dispatchToServer(thisClientID, stopAction);

      // update scores
      for (var _id3 in state.game.ships) {
        var player = getPlayerByID(state, _id3);
        if (player.id != loserID) {
          var scoreAction = {
            type: 'SET_PLAYER_SCORE',
            playerID: player.id,
            score: player.score + 1
          };
          dispatch(scoreAction);
          dispatchToServer(thisClientID, scoreAction);
        }
      }
      // dispatch modals with messages
      dispatch({
        type: 'SET_MODAL', title: 'You Lose!', text: message, name: 'gameover'
      });
      dispatchToServer(thisClientID, {
        type: 'SET_MODAL', title: 'You Win!', text: message, name: 'gameover'
      });
    }
  });
};

module.exports = { initCollisionSystem: initCollisionSystem };