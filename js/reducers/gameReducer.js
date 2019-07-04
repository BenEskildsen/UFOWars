// @flow

const {config} = require('../config');
const {tickReducer} = require('./tickReducer');
const {fireProjectileReducer} = require('./fireProjectileReducer');

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
    case 'FIRE_LASER':
      return fireProjectileReducer(state, action);
  }

  return state;
};

module.exports = {gameReducer};
