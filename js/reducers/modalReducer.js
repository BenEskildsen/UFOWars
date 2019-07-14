// @flow

import type {State, Action} from '../types';

const modalReducer = (state: State, action: Action): State=> {
  switch (action.type) {
    case 'DISMISS_MODAL':
      return {
        ...state,
        modal: null,
      };
    case 'SET_MODAL':
      return {
        ...state,
        modal: {
          title: action.title,
          text: action.text,
          buttons: [...action.buttons],
        }
      };
  }
}

module.exports = {modalReducer};
