// @flow

const {sqrt, atan2, cos, sin} = Math;
const {config} = require('../config');
const {add, subtract} = require('../utils/vectors');

import type {Mass, Vector, Entity} from '../types';

/*
 * given the masses of two bodies m1 and m2, and the distance between them
 * broken up by x and y components, compute the acceleration m1 will have
 * towards m2
 */
const computeAccel = (m1: Mass, m2: Mass, dist: Vector): Vector => {
  if (m1 == 0 || m2 == 0) {
    return {x: 0, y: 0};
  }
  const totalDist = sqrt(dist.x * dist.x + dist.y * dist.y);
  const theta = atan2(dist.y, dist.x);
  const f = (config.G * m1 * m2) / (totalDist * totalDist);
  const fx = f * cos(theta);
  const fy = f * sin(theta);
  return {x: fx / m1, y: fy / m1};
};

/*
 * Create a new entity with physics computed forward by 1 step.
 * Pure function so that this can be used for calculating paths.
 * Optionally pass in a thrust vector that will affect acceleration
 */
const computeNextEntity = (sun: Entity, entity: Entity, thrust?: number): Entity => {
  const thrustVal = thrust || 0;
  const thrustVec = {
    x: thrustVal * cos(entity.theta),
    y: thrustVal * sin(entity.theta),
  };

  // get prev theta if no manual changes had been applied
  const prevUncorrectedTheta = -1*Math.atan2(entity.velocity.x, entity.velocity.y) + Math.PI/2;

  // sum acceleration due to the sun and acceleration due to thrust
  const accel = add(
    computeAccel(
      entity.mass, sun.mass,
      subtract(sun.position, entity.position),
    ),
    thrustVec,
  );
  const velocity = add(accel, entity.velocity);
  const position = add(velocity, entity.position);

  // compute next theta relative to current direction of travel
  const nextUncorrectedTheta = -1*Math.atan2(velocity.x, velocity.y) + Math.PI/2;
  const thetaDiff = nextUncorrectedTheta - prevUncorrectedTheta;
  const theta = entity.theta + thetaDiff + entity.thetaSpeed;

  return {
    ...entity,
    accel,
    velocity,
    position,
    theta,
  };
}

module.exports = {
  computeAccel,
  computeNextEntity,
};
