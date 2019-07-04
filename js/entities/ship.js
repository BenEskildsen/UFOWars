// @flow

const {makeEntity} = require('./entity');
const {config} = require('../config');

import type {Mass, PlayerID, Vector, Size, Ship} from '../types';

const makeShip = (
  playerID: PlayerID,
  mass: Mass,
  radius: Size,
  position: Vector,
  velocity: Vector,
): Ship => {
  // TODO make velocity and theta functions of position
  return {
    ...makeEntity(mass, radius, position, velocity, 0 /* theta */),
    playerID,
    thrust: 0,

    fuel: {cur: 100, max: config.ship.maxFuel},
    laserCharge: {cur: 100, max: config.ship.maxLaser},
  };
};

module.exports = {makeShip};
