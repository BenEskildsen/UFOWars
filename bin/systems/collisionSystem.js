'use strict';

// no flow checking cuz it's annoying

var _require = require('../utils/vectors'),
    add = _require.add,
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
var floor = Math.floor,
    round = Math.round,
    random = Math.random;


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
          if (_dist2 < _ship2.radius + projectile.radius && !(projectile.playerID == _id2 && projectile.history.length < 25)) {
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
    var thisPlayerIsHost = false;
    for (var _id3 in state.game.ships) {
      if (_id3 == thisClientID) {
        thisPlayerIsHost = true;
      }
      break;
    }

    // missile collides with missile
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = state.game.projectiles[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var projectile1 = _step3.value;
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = state.game.projectiles[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var projectile2 = _step4.value;

            if (projectile1 == projectile2) {
              continue;
            }
            var _distVec3 = subtract(projectile1.position, projectile2.position);
            var _dist3 = distance(_distVec3);
            if (_dist3 < projectile1.radius * 2) {
              var action1 = { type: 'DESTROY_MISSILE', id: projectile1.id, time: time };
              var explosionAction1 = {
                type: 'MAKE_EXPLOSION',
                position: projectile1.position,
                age: config.explosion.age,
                rate: config.explosion.rate + random(),
                color: ['yellow', 'orange', 'white'][floor(random() * 3)],
                radius: round(random() * 5) - 10
              };
              var action2 = { type: 'DESTROY_MISSILE', id: projectile2.id, time: time };
              var explosionAction2 = {
                type: 'MAKE_EXPLOSION',
                position: projectile2.position,
                age: config.explosion.age,
                rate: config.explosion.rate + random(),
                color: ['yellow', 'orange', 'white'][floor(random() * 3)],
                radius: round(random() * 5) - 10
              };
              if (thisPlayerIsHost) {
                dispatch(action1);
                dispatch(action2);
                dispatch(explosionAction1);
                dispatch(explosionAction2);
                dispatchToServer(thisClientID, action1);
                dispatchToServer(thisClientID, action2);
                dispatchToServer(thisClientID, explosionAction1);
                dispatchToServer(thisClientID, explosionAction2);
              }
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
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
      for (var _id4 in state.game.ships) {
        var player = getPlayerByID(state, _id4);
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

      // set explosions
      var playerShip = state.game.ships[loserID];
      var numExplosions = round(random() * 4) + 4;
      for (var i = 0; i < numExplosions; i++) {
        var explosionAction = {
          type: 'MAKE_EXPLOSION',
          position: add(playerShip.position, { x: round(random() * 100) - 50, y: round(random() * 100) - 50 }),
          age: config.explosion.age,
          rate: config.explosion.rate + random(),
          color: ['yellow', 'orange', 'white'][floor(random() * 3)],
          radius: round(random() * 5) - 10
        };
        dispatch(explosionAction);
        dispatchToServer(thisClientID, explosionAction);
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