// @flow

const {initGameState} = require('../state/initGameState');
const {config} = require('../config');
const {getPlayerByID} = require('../selectors/selectors');

import type {State, Action} from '../types';

const chatReducer = (state: State, action: Action): State=> {
  switch (action.type) {
    case 'SET_CHAT':
      const {chat} = action;
      return {
        ...state,
        chat,
      };
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
  }
}

module.exports = {chatReducer};
