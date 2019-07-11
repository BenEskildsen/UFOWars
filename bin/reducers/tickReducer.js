'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('../utils/gravity'),
    computeNextEntity = _require.computeNextEntity;

var _require2 = require('../utils/queue'),
    queueAdd = _require2.queueAdd;

var _require3 = require('../utils/updateEntities'),
    updateShip = _require3.updateShip,
    updateProjectile = _require3.updateProjectile;

var _require4 = require('../config'),
    config = _require4.config;

var sin = Math.sin,
    cos = Math.cos,
    abs = Math.abs,
    sqrt = Math.sqrt;


/**
 * Updates the gamestate in place for performance/laziness
 */
var tickReducer = function tickReducer(state) {
  state.time = state.time + 1;

  var sun = state.sun;


  for (var id in state.ships) {
    updateShip(state, id, 1 /* one tick */);
  }

  // update planets
  state.planets = state.planets.map(function (planet) {
    var history = planet.history;
    queueAdd(history, planet, config.maxHistorySize);
    return _extends({}, planet, computeNextEntity(sun, planet), {
      history: history
    });
  });

  for (var i = 0; i < state.projectiles.length; i++) {
    updateProjectile(state, i, 1 /* one tick */);
  }

  // TODO update paths

  return state;
};

module.exports = { tickReducer: tickReducer };