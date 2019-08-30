// @flow

const {computeNextEntity} = require('../utils/gravity');
const {queueAdd} = require('../utils/queue');
const {config} = require('../config');

import type {GameState, Entity, Ship, PlayerID} from '../types';

const updateShip = (
  state: GameState,
  id: PlayerID,
  numTicks: number, // # ticks to update
  nextShipProps: Ship, // if the ship has updated turn/thrust, sparsely provide them here
  shouldRewindHistory: boolean
): void => {

  // rewind history
  if (shouldRewindHistory) {
    // rewind ship
    let prevShipPos = null;
    for (let i = 0; i < numTicks; i++) {
      prevShipPos = state.ships[id].history.pop();
    }
    const ship: Ship = state.ships[id];
    state.ships[id] = {
      ...ship,
      ...prevShipPos,
      ...nextShipProps,
    };
  }

  const {sun} = state;
  for (let i = 0; i < numTicks; i++) {
    const ship: Ship = state.ships[id];
    const history: Array<Entity> = ship.history;

    // rewind planets to their positions at that tick
    let rewoundPlanets = [];
    for (let j = 0; j < state.planets.length; j++) {
      const planet = state.planets[j];
      const prevPlanetPos = planet.history[planet.history.length - numTicks - i];
      rewoundPlanets.push({
        ...planet,
        ...prevPlanetPos,
      });
    }
    const masses = [sun, ...rewoundPlanets];

    queueAdd(history, ship, config.maxHistorySize);
    state.ships[id] = {
      ...ship,
      ...computeNextEntity(masses, ship, ship.thrust),
      history,
    };
  }
};

const updateProjectile = (
  state: GameState,
  j: number, // projectile entityID
  numTicks: number,
): void => {
  const {sun, planets} = state;
  const masses = [sun]; // HACK: missiles don't care about gravity of anything other than the sun
  for (let i = 0; i < numTicks; i++) {
    const projectile = state.projectiles[j];
    const history: Array<Entity> = projectile.history;
    queueAdd(history, projectile, config.maxHistorySize);
    state.projectiles[j] = {
      ...projectile,
      ...computeNextEntity(masses, projectile, projectile.thrust || 0, true /*no smart theta*/),
      history,
    }
  }
};

module.exports = {
  updateShip,
  updateProjectile,
};
