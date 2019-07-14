// @flow

const {invariant} = require('../utils/errors');

import type {GameID, State, Player, PlayerID, Game} from '../types';

const getClientPlayerID = (state: State): PlayerID => {
  return getClientPlayer(state).id;
};

const getClientPlayer = (state: State): Player => {
  for (const player of state.players) {
    if (player.isThisClient) {
      return player;
    }
  }
  invariant(false, 'this client has no player');
};

const getClientGame = (state: State): Game => {
  return state.games[getClientPlayer(state).gameID];
};

const getPlayerByID = (state: State, playerID: PlayerID): Player => {
  for (const player of state.players) {
    if (player.id == playerID) {
      return player;
    }
  }
  invariant(false, 'no player with id ' + playerID);
};

/**
 *  Since the client should know about all games that exist, it can compute this?
 *  TODO this is insanely dangerous though
 */
const getNextGameID = (state: State): GameID => {
  let nextGameID = -1;
  for (const gameID in state.games) {
    if (parseInt(gameID) > nextGameID) {
      nextGameID = parseInt(gameID);
    }
  }
  // what're the odds there's a collision!?
  return '' + (nextGameID + Math.round(Math.random() * 100));
}

module.exports = {
  getClientPlayerID,
  getClientPlayer,
  getClientGame,
  getPlayerByID,
  getNextGameID,
};
