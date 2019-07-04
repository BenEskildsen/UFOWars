// @flow

const {gameReducer} = require('./gameReducer');
const {initState} = require('../state/initState');
const {initGameState} = require('../state/initGameState');

import type {State, Action} from '../types';

const rootReducer = (state: State, action: Action): State => {
  if (state === undefined) return initState();

  switch (action.type) {
    case 'START': {
      return {
        ...state,
        game: initGameState(),
      };
    }
    case 'CREATE_PLAYER': {
      const {id, isThisClient, name} = action;
      return {
        ...state,
        players: [
          ...state.players,
          {id, isThisClient, name, score: 0},
        ],
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
      return {
        ...state,
        game: gameReducer(state.game, action),
      };
  }
  return state;
};

module.exports = {rootReducer}
