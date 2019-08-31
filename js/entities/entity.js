// @flow

import type {Mass, Radians, Vector, Size, Entity} from '../types';

// HACK: need to make this global so that people creating missiles can
// give them unique ids and not have the ids collide if both players fire
// at the same time
window.nextID = 0;

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
    history: [],
    future: [],
    id: nextID++,
  };
};

module.exports = {makeEntity};
