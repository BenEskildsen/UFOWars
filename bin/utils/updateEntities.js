'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('../utils/gravity'),
    computeNextEntity = _require.computeNextEntity;

var _require2 = require('../utils/queue'),
    queueAdd = _require2.queueAdd;

var _require3 = require('../config'),
    config = _require3.config;

var updateShip = function updateShip(state, id, numTicks) {
  var sun = state.sun;

  for (var i = 0; i < numTicks; i++) {
    var ship = state.ships[id];
    var history = ship.history;
    queueAdd(history, ship, config.maxHistorySize);
    state.ships[id] = _extends({}, ship, computeNextEntity(sun, ship, ship.thrust), {
      history: history
    });
  }
};

var updateProjectile = function updateProjectile(state, j, numTicks) {
  var sun = state.sun;

  for (var i = 0; i < numTicks; i++) {
    var projectile = state.projectiles[j];
    var history = projectile.history;
    queueAdd(history, projectile, config.maxHistorySize);
    state.projectiles[j] = _extends({}, projectile, computeNextEntity(sun, projectile, projectile.thrust || 0, true /*no smart theta*/), {
      history: history
    });
  }
};

module.exports = {
  updateShip: updateShip,
  updateProjectile: updateProjectile
};