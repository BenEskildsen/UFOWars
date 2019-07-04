// @flow

const {config} = require('../config');

import type {Store} from '../types';

const initTickSystem = (store: Store): void => {
  // TODO need a mechanism for pausing
  const interval = setInterval(
    () => store.dispatch({type: 'TICK'}),
    config.msPerTick,
  );
}

module.exports = {initTickSystem};
