// @flow

const {computeNextEntity} = require('../utils/gravity');
const {queueAdd} = require('../utils/queue');
const {subtract, distance} = require('../utils/vectors');
const {updateShip, updateProjectile} = require('../utils/updateEntities');
const {config} = require('../config');
const {sin, cos, abs, sqrt} = Math;
const {gameReducer} = require('./gameReducer');
const {invariant} = require('../utils/errors');

import type {Ship, GameState, Entity, Action} from '../types';

const tickReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'START_TICK':
      // this behavior bundled into START
      // if (!state.tickInterval) {
      //   state.tickInterval = setInterval(
      //     () => store.dispatch({type: 'TICK'}),
      //     config.msPerTick,
      //   );
      // }
      return state;
    case 'STOP_TICK':
      clearInterval(state.tickInterval);
      state.tickInterval = null;
      return state;
    case 'TICK':
      return handleTick(state);
  }
  return state;
};

/**
 * Updates the gamestate in place for performance/laziness
 */
const handleTick = (state: GameState): GameState => {
  state.time = state.time + 1;

  const {sun, planets} = state;
  const masses = [sun, ...planets];

  for (const id in state.ships) {
    updateShip(state, id, 1 /* one tick */);
    const ship: Ship = state.ships[id];
    ship.future = [];
    let futureShip = {...ship};
    while (ship.future.length < config.maxFutureSize) {
      futureShip = {...computeNextEntity(masses, futureShip)};
      ship.future.push(futureShip);
    }
  }

  // update planets
  state.planets = state.planets.map(planet => {
    const history: Array<Entity> = planet.history;
    queueAdd(history, planet, config.maxHistorySize);
    return {
      ...planet,
      ...computeNextEntity([sun], planet),
      history,
    };
  });

  // update projectiles
  const {missile} = config;
  for (let i = 0; i < state.projectiles.length; i++) {
    // handle missiles
    const projectile = state.projectiles[i];
    projectile.age += 1;
    switch (projectile.target) {
      case 'Ship': {
        let targetShip = null;
        for (const id in state.ships) {
          if (id != projectile.playerID) {
            targetShip = state.ships[id];
            break;
          }
        }
        invariant(targetShip != null, 'Missile has no target ship');
        const dist = subtract(targetShip.position, projectile.position);
        projectile.theta = Math.atan2(dist.y, dist.x);
        break;
      }
      case 'Missile':
      case 'Planet':
        // TODO
    }
    if (projectile.age > missile.thrustAt && projectile.fuel.cur > 0) {
      projectile.fuel.cur -= 1;
      projectile.thrust = missile.thrust;
    }

    updateProjectile(state, i, 1 /* one tick */);
  }

  // check on queued actions
  let nextState = state;
  const nextActionQueue = [];
  for (const action of state.actionQueue) {
    if (action.time == state.time) {
      nextState = gameReducer(nextState, action);
    } else {
      nextActionQueue.push(action);
    }
  }

  // projectiles colliding with sun
  let nextProjectiles = state.projectiles.filter(projectile => {
    const dist = distance(subtract(projectile.position, sun.position));
    return dist > sun.radius;
  });
  // clean up old missiles
  nextProjectiles = nextProjectiles.filter(projectile => {
    return !(projectile.type == 'missile' && projectile.age > missile.maxAge)
  });

  return {
    ...nextState,
    projectiles: nextProjectiles,
    actionQueue: nextActionQueue,
  };
}

module.exports = {tickReducer};
