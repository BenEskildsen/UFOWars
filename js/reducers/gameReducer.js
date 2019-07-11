// @flow

const {config} = require('../config');
const {tickReducer} = require('./tickReducer');
const {fireProjectileReducer} = require('./fireProjectileReducer');
const {updateShip, updateProjectile} = require('../utils/updateEntities');

import type {State, GameState, Action} from '../types';

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'TICK':
      return tickReducer(state);
    case 'SET_TURN': {
      // re-sync if necessary
      if (action.time < state.time) {
        const timeDiff = state.time - action.time;
        console.log(state.time, action.time, timeDiff);
        // rewind history
        let prevPos = null;
        for (let i = 0; i < timeDiff; i++) {
          prevPos = state.ships[action.playerID].history.pop();
        }
        state.ships[action.playerID] = {
          ...state.ships[action.playerID],
          ...prevPos,
          thetaSpeed: action.thetaSpeed,
        };
        updateShip(state, action.playerID, timeDiff);
        return state;
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
        state.ships[action.playerID] = {
          ...state.ships[action.playerID],
          ...prevPos,
          thrust: action.thrust,
        }
        updateShip(state, action.playerID, timeDiff);
        return state;
      } else {
        return {
          ...state,
          ships: {
            ...state.ships,
            [action.playerID]: {
              ...state.ships[action.playerID],
              thrust: action.thrust,
            },
          },
        };
      }
    }
    case 'FIRE_LASER': {
      return fireProjectileReducer(state, action);
    }
  }

  return state;
};

module.exports = {gameReducer};
