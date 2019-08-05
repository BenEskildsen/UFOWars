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
      if (state.game != null && state.game.tickInterval != null) {
        return state;
      }
      const setAnimationInterval = () => {
        setInterval(
          () => store.dispatch({type: 'STEP_ANIMATION'}),
          config.msPerTick,
        );
      };
      return {
        ...state,
        game: {
          ...initGameState(players),
          tickInterval: setInterval(
            // HACK: store is only available via window
            () => store.dispatch({type: 'TICK'}),
            config.msPerTick,
          ),
          animationInterval: 
            (state.game != null && state.game.animationInterval != null)
            ? state.game.animationInterval
            : setAnimationInterval(),
        },
        games: {
          ...state.games,
          [gameID]: {...state.games[gameID], started: true},
        },
      };
    }
  }
  return state;
}

module.exports = {lobbyReducer};
