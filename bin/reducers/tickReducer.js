'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('../physics/gravity'),
    computeNextEntity = _require.computeNextEntity;

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

  // update ships

  for (var id in state.ships) {
    var ship = state.ships[id];

    state.ships[id] = _extends({}, ship, computeNextEntity(sun, ship, ship.thrust));
  }

  // update planets
  state.planets = state.planets.map(function (planet) {
    return _extends({}, planet, computeNextEntity(sun, planet));
  });

  // TODO update projectiles/lasers/missiles

  // TODO update paths

  return state;
};

module.exports = { tickReducer: tickReducer };