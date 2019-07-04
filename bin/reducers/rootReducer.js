'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('./gameReducer'),
    gameReducer = _require.gameReducer;

var _require2 = require('../state/initState'),
    initState = _require2.initState;

var _require3 = require('../state/initGameState'),
    initGameState = _require3.initGameState;

var rootReducer = function rootReducer(state, action) {
  if (state === undefined) return initState();

  switch (action.type) {
    case 'START':
      {
        return _extends({}, state, {
          game: initGameState()
        });
      }
    case 'CREATE_PLAYER':
      {
        var id = action.id,
            isThisClient = action.isThisClient,
            name = action.name;

        return _extends({}, state, {
          players: [].concat(_toConsumableArray(state.players), [{ id: id, isThisClient: isThisClient, name: name, score: 0 }])
        });
      }
    case 'RESTART':
      // TODO: restart systems if necessary
      return initState();
    case 'TICK':
    case 'SET_TURN':
    case 'SET_THRUST':
      if (!state.game) {
        return state;
      }
      return _extends({}, state, {
        game: gameReducer(state.game, action)
      });
  }
  return state;
};

module.exports = { rootReducer: rootReducer };