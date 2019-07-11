'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('../config'),
    config = _require.config;

var _require2 = require('./tickReducer'),
    tickReducer = _require2.tickReducer;

var _require3 = require('./fireProjectileReducer'),
    fireProjectileReducer = _require3.fireProjectileReducer;

var _require4 = require('../utils/updateEntities'),
    updateShip = _require4.updateShip,
    updateProjectile = _require4.updateProjectile;

var gameReducer = function gameReducer(state, action) {
  switch (action.type) {
    case 'TICK':
      return tickReducer(state);
    case 'SET_TURN':
      {
        // re-sync if necessary
        if (action.time < state.time) {
          var timeDiff = state.time - action.time;
          console.log(state.time, action.time, timeDiff);
          // rewind history
          var prevPos = null;
          for (var i = 0; i < timeDiff; i++) {
            prevPos = state.ships[action.playerID].history.pop();
          }
          state.ships[action.playerID] = _extends({}, state.ships[action.playerID], prevPos, {
            thetaSpeed: action.thetaSpeed
          });
          updateShip(state, action.playerID, timeDiff);
          return state;
        } else {
          return _extends({}, state, {
            ships: _extends({}, state.ships, _defineProperty({}, action.playerID, _extends({}, state.ships[action.playerID], {
              thetaSpeed: action.thetaSpeed
            })))
          });
        }
      }
    case 'SET_THRUST':
      {
        // re-sync if necessary
        if (action.time < state.time) {
          var _timeDiff = state.time - action.time;
          // rewind history
          var _prevPos = null;
          for (var _i = 0; _i < _timeDiff; _i++) {
            _prevPos = state.ships[action.playerID].history.pop();
          }
          state.ships[action.playerID] = _extends({}, state.ships[action.playerID], _prevPos, {
            thrust: action.thrust
          });
          updateShip(state, action.playerID, _timeDiff);
          return state;
        } else {
          return _extends({}, state, {
            ships: _extends({}, state.ships, _defineProperty({}, action.playerID, _extends({}, state.ships[action.playerID], {
              thrust: action.thrust
            })))
          });
        }
      }
    case 'FIRE_LASER':
      {
        return fireProjectileReducer(state, action);
      }
  }

  return state;
};

module.exports = { gameReducer: gameReducer };