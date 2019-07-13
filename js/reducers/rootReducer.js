// @flow

const {gameReducer} = require('./gameReducer');
const {initState} = require('../state/initState');
const {initGameState} = require('../state/initGameState');
const {tickReducer} = require('./tickReducer');

import type {State, Action} from '../types';

const rootReducer = (state: State, action: Action): State => {
  if (state === undefined) return initState();

  switch (action.type) {
    case 'CREATE_GAME': {
      const {gameID, playerID} = action;
      for (const player of state.players) {
        if (player.id === playerID) {
          player.gameID = gameID;
        }
      }
      return {
        ...state,
        games: {
          ...state.games,
          [gameID]: {id: gameID, players: [playerID], started: false},
        },
      };
    }
    case 'JOIN_GAME': {
      const {gameID, playerID} = action;
      for (const player of state.players) {
        if (player.id === playerID) {
          player.gameID = gameID;
        }
      }
      return {
        ...state,
        games: {
          ...state.games,
          [gameID]: {
            ...state.games[gameID],
            players: [...state.games[gameID].players, playerID],
          },
        },
      };
    }
    case 'START': {
      const {gameID} = action;
      const {players} = state.games[gameID];
      return {
        ...state,
        game: initGameState(players),
        games: {
          ...state.games,
          [gameID]: {...state.games[gameID], started: true},
        },
      };
    }
    case 'CREATE_PLAYER': {
      const {playerID, gameID, isThisClient, name} = action;
      return {
        ...state,
        players: [
          ...state.players,
          {id: playerID, isThisClient, name, score: 0, gameID, ready: false},
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
    case 'RESTART':
      // TODO: restart systems if necessary
      return initState();
    case 'TICK':
      if (!state.game) {
        return state;
      }
      return {
        ...state,
        game: tickReducer(state.game),
      };
    case 'SET_TURN':
    case 'SET_THRUST':
    case 'FIRE_LASER':
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
