'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
        return {
          game: initGameState()
        };
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