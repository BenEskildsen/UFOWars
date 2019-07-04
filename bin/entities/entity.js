'use strict';

var makeEntity = function makeEntity(mass, radius, position, velocity, theta) {
  return {
    mass: mass,
    radius: radius,
    position: position,
    velocity: velocity || { x: 0, y: 0 },
    accel: { x: 0, y: 0 },
    theta: theta || 0,
    thetaSpeed: 0
  };
};

module.exports = { makeEntity: makeEntity };