'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
      var playerID = action.playerID;
      var projectiles = state.projectiles,
          ships = state.ships;
      var _ships$playerID = ships[playerID],
          position = _ships$playerID.position,
          theta = _ships$playerID.theta;

      var velocity = makeVector(theta, config.laserSpeed);
      var projectile = makeLaserProjectile(playerID, position, velocity, theta);
      queueAdd(projectiles, projectile, config.maxProjectiles);
      return _extends({}, state, {
        projectiles: projectiles
      });
  }

  return state;
};

module.exports = { fireProjectileReducer: fireProjectileReducer };