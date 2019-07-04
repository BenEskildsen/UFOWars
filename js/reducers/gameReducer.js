// @flow

const {tickReducer} = require('./tickReducer');

import type {State, GameState, Action} from '../types';

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'TICK':
      return tickReducer(state);
    case 'SET_TURN':
      return {
        ...state,
        ships: {
          ...state.ships,
          [action.playerID]: {
            ...state.ships[action.playerID],
            thetaSpeed: action.thetaSpeed,
          },
        },
      };
    case 'SET_THRUST':
      return {
        ...state,
        ships: {
          ...state.ships,
          [action.playerID]: {
            ...state.ships[action.playerID],
            thrust: action.thrust,
          },
        },
      };
  }

  return state;
};

module.exports = {gameReducer};
