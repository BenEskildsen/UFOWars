// @flow

const {computeNextEntity} = require('../utils/gravity');
const {queueAdd} = require('../utils/queue');
const {config} = require('../config');

import type {GameState, Entity, Ship, PlayerID} from '../types';

const updateShip = (state: GameState, id: PlayerID, numTicks: number): void => {
  const {sun, planets} = state;
  const masses = [sun, ...planets];
  for (let i = 0; i < numTicks; i++) {
    const ship: Ship = state.ships[id];
    const history: Array<Entity> = ship.history;
    queueAdd(history, ship, config.maxHistorySize);
    state.ships[id] = {
      ...ship,
      ...computeNextEntity(masses, ship, ship.thrust),
      history,
    };
  }
};

const updateProjectile = (state: GameState, j: number, numTicks: number): void => {
  const {sun, planets} = state;
  const masses = [sun, ...planets];
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
