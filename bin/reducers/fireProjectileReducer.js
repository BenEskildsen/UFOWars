'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('../config'),
    config = _require.config;

var _require2 = require('../utils/queue'),
    queueAdd = _require2.queueAdd;

var _require3 = require('../utils/vectors'),
    makeVector = _require3.makeVector;

var _require4 = require('../entities/projectile'),
    makeLaserProjectile = _require4.makeLaserProjectile;

var fireProjectileReducer = function fireProjectileReducer(state, action) {
  switch (action.type) {
    case 'FIRE_LASER':
      {
        var playerID = action.playerID;
        var projectiles = state.projectiles,
            ships = state.ships;

        var shipPosition = ships[playerID].position;
        var shipTheta = ships[playerID].theta;
        if (action.time < state.time) {
          var timeDiff = state.time - action.time;
          // rewind history
          var prevPos = ships[playerID].history[ships[playerID].history.length - timeDiff - 1];
          shipPosition = prevPos.position;
          shipTheta = prevPos.theta;
        } else if (action.time > state.time) {
          return _extends({}, state, {
            actionQueue: [].concat(_toConsumableArray(state.actionQueue), [action])
          });
        }
        var velocity = makeVector(shipTheta, config.laserSpeed);
        var projectile = makeLaserProjectile(playerID, shipPosition, velocity, shipTheta);
        queueAdd(projectiles, projectile, config.maxProjectiles);
        return _extends({}, state, {
          projectiles: projectiles
        });
      }
  }

  return state;
};

module.exports = { fireProjectileReducer: fireProjectileReducer };