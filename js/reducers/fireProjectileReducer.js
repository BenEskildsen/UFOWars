// @flow

const {config} = require('../config');
const {queueAdd} = require('../utils/queue');
const {makeVector} = require('../utils/vectors')
const {makeLaserProjectile, makeMissileProjectile} = require('../entities/projectile');

import type {State, GameState, Action} from '../types';

const fireProjectileReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'FIRE_LASER': {
      const {playerID} = action;
      const {projectiles, ships} = state;
      let shipPosition = ships[playerID].position;
      let shipTheta = ships[playerID].theta;
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
      const projectile = makeLaserProjectile(playerID, shipPosition, shipTheta);
      queueAdd(projectiles, projectile, config.maxProjectiles);
      return {
        ...state,
        projectiles,
      };
    }
    case 'FIRE_MISSILE': {
      const {playerID, target, id} = action;
      const {projectiles, ships} = state;
      let shipPosition = ships[playerID].position;
      let shipTheta = ships[playerID].theta;
      let shipVelocity = ships[playerID].velocity;
      if (action.time < state.time) {
        const timeDiff = state.time - action.time;
        // rewind history
        const prevPos = ships[playerID].history[ships[playerID].history.length - timeDiff - 1];
        shipPosition = prevPos.position;
        shipTheta = prevPos.theta;
        shipVelocity = prevPos.velocity;
      } else if (action. time > state.time) {
        return {
          ...state,
          actionQueue: [...state.actionQueue, action],
        };
      }
      const projectile = makeMissileProjectile(
        playerID,
        shipPosition,
        shipTheta,
        shipVelocity,
        target,
      );
      projectile.id = id;
      window.nextID = id + 11; // HACK we really don't want the two players to make different
                               // entities with the same id
      queueAdd(projectiles, projectile, config.maxProjectiles);
      return {
        ...state,
        projectiles,
      };
    }
  }

  return state;
};

module.exports = {fireProjectileReducer};
