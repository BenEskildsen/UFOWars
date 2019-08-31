// @flow

const {config} = require('../config');
const {fireProjectileReducer} = require('./fireProjectileReducer');
const {updateShip, updateProjectile} = require('../utils/updateEntities');
const {makeExplosion} = require('../entities/explosion');
const {makeAsteroid} = require('../entities/asteroid');

import type {State, GameState, Ship, Action} from '../types';

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'SET_TURN': {
      // re-sync if necessary
      if (action.time < state.time) {
        const timeDiff = state.time - action.time;
        updateShip(
          state, action.playerID,
          timeDiff, {thetaSpeed: action.thetaSpeed},
          true, // should rewind history
        );
        return state;
      } else if (action.time > state.time) {
        return {
          ...state,
          actionQueue: [...state.actionQueue, action],
        };
      } else {
        return {
          ...state,
          ships: {
            ...state.ships,
            [action.playerID]: {
              ...state.ships[action.playerID],
              thetaSpeed: action.thetaSpeed,
            },
          },
        };
      }
    }
    case 'SET_THRUST': {
      // re-sync if necessary
      if (action.time < state.time) {
        const timeDiff = state.time - action.time;
        updateShip(
          state, action.playerID,
          timeDiff, {thrust: action.thrust, future: []},
          true, // should rewind history
        );
        return state;
      } else if (action.time > state.time) {
        return {
          ...state,
          actionQueue: [...state.actionQueue, action],
        };
      } else {
        return {
          ...state,
          ships: {
            ...state.ships,
            [action.playerID]: {
              ...state.ships[action.playerID],
              thrust: action.thrust,
              future: [],
            },
          },
        };
      }
    }
    case 'FIRE_MISSILE':
    case 'FIRE_LASER':
      return fireProjectileReducer(state, action);
    case 'MAKE_EXPLOSION': {
      const {position, age, rate, color, radius} = action;
      return {
        ...state,
        explosions: [
          ...state.explosions,
          makeExplosion(position, rate, age, color, radius),
        ],
      };
    }
    case 'SHIFT_TARGET':
      const {playerID, targetID} = action;
      return {
        ...state,
        ships: {
          ...state.ships,
          [playerID]: {
            ...state.ships[playerID],
            target: targetID,
          },
        },
      }
    case 'DESTROY_MISSILE': {
      const {id} = action;
      const nextMissiles = state.projectiles.filter(projectile => projectile.id != id);
      return {
        ...state,
        projectiles: nextMissiles,
      }
    }
    case 'MAKE_ASTEROID': {
      const {position, velocity, id} = action;
      const asteroid = makeAsteroid(position, velocity);
      asteroid.id = id;
      window.nextID = id + 13; // HACK
      asteroid.theta += Math.random() * Math.PI;
      return {
        ...state,
        asteroids: [...state.asteroids, asteroid],
      };
    }
    case 'DESTROY_ASTEROID': {
      const {id} = action;
      const nextAsteroids = state.asteroids.filter(projectile => projectile.id != id);
      return {
        ...state,
        asteroids: nextAsteroids,
      }
    }

  }

  return state;
};

module.exports = {gameReducer};
