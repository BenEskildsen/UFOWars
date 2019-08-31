// @flow

const {makeEntity} = require('../entities/entity');
const {makeShip} = require('../entities/ship');
const {config} = require('../config');

import type {GameState, PlayerID} from '../types';

const initGameState = (players: Array<PlayerID>, mode: 'versus' | 'coop' | 'planet'): GameState => {
  const {ship, sun, width, height, earth} = config;
  const planets = [];
  // no planet defense mode for now
  // if (mode == 'planet') {
  //   planets.push(makeEntity(
  //     earth.mass, earth.radius,
  //     {x: width / 2, y: height / 2 - 1000}, // position
  //     {x: -8.5, y: 0} // velocity
  //   ));
  // }
  if (mode == 'coop' || mode == 'versus') {
    planets.push(makeEntity(
      earth.mass, earth.radius,
      {x: width / 2 - 600, y: height / 2}, // position
      {x: 0, y: 10} // velocity
    ));
  }
  return {
    gamePlayers: players,
    time: 0,
    tickInterval: null,
    animationInterval: null,
    ships: {
      [players[0]]: makeShip(
        players[0], // playerID
        ship.mass, ship.radius,
        // {x: width / 2, y: height / 2 - 1150}, // position
        // {x: -14, y: 0}, // velocity
        {x: width / 2, y: height / 8}, // position
        {x: -7.5, y: 0}, // velocity
      ),
      [players[1]]: makeShip(
        players[1], // playerID
        ship.mass, ship.radius,
        {x: width / 2, y: 7 * height / 8}, // position
        {x: 7.5, y: 0}, // velocity
      ),
    },

    sun: makeEntity(sun.mass, sun.radius, {x: width / 2, y: height / 2}),
    planets,
    projectiles: [],
    explosions: [],
    asteroids: [],

    actionQueue: [],
  };
}

module.exports = {initGameState};
