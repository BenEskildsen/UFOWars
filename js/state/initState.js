// @flow

import type {State} from '../types';

const initState = (): State => {
  return {
    game: null,
    players: [],
    games: {'0': {id: '0', players: [], started: false}},
    modal: null,
  };
}

module.exports = {initState};
