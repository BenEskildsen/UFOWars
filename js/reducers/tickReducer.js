// @flow

const {computeNextEntity} = require('../physics/gravity');
const {sin, cos, abs, sqrt} = Math;

import type {Ship, GameState} from '../types';

/**
 * Updates the gamestate in place for performance/laziness
 */
const tickReducer = (state: GameState): GameState => {
  state.time = state.time + 1;

  const {sun} = state;

  // update ships
  for (const id in state.ships) {
    const ship: Ship = state.ships[id];

    state.ships[id] = {
      ...ship,
      ...computeNextEntity(sun, ship, ship.thrust),
    };
  }

  // update planets
  state.planets = state.planets.map(planet => {
    return {
      ...planet,
      ...computeNextEntity(sun, planet),
    };
  });

  // TODO update projectiles/lasers/missiles

  // TODO update paths

  return state;
}

module.exports = {tickReducer};
