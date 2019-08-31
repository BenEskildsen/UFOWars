// @flow

const {invariant} = require('../utils/errors');
const {config} = require('../config');

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

const getOtherPlayerID = (state: State): PlayerID => {
  const game = getClientGame(state);
  const clientPlayerID = getClientPlayerID(state);

  for (const id of game.players) {
    if (id !== clientPlayerID) {
      return id;
    }
  }
};

const getGameMode = (state: State): 'versus' | 'coop' | 'planet' => {
  return getClientGame(state).mode;
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

const getPlayerColor = (state: State, playerID: PlayerID): Color => {
  const colorIndex = state.game.gamePlayers.indexOf(playerID) + 1;
  return config.playerColors[colorIndex];
}

const getNextTarget = (state: GameState, playerID: PlayerID): EntityID => {
  const {ships, planets, projectiles, asteroids} = state;
  const entities = Object.values(ships)
    .concat(projectiles)
    .concat(planets)
    .concat(asteroids);
  const entityIDs = entities.map(entity => entity.id);

  const currentShip = ships[playerID];
  const currentTarget = currentShip.target;
  const currentIndex = entityIDs.indexOf(currentTarget);

  let nextIndex = (currentIndex + 1) % entities.length;
  while (entities[nextIndex].playerID == playerID) {
    nextIndex = (nextIndex + 1) % entities.length;
  }

  return entities[nextIndex].id;
}

const getEntityByID = (state: GameState, id: EntityID): ?Entity => {
  const {ships, planets, projectiles} = state;
  const entities = Object.values(ships).concat(projectiles).concat(planets);
  const entityIDs = entities.map(entity => entity.id);

  const index = entityIDs.indexOf(id);
  if (index == -1) {
    return null;
  }
  return entities[index];
}

const getHostPlayerID = (state: State): PlayerID => {
  for (const id in state.game.ships) {
    return id; // HACK :)
  }
}

module.exports = {
  getClientPlayerID,
  getOtherPlayerID,
  getClientPlayer,
  getClientGame,
  getPlayerByID,
  getNextGameID,
  getPlayerColor,
  getNextTarget,
  getEntityByID,
  getGameMode,
  getHostPlayerID,
};
