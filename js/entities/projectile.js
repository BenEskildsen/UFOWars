// @flow

const {makeEntity} = require('./entity');

import type {Radians, PlayerID, Vector, Projectile} from '../types';

const makeLaserProjectile = (
  playerID: PlayerID,
  position: Vector,
  velocity: Vector,
  theta: Radians,
): Projectile => {
  return {
    ...makeEntity(0 /* mass */, 0 /* radius */, position, velocity, theta),
    playerID,
    type: 'laser',
  };
};

module.exports = {makeLaserProjectile};
