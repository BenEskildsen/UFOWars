'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var sqrt = Math.sqrt,
    atan2 = Math.atan2,
    cos = Math.cos,
    sin = Math.sin;

var _require = require('../config'),
    config = _require.config;

var _require2 = require('../utils/vectors'),
    add = _require2.add,
    subtract = _require2.subtract;

/*
 * given the masses of two bodies m1 and m2, and the distance between them
 * broken up by x and y components, compute the acceleration m1 will have
 * towards m2
 */
var computeAccel = function computeAccel(m1, m2, dist) {
  var totalDist = sqrt(dist.x * dist.x + dist.y * dist.y);
  var theta = atan2(dist.y, dist.x);
  var f = config.G * m1 * m2 / (totalDist * totalDist);
  var fx = f * cos(theta);
  var fy = f * sin(theta);
  return { x: fx / m1, y: fy / m1 };
};

/*
 * Create a new entity with physics computed forward by 1 step.
 * Pure function so that this can be used for calculating paths.
 * Optionally pass in a thrust vector that will affect acceleration
 */
var computeNextEntity = function computeNextEntity(sun, entity, thrust) {
  var thrustVal = thrust || 0;
  var thrustVec = {
    x: thrustVal * cos(entity.theta),
    y: thrustVal * sin(entity.theta)
  };

  // get prev theta if no manual changes had been applied
  var prevUncorrectedTheta = -1 * Math.atan2(entity.velocity.x, entity.velocity.y) + Math.PI / 2;

  // sum acceleration due to the sun and acceleration due to thrust
  var accel = add(computeAccel(entity.mass, sun.mass, subtract(sun.position, entity.position)), thrustVec);
  var velocity = add(accel, entity.velocity);
  var position = add(velocity, entity.position);

  // compute next theta relative to current direction of travel
  var nextUncorrectedTheta = -1 * Math.atan2(velocity.x, velocity.y) + Math.PI / 2;
  var thetaDiff = nextUncorrectedTheta - prevUncorrectedTheta;
  var theta = entity.theta + thetaDiff + entity.thetaSpeed;

  return _extends({}, entity, {
    accel: accel,
    velocity: velocity,
    position: position,
    theta: theta
  });
};

module.exports = {
  computeAccel: computeAccel,
  computeNextEntity: computeNextEntity
};