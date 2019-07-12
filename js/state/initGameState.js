// @flow

const {makeEntity} = require('../entities/entity');
const {makeShip} = require('../entities/ship');
const {config} = require('../config');

import type {GameState, PlayerID} from '../types';

const initGameState = (players: Array<PlayerID>): GameState => {
  const {ship, sun, width, height} = config;
  return {
    gamePlayers: players,
    time: 0,
    ships: {
      [players[0]]: makeShip(
        players[0], // playerID
        ship.mass, ship.radius,
        {x: 400, y: 700}, // position
        {x: 5, y: 0}, // velocity
      ),
      [players[1]]: makeShip(
        players[1], // playerID
        ship.mass, ship.radius,
        {x: 400, y: 100}, // position
        {x: -5, y: 0}, // velocity
      ),
    },

    sun: makeEntity(sun.mass, sun.radius, {x: width / 2, y: width / 2}),
    planets: [],
    projectiles: [],
    paths: [],

    actionQueue: [],
  };
}

module.exports = {initGameState};
