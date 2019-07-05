// @flow

const {computeNextEntity} = require('../physics/gravity');
const {queueAdd} = require('../utils/queue');
const {config} = require('../config');
const {sin, cos, abs, sqrt} = Math;

import type {Ship, GameState, Entity} from '../types';

/**
 * Updates the gamestate in place for performance/laziness
 */
const tickReducer = (state: GameState): GameState => {
  state.time = state.time + 1;

  const {sun} = state;

  // update ships
  for (const id in state.ships) {
    const ship: Ship = state.ships[id];
    const history: Array<Entity> = ship.history;
    queueAdd(history, ship, config.maxHistorySize);
    state.ships[id] = {
      ...ship,
      ...computeNextEntity(sun, ship, ship.thrust),
      history,
    };
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

  // update projectiles
  state.projectiles = state.projectiles.map(projectile => {
    const history: Array<Entity> = projectile.history;
    queueAdd(history, projectile, config.maxHistorySize);
    return {
      ...projectile,
      ...computeNextEntity(sun, projectile),
      history,
    };
  });

  // TODO update paths

  return state;
}

module.exports = {tickReducer};
