// @flow

const {config} = require('../config');
const {queueAdd} = require('../utils/queue');
const {makeVector} = require('../utils/vectors')
const {makeLaserProjectile} = require('../entities/projectile');

import type {State, GameState, Action} from '../types';

const fireProjectileReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'FIRE_LASER':
      const {playerID} = action;
      const {projectiles, ships} = state;
      const {position, theta} = ships[playerID];
      const velocity = makeVector(theta, config.laserSpeed);
      const projectile = makeLaserProjectile(playerID, position, velocity, theta);
      queueAdd(projectiles, projectile, config.maxProjectiles);
      return {
        ...state,
        projectiles,
      };
  }

  return state;
};

module.exports = {fireProjectileReducer};
