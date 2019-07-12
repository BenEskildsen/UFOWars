'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('../entities/entity'),
    makeEntity = _require.makeEntity;

var _require2 = require('../entities/ship'),
    makeShip = _require2.makeShip;

var _require3 = require('../config'),
    config = _require3.config;

var initGameState = function initGameState(players) {
  var _ships;

  var ship = config.ship,
      sun = config.sun,
      width = config.width,
      height = config.height;

  return {
    gamePlayers: players,
    time: 0,
    ships: (_ships = {}, _defineProperty(_ships, players[0], makeShip(players[0], // playerID
    ship.mass, ship.radius, { x: 400, y: 700 }, // position
    { x: 5, y: 0 } // velocity
    )), _defineProperty(_ships, players[1], makeShip(players[1], // playerID
    ship.mass, ship.radius, { x: 400, y: 100 }, // position
    { x: -5, y: 0 } // velocity
    )), _ships),

    sun: makeEntity(sun.mass, sun.radius, { x: width / 2, y: width / 2 }),
    planets: [],
    projectiles: [],
    paths: [],

    actionQueue: []
  };
};

module.exports = { initGameState: initGameState };