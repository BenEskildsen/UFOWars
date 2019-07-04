'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('./entity'),
    makeEntity = _require.makeEntity;

var _require2 = require('../config'),
    config = _require2.config;

var makeShip = function makeShip(playerID, mass, radius, position, velocity) {
  // TODO make velocity and theta functions of position
  return _extends({}, makeEntity(mass, radius, position, velocity, 0 /* theta */), {
    playerID: playerID,
    thrust: 0,

    fuel: { cur: 100, max: config.ship.maxFuel },
    laserCharge: { cur: 100, max: config.ship.maxLaser }
  });
};

module.exports = { makeShip: makeShip };