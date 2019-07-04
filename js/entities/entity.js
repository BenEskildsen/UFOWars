// @flow

import type {Mass, Radians, Vector, Size, Entity} from '../types';

const makeEntity = (
  mass: Mass,
  radius: Size,
  position: Vector,
  velocity?: Vector,
  theta?: Radians,
): Entity => {
  return {
    mass,
    radius,
    position,
    velocity: velocity || {x: 0, y: 0},
    accel: {x: 0, y: 0},
    theta: theta || 0,
    thetaSpeed: 0,
  };
};

module.exports = {makeEntity};
