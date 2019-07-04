// @flow

import type {State} from '../types';

const initState = (): State => {
  return {
    game: null,
    players: [],
  };
}

module.exports = {initState};
