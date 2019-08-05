// @flow

const {config} = require('../config');
const {fireProjectileReducer} = require('./fireProjectileReducer');
const {updateShip, updateProjectile} = require('../utils/updateEntities');
const {makeExplosion} = require('../entities/explosion');
const {getNextTarget} = require('../selectors/selectors');

import type {State, GameState, Ship, Action} from '../types';

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'SET_TURN': {
      // re-sync if necessary
      if (action.time < state.time) {
        const timeDiff = state.time - action.time;
        // rewind history
        let prevPos = null;
        for (let i = 0; i < timeDiff; i++) {
          prevPos = state.ships[action.playerID].history.pop();
        }
        const ship: Ship = state.ships[action.playerID];
        state.ships[action.playerID] = {
          ...ship,
          ...prevPos,
          thetaSpeed: action.thetaSpeed,
        };
        updateShip(state, action.playerID, timeDiff);
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
        // rewind history
        let prevPos = null;
        for (let i = 0; i < timeDiff; i++) {
          prevPos = state.ships[action.playerID].history.pop();
        }
        const ship: Ship = state.ships[action.playerID];
        state.ships[action.playerID] = {
          ...ship,
          ...prevPos,
          thrust: action.thrust,
          future: [],
        }
        updateShip(state, action.playerID, timeDiff);
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
      const {playerID} = action;
      const nextTarget = getNextTarget(state, playerID);
      return {
        ...state,
        ships: {
          ...state.ships,
          [playerID]: {
            ...state.ships[playerID],
            target: nextTarget,
          },
        },
      }
  }

  return state;
};

module.exports = {gameReducer};
