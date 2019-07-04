'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('./tickReducer'),
    tickReducer = _require.tickReducer;

var gameReducer = function gameReducer(state, action) {
  switch (action.type) {
    case 'TICK':
      return tickReducer(state);
    case 'SET_TURN':
      return _extends({}, state, {
        ships: _extends({}, state.ships, _defineProperty({}, action.playerID, _extends({}, state.ships[action.playerID], {
          thetaSpeed: action.thetaSpeed
        })))
      });
    case 'SET_THRUST':
      return _extends({}, state, {
        ships: _extends({}, state.ships, _defineProperty({}, action.playerID, _extends({}, state.ships[action.playerID], {
          thrust: action.thrust
        })))
      });
  }

  return state;
};

module.exports = { gameReducer: gameReducer };