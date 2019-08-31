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
    getClientPlayerID = _require3.getClientPlayerID,
    getHostPlayerID = _require3.getHostPlayerID,
    getGameMode = _require3.getGameMode;

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
    var bothLose = false;
    var gameMode = getGameMode(state);

    // ship collides with sun
    for (var _id in state.game.ships) {
      var ship = state.game.ships[_id];
      var distVec = subtract(ship.position, sun.position);
      var dist = distance(distVec);
      if (dist < sun.radius) {
        gameOver = true;
        message = getPlayerByID(state, _id).name + ' crashed into the sun!';
        loserID = _id;
      }
    }

    // ship collides with planet
    for (var _id2 in state.game.ships) {
      var _ship = state.game.ships[_id2];
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
            message = getPlayerByID(state, _id2).name + ' crashed into the earth!';
            loserID = _id2;
            if (gameMode == 'coop') {
              bothLose = true;
            }
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
    for (var _id3 in state.game.ships) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = state.game.projectiles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var projectile = _step2.value;

          var _ship2 = state.game.ships[_id3];
          var _distVec2 = subtract(_ship2.position, projectile.position);
          var _dist2 = distance(_distVec2);
          // don't get hit by your own laser you just fired
          if (_dist2 < _ship2.radius + projectile.radius && !(projectile.playerID == _id3 && projectile.history.length < 25)) {
            gameOver = true;
            message = getPlayerByID(state, _id3).name + ' was hit by a ' + projectile.type + '!';
            loserID = _id3;
            if (gameMode == 'coop') {
              bothLose = true;
            }
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
    var thisPlayerIsHost = thisClientID === getHostPlayerID(state);

    // missile collides with missile
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = state.game.projectiles[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var projectile1 = _step3.value;
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = state.game.projectiles[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var projectile2 = _step7.value;

            if (projectile1 == projectile2) {
              continue;
            }
            var _distVec4 = subtract(projectile1.position, projectile2.position);
            var _dist4 = distance(_distVec4);
            if (_dist4 < projectile1.radius * 2) {
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
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
              _iterator7.return();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }
      }

      // projectile collides with asteroid
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

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = state.game.projectiles[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var _projectile = _step4.value;
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = state.game.asteroids[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var _asteroid = _step8.value;

            var _distVec5 = subtract(_projectile.position, _asteroid.position);
            var _dist5 = distance(_distVec5);
            if (_dist5 < _asteroid.radius + 5) {
              var _action = { type: 'DESTROY_MISSILE', id: _projectile.id, time: time };
              var _action2 = { type: 'DESTROY_ASTEROID', id: _asteroid.id, time: time };
              var _explosionAction = {
                type: 'MAKE_EXPLOSION',
                position: _asteroid.position,
                age: config.explosion.age,
                rate: config.explosion.rate + random(),
                color: ['yellow', 'orange', 'white'][floor(random() * 3)],
                radius: round(random() * 5) - 10
              };
              if (thisPlayerIsHost) {
                dispatch(_action);
                dispatch(_action2);
                dispatch(_explosionAction);
                dispatchToServer(thisClientID, _action);
                dispatchToServer(thisClientID, _action2);
                dispatchToServer(thisClientID, _explosionAction);
              }
            }
          }
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
              _iterator8.return();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }
      }

      // asteroid collides with planet
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

    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = state.game.asteroids[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var _asteroid2 = _step5.value;
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
          for (var _iterator9 = state.game.planets[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var _planet = _step9.value;

            var _distVec6 = subtract(_asteroid2.position, _planet.position);
            var _dist6 = distance(_distVec6);
            // only host does this computation
            if (_dist6 < _planet.radius && thisPlayerIsHost) {
              gameOver = true;
              message = 'an asteroid crashed into the earth!';
              loserID = id;
              var _bothLose = true;
            }
          }
        } catch (err) {
          _didIteratorError9 = true;
          _iteratorError9 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion9 && _iterator9.return) {
              _iterator9.return();
            }
          } finally {
            if (_didIteratorError9) {
              throw _iteratorError9;
            }
          }
        }
      }

      // ship collides with asteroid
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    for (var _id4 in state.game.ships) {
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = state.game.asteroids[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var asteroid = _step6.value;

          var _ship3 = state.game.ships[_id4];
          var _distVec3 = subtract(_ship3.position, asteroid.position);
          var _dist3 = distance(_distVec3);
          if (_dist3 < _ship3.radius + asteroid.radius) {
            gameOver = true;
            message = getPlayerByID(state, _id4).name + ' was hit by an asteroid!';
            loserID = _id4;
            if (gameMode == 'coop') {
              bothLose = true;
            }
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
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
      for (var _id5 in state.game.ships) {
        var player = getPlayerByID(state, _id5);
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
      var otherPlayerTitle = bothLose ? 'You Lose!' : 'You Win!';
      dispatchToServer(thisClientID, {
        type: 'SET_MODAL', title: otherPlayerTitle, text: message, name: 'gameover'
      });
    }
  });
};

module.exports = { initCollisionSystem: initCollisionSystem };