// @flow

const {makeEntity} = require('../entities/entity');
const {makeShip} = require('../entities/ship');
const {config} = require('../config');

import type {GameState} from '../types';

const initGameState = (): GameState => {
  const {ship, sun, width, height} = config;
  return {
    time: 0,
    players: [
      {
        id: '0',
        name: 'me',
        score: 0,
        isThisClient: true,
      },
      {
        id: '1',
        name: 'opponent',
        score: 0,
        isThisClient: false,
      },
    ], // TODO: where does the other player come from?

    ships: {
      '0': makeShip(
        '0', // playerID
        ship.mass, ship.radius,
        {x: 400, y: 700}, // position
        {x: 5, y: 0}, // velocity
      ),
      //'1': makeShip(
      //  '1', // playerID
      //  ship.mass, ship.radius,
      //  {x: 400, y: 100}, // position
      //  {x: 0, y: 0}, // velocity
      //),
    },

    sun: makeEntity(sun.mass, sun.radius, {x: width / 2, y: width / 2}),
    planets: [],
    projectiles: [],
    paths: [],
  };
}

module.exports = {initGameState};
