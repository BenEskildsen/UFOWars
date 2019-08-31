// no flow checking cuz it's annoying

const {makeVector, vectorTheta, add, subtract, distance} = require('../utils/vectors');
const {config} = require('../config');
const {
  getClientPlayerID,
  getGameMode,
  getHostPlayerID,
} = require('../selectors/selectors');
const {dispatchToServer} = require('../utils/clientToServer');

import type {Store} from '../types';

/**
 * Creates asteroids in coop mode
 */
const initAsteroidSystem = (store: Store): void => {

  let time = store.getState().game.time;
  store.subscribe(() => {
    const state = store.getState();
    // only check on a new tick
    if (state.game.time == time) {
      return;
    }
    time = state.game.time;

    const clientPlayerID = getClientPlayerID(state);
    const thisPlayerIsHost = clientPlayerID === getHostPlayerID(state);
    const gameMode = getGameMode(state);

    // only the host makes asteroids in a coop game
    if (!thisPlayerIsHost || gameMode != 'coop') {
      return;
    }

    // naive way to generate asteroids every once in a while
    if (Math.round(Math.random() * 40) < 2) {
      const action = randomAsteroidAction(state);
      dispatchToServer(clientPlayerID, action);
      store.dispatch(action);
    }
  })
}

const randomAsteroidAction = (state): Action => {
  const {width, height} = config;
  let x = 0;
  let y = 0;
  const branch = Math.floor(Math.random() * 4);
  if (branch == 0) {
    x = Math.round(Math.random() * 10);
    y = Math.round(Math.random() * height - 10);
  } else if (branch == 1) {
    x = Math.round(Math.random() * 10) + width;
    y = Math.round(Math.random() * height + 10) - 5;
  } else if (branch == 2) {
    x = Math.round(Math.random() * width + 10) - 5;
    y = Math.round(Math.random() * 10) + height;
  } else {
    x = Math.round(Math.random() * width + 10) - 5;
    y = Math.round(Math.random() * - 10);
  }
  const position = {x, y};
  const direction = subtract({x: width / 2, y: height / 2}, position);
  const theta = vectorTheta(direction) / Math.PI * 180;
  const fuzzyTheta = theta * (Math.random() * config.asteroid.thetaFuzziness
    * 2 - config.asteroid.thetaFuzziness) / 180 * Math.PI;
  const velocity = makeVector(fuzzyTheta, config.asteroid.speed);
  velocity.y *= -1;

  return {type: 'MAKE_ASTEROID', position, velocity, id: window.nextID + 7};
}

module.exports = {initAsteroidSystem};
