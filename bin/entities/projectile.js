'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('./entity'),
    makeEntity = _require.makeEntity;

var _require2 = require('../config'),
    config = _require2.config;

var _require3 = require('../utils/vectors'),
    makeVector = _require3.makeVector;

var makeLaserProjectile = function makeLaserProjectile(playerID, position, theta) {
  var velocity = makeVector(theta, config.laserSpeed);
  return _extends({}, makeEntity(0 /* mass */, 0 /* radius */, position, velocity, theta), {
    playerID: playerID,
    type: 'laser'
  });
};

var makeMissileProjectile = function makeMissileProjectile(playerID, position, theta, target) {
  var projectile = _extends({}, makeLaserProjectile(playerID, position, theta), {
    type: 'missile',
    mass: config.missile.mass,
    radius: config.missile.radius,
    velocity: makeVector(theta, config.missile.speed),
    target: target,
    age: 0,
    thrust: 0,
    fuel: { cur: config.missile.maxFuel, max: config.missile.maxFuel }
  });
  return projectile;
};

module.exports = { makeLaserProjectile: makeLaserProjectile, makeMissileProjectile: makeMissileProjectile };