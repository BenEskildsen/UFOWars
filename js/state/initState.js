// @flow

import type {State} from '../types';

const initState = (): State => {
  return {
    game: null,
  };
}

module.exports = {initState};
