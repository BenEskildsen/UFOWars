// @flow

const {makeEntity} = require('./entity');
const {config} = require('../config');
const {makeVector} = require('../utils/vectors');

import type {Radians, PlayerID, Vector, Projectile, Missile} from '../types';

const makeLaserProjectile = (
  playerID: PlayerID,
  position: Vector,
  theta: Radians,
): Projectile => {
  const velocity = makeVector(theta, config.laserSpeed);
  return {
    ...makeEntity(0 /* mass */, 0 /* radius */, position, velocity, theta),
    playerID,
    type: 'laser',
  };
};

const makeMissileProjectile = (
  playerID: PlayerID,
  position: Vector,
  theta: Radians,
  target: 'Ship' | 'Missile',
): Missile => {
  const projectile = {
    ...makeLaserProjectile(playerID, position, theta),
    type: 'missile',
    mass: config.missile.mass,
    radius: config.missile.radius,
    velocity: makeVector(theta, config.missile.speed),
    target,
    age: 0,
    thrust: 0,
    fuel: {cur: config.missile.maxFuel, max: config.missile.maxFuel},
  };
  return projectile;
}

module.exports = {makeLaserProjectile, makeMissileProjectile};
