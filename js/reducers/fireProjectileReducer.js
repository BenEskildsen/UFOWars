// @flow

const {config} = require('../config');
const {queueAdd} = require('../utils/queue');
const {makeVector} = require('../utils/vectors')
const {makeLaserProjectile} = require('../entities/projectile');

import type {State, GameState, Action} from '../types';

const fireProjectileReducer = (state: GameState, action: Action): GameState => {
  const {playerID} = action;
  const {projectiles, ships} = state;
  let shipPosition = ships[playerID].position;
  let shipTheta = ships[playerID].theta;
  switch (action.type) {
    case 'FIRE_LASER':
      if (action.time < state.time) {
        const timeDiff = state.time - action.time;
        // rewind history
        const prevPos = ships[playerID].history[ships[playerID].history.length - timeDiff - 1];
        shipPosition = prevPos.position;
        shipTheta = prevPos.theta;
      } else if (action. time > state.time) {
        return {
          ...state,
          actionQueue: [...state.actionQueue, action],
        };
      }
      const velocity = makeVector(shipTheta, config.laserSpeed);
      const projectile = makeLaserProjectile(playerID, shipPosition, velocity, shipTheta);
      queueAdd(projectiles, projectile, config.maxProjectiles);
      return {
        ...state,
        projectiles,
      };
  }

  return state;
};

module.exports = {fireProjectileReducer};
