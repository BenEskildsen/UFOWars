// @flow

const {dispatchToServer} = require('../utils/clientToServer');
const {getClientPlayerID} = require('../selectors/selectors');

import type {State, Action} from '../types';

const modalReducer = (state: State, action: Action): State=> {
  switch (action.type) {
    case 'DISMISS_MODAL':
      return {
        ...state,
        modal: null,
      };
    case 'SET_MODAL': {
      if (action.name != 'gameover') {
        return {
          ...state,
          modal: {
            title: action.title,
            text: action.text,
            buttons: [...action.buttons],
          }
        };
      } else {
        const thisClientID = getClientPlayerID(state);
        return {
          ...state,
          modal: {
            title: action.title,
            text: action.text,
            buttons: [
              {
                label: 'Play Again',
                onClick: () => {
                  // HACK store is only available through window
                  store.dispatch({type: 'DISMISS_MODAL'});
                  const setReadyAction = {
                    type: 'SET_PLAYER_READY',
                    playerID: thisClientID,
                    ready: true,
                  };
                  dispatchToServer(thisClientID, setReadyAction);
                  store.dispatch(setReadyAction);
                }
              },
            ],
          },
        };
      }
    }
  }
  return state;
}

module.exports = {modalReducer};
