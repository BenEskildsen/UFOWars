'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('../entities/entity'),
    makeEntity = _require.makeEntity;

var _require2 = require('../entities/ship'),
    makeShip = _require2.makeShip;

var _require3 = require('../config'),
    config = _require3.config;

var initGameState = function initGameState(players, mode) {
  var _ships;

  var ship = config.ship,
      sun = config.sun,
      width = config.width,
      height = config.height,
      earth = config.earth;

  var planets = [];
  // no planet defense mode for now
  // if (mode == 'planet') {
  //   planets.push(makeEntity(
  //     earth.mass, earth.radius,
  //     {x: width / 2, y: height / 2 - 1000}, // position
  //     {x: -8.5, y: 0} // velocity
  //   ));
  // }
  if (mode == 'coop' || mode == 'versus') {
    planets.push(makeEntity(earth.mass, earth.radius, { x: width / 2 - 600, y: height / 2 }, // position
    { x: 0, y: 10 // velocity
    }));
  }
  return {
    gamePlayers: players,
    time: 0,
    tickInterval: null,
    animationInterval: null,
    ships: (_ships = {}, _defineProperty(_ships, players[0], makeShip(players[0], // playerID
    ship.mass, ship.radius,
    // {x: width / 2, y: height / 2 - 1150}, // position
    // {x: -14, y: 0}, // velocity
    { x: width / 2, y: height / 8 }, // position
    { x: -7.5, y: 0 } // velocity
    )), _defineProperty(_ships, players[1], makeShip(players[1], // playerID
    ship.mass, ship.radius, { x: width / 2, y: 7 * height / 8 }, // position
    { x: 7.5, y: 0 } // velocity
    )), _ships),

    sun: makeEntity(sun.mass, sun.radius, { x: width / 2, y: height / 2 }),
    planets: planets,
    projectiles: [],
    explosions: [],
    asteroids: [],

    actionQueue: []
  };
};

module.exports = { initGameState: initGameState };