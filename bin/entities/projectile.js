'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('./entity'),
    makeEntity = _require.makeEntity;

var makeLaserProjectile = function makeLaserProjectile(playerID, position, velocity, theta) {
  return _extends({}, makeEntity(0 /* mass */, 0 /* radius */, position, velocity, theta), {
    playerID: playerID,
    type: 'laser'
  });
};

module.exports = { makeLaserProjectile: makeLaserProjectile };