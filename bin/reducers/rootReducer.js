'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('../state/initState'),
    initState = _require.initState;

var _require2 = require('./gameReducer'),
    gameReducer = _require2.gameReducer;

var _require3 = require('./tickReducer'),
    tickReducer = _require3.tickReducer;

var _require4 = require('./modalReducer'),
    modalReducer = _require4.modalReducer;

var _require5 = require('./playerReducer'),
    playerReducer = _require5.playerReducer;

var _require6 = require('./lobbyReducer'),
    lobbyReducer = _require6.lobbyReducer;

var _require7 = require('./chatReducer'),
    chatReducer = _require7.chatReducer;

var rootReducer = function rootReducer(state, action) {
  if (state === undefined) return initState();

  switch (action.type) {
    case 'CREATE_GAME':
    case 'JOIN_GAME':
    case 'START':
    case 'LOCAL_CHAT':
      return lobbyReducer(state, action);
    case 'CREATE_PLAYER':
    case 'SET_PLAYER_NAME':
    case 'SET_PLAYER_SCORE':
    case 'SET_PLAYER_READY':
      return playerReducer(state, action);
    case 'SET_MODAL':
    case 'DISMISS_MODAL':
      return modalReducer(state, action);
    case 'START_TICK':
    case 'STOP_TICK':
    case 'TICK':
      if (!state.game) return state;
      return _extends({}, state, {
        game: tickReducer(state.game, action)
      });
    case 'SET_TURN':
    case 'SET_THRUST':
    case 'FIRE_LASER':
    case 'FIRE_MISSILE':
      if (!state.game) return state;
      return _extends({}, state, {
        game: gameReducer(state.game, action)
      });
    case 'CHAT':
    case 'SET_CHAT':
      return chatReducer(state, action);
  }
  return state;
};

module.exports = { rootReducer: rootReducer };