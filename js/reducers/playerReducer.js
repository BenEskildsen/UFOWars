// @flow

import type {State, Action} from '../types';

const playerReducer = (state: State, action: Action): State=> {
  switch (action.type) {
    case 'CREATE_PLAYER': {
      const {playerID, gameID, isThisClient, name} = action;
      return {
        ...state,
        players: [
          ...state.players,
          {id: String(playerID), isThisClient, name, score: 0, gameID, ready: false},
        ],
      };
    }
    case 'SET_PLAYER_NAME': {
      const {playerID, name} = action;
      for (const player of state.players) {
        if (player.id === playerID) {
          player.name = name;
        }
      }
      return state;
    }
    case 'SET_PLAYER_SCORE': {
      const {playerID, score} = action;
      for (const player of state.players) {
        if (player.id === playerID) {
          player.score = score;
        }
      }
      return state;
    }
    case 'SET_PLAYER_READY': {
      const {playerID, ready} = action;
      for (const player of state.players) {
        if (player.id === playerID) {
          player.ready = ready;
        }
      }
      return state;
    }
  }
};

module.exports = {playerReducer};
