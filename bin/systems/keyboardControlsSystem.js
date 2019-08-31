'use strict';

var _require = require('../config'),
    config = _require.config;

var _require2 = require('../selectors/selectors'),
    getGameMode = _require2.getGameMode,
    getNextTarget = _require2.getNextTarget,
    getClientPlayerID = _require2.getClientPlayerID,
    getHostPlayerID = _require2.getHostPlayerID;

var _require3 = require('../utils/clientToServer'),
    dispatchToServer = _require3.dispatchToServer;

var initKeyboardControlsSystem = function initKeyboardControlsSystem(store) {
  var dispatch = store.dispatch;

  var state = store.getState();
  var playerID = getClientPlayerID(state);

  document.onkeydown = function (ev) {
    var state = store.getState();
    var _state$game = state.game,
        time = _state$game.time,
        ships = _state$game.ships;

    switch (ev.keyCode) {
      case 37:
        {
          // left
          if (ships[playerID].thetaSpeed == -1 * config.ship.thetaSpeed) {
            return; // don't dispatch redundantly
          }
          var action = {
            type: 'SET_TURN', time: time, playerID: playerID, thetaSpeed: -1 * config.ship.thetaSpeed
          };
          dispatchToServer(playerID, action);
          dispatch(action);
          break;
        }
      case 38:
        {
          // up
          if (ships[playerID].thrust == config.ship.thrust) {
            return; // don't dispatch redundantly
          }
          var _action = { type: 'SET_THRUST', time: time, playerID: playerID, thrust: config.ship.thrust };
          dispatchToServer(playerID, _action);
          dispatch(_action);
          break;
        }
      case 39:
        {
          // right
          if (ships[playerID].thetaSpeed == config.ship.thetaSpeed) {
            return; // don't dispatch redundantly
          }
          var _action2 = { type: 'SET_TURN', time: time, playerID: playerID, thetaSpeed: config.ship.thetaSpeed };
          dispatchToServer(playerID, _action2);
          dispatch(_action2);
          break;
        }
    }
  };

  document.onkeyup = function (ev) {
    var state = store.getState();
    var time = state.game.time;

    var target = null;
    switch (ev.keyCode) {
      case 37:
        {
          // left
          var action = { type: 'SET_TURN', time: time, playerID: playerID, thetaSpeed: 0 };
          dispatchToServer(playerID, action);
          dispatch(action);
          break;
        }
      case 38:
        {
          // up
          var _action3 = { type: 'SET_THRUST', time: time, playerID: playerID, thrust: 0 };
          dispatchToServer(playerID, _action3);
          dispatch(_action3);
          break;
        }
      case 39:
        {
          // right
          var _action4 = { type: 'SET_TURN', time: time, playerID: playerID, thetaSpeed: 0 };
          dispatchToServer(playerID, _action4);
          dispatch(_action4);
          break;
        }
      case 32:
        {
          // space
          // don't fire the action at all if this player has any other missiles
          var dontFire = false;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = state.game.projectiles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var projectile = _step.value;

              if (projectile.playerID == playerID) {
                dontFire = true;
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

          dontFire = dontFire && gameMode == 'versus'; // can fire more in co-op
          if (dontFire) {
            break;
          }
          target = state.game.ships[playerID].target;
          var thisPlayerIsHost = getClientPlayerID(state) === getHostPlayerID(state);
          var offset = thisPlayerIsHost ? 5 : 10;
          var id = window.nextID + offset; // HACK: pass this along so both players
          // agree what its id is
          var gameMode = getGameMode(state);
          if (gameMode == 'versus') {
            var _action5 = { type: 'FIRE_MISSILE', time: time, playerID: playerID, target: target, id: id };
            dispatchToServer(playerID, _action5);
            dispatch(_action5);
          } else {
            var _action6 = { type: 'FIRE_LASER', time: time, playerID: playerID };
            dispatchToServer(playerID, _action6);
            dispatch(_action6);
          }
          break;
        }

      case 16:
        {
          // shift
          var targetID = getNextTarget(state.game, playerID);
          var _action7 = { type: 'SHIFT_TARGET', playerID: playerID, targetID: targetID };
          if (getGameMode(state) == 'coop') {
            dispatchToServer(playerID, _action7);
          }
          dispatch(_action7);
        }
    }
  };
};

module.exports = { initKeyboardControlsSystem: initKeyboardControlsSystem };