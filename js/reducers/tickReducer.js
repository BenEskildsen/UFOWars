// @flow

const {computeNextEntity} = require('../utils/gravity');
const {queueAdd} = require('../utils/queue');
const {updateShip, updateProjectile} = require('../utils/updateEntities');
const {config} = require('../config');
const {sin, cos, abs, sqrt} = Math;

import type {Ship, GameState, Entity} from '../types';

/**
 * Updates the gamestate in place for performance/laziness
 */
const tickReducer = (state: GameState): GameState => {
  state.time = state.time + 1;

  const {sun} = state;

  for (const id in state.ships) {
    updateShip(state, id, 1 /* one tick */);
  }

  // update planets
  state.planets = state.planets.map(planet => {
    const history: Array<Entity> = planet.history;
    queueAdd(history, planet, config.maxHistorySize);
    return {
      ...planet,
      ...computeNextEntity(sun, planet),
      history,
    };
  });

  for (let i = 0; i < state.projectiles.length; i++) {
    updateProjectile(state, i, 1 /* one tick */);
  }

  // TODO update paths

  return state;
}

module.exports = {tickReducer};
