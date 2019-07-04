// @flow

const {invariant} = require('../utils/errors');

import type {State, PlayerID} from '../types';

const getClientPlayerID = (state: State): PlayerID => {
  let playerID = null;
  for (const player of state.players) {
    if (player.isThisClient) {
      playerID = player.id;
    }
  }
  invariant(playerID != null, 'no playerID matches this client');
  return playerID;
};

module.exports = {
  getClientPlayerID,
};
