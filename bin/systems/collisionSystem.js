'use strict';

// no flow checking cuz it's annoying

var _require = require('../utils/vectors'),
    subtract = _require.subtract,
    distance = _require.distance;

var _require2 = require('../config'),
    config = _require2.config;

var _require3 = require('../selectors/selectors'),
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

    // ship collides with sun
    var gameOver = false;
    var message = '';
    var loserID = null;
    var sun = state.game.sun;

    for (var id in state.game.ships) {
      var ship = state.game.ships[id];
      var distVec = subtract(ship.position, sun.position);
      var dist = distance(distVec);
      if (dist < sun.radius) {
        gameOver = true;
        message = getPlayerByID(state, id).name + ' ran into the sun!';
        loserID = id;
      }
    }

    // ship collides with projectile
    for (var _id in state.game.ships) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = state.game.projectiles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var projectile = _step.value;

          var _ship = state.game.ships[_id];
          var _distVec = subtract(_ship.position, projectile.position);
          var _dist = distance(_distVec);
          // don't get hit by your own laser you just fired
          if (_dist < config.laserSpeed && !(projectile.playerID == _id && projectile.history.length < 5)) {
            gameOver = true;
            message = getPlayerByID(state, _id).name + ' was hit by a ' + projectile.type + '!';
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

    var thisClientID = getClientPlayerID(state);
    if (gameOver && loserID == thisClientID) {
      console.log('gameover', message);
      // stop game
      var readyAction = { type: 'SET_PLAYER_READY', playerID: thisClientID, ready: false };
      dispatchToServer(thisClientID, readyAction);
      dispatch(readyAction);
      var stopAction = { type: 'STOP_TICK' };
      dispatch(stopAction);
      dispatchToServer(thisClientID, stopAction);
      // update scores
      for (var _id2 in state.game.ships) {
        var player = getPlayerByID(state, _id2);
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
      // dispatch modal with message
      var winOrLose = thisClientID == loserID ? 'You Lose!' : 'You Win!';
      var modalAction = {
        type: 'SET_MODAL', title: winOrLose, text: message, name: 'gameover'
      };
      dispatch(modalAction);
      dispatchToServer(thisClientID, modalAction);
    }
  });
};

module.exports = { initCollisionSystem: initCollisionSystem };