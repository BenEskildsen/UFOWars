// @flow

const {initGameState} = require('../state/initGameState');
const {config} = require('../config');
const {getPlayerByID} = require('../selectors/selectors');

import type {State, Action} from '../types';

const lobbyReducer = (state: State, action: Action): State=> {
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
        game: {
          ...initGameState(players),
          tickInterval: setInterval(
            // HACK: store is only available via window
            () => store.dispatch({type: 'TICK'}),
            config.msPerTick,
          ),
        },
        games: {
          ...state.games,
          [gameID]: {...state.games[gameID], started: true},
        },
      };
    }
    case 'CHAT': {
      const {playerID, message} = action;
      if (!message) {
        return state;
      }
      const playerName = getPlayerByID(state, playerID).name;
      return {
        ...state,
        chat: (state.chat || '') + playerName + ': ' + message + '\n',
      };
    }
    case 'LOCAL_CHAT': {
      const {message} = action;
      return {
        ...state,
        localChat: message,
      };
    }
  }
  return state;
}

module.exports = {lobbyReducer};
