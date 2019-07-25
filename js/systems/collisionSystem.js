// no flow checking cuz it's annoying

const {subtract, distance} = require('../utils/vectors');
const {config} = require('../config');
const {
  getOtherPlayerID,
  getPlayerByID,
  getClientPlayerID,
} = require('../selectors/selectors');
const {dispatchToServer} = require('../utils/clientToServer');
const React = require('React');
const Button = require('../ui/Button.react');

import type {Store} from '../types';

const initCollisionSystem = (store: Store): void => {

  let time = store.getState().game.time;
  const {dispatch} = store;
  store.subscribe(() => {
    const state = store.getState();
    // only check on a new tick
    if (state.game.time == time || state.game.tickInterval == null) {
      return;
    }
    time = state.game.time;

    const {sun} = state.game;

    // projectile collides with sun
    // implemented in tickReducer

    let gameOver = false;
    let message = '';
    let loserID = null;

    // ship collides with sun
    for (const id in state.game.ships) {
      const ship = state.game.ships[id];
      const distVec = subtract(ship.position, sun.position);
      const dist = distance(distVec);
      if (dist < sun.radius) {
        gameOver = true;
        message = getPlayerByID(state, id).name + ' crashed into the sun!';
        loserID = id;
      }
    }

    // ship collides with planet
    for (const id in state.game.ships) {
      const ship = state.game.ships[id];
      for (const planet of state.game.planets) {
        const distVec = subtract(ship.position, planet.position);
        const dist = distance(distVec);
        if (dist < planet.radius) {
          gameOver = true;
          message = getPlayerByID(state, id).name + ' crashed into the earth!';
          loserID = id;
        }
      }
    }

    // ship collides with projectile
    for (const id in state.game.ships) {
      for (const projectile of state.game.projectiles) {
        const ship = state.game.ships[id];
        const distVec = subtract(ship.position, projectile.position);
        const dist = distance(distVec);
        // don't get hit by your own laser you just fired
        if (dist < ship.radius + projectile.radius &&
          !(projectile.playerID == id && projectile.history.length < 10)
        ) {
          gameOver = true;
          message = getPlayerByID(state, id).name + ' was hit by a ' + projectile.type + '!';
          loserID = id;
        }
      }
    }

    const thisClientID = getClientPlayerID(state);
    if (gameOver && loserID == thisClientID) {
      const otherPlayerID = getOtherPlayerID(state);

      // set ready state for both players
      const readyAction = {type: 'SET_PLAYER_READY', playerID: thisClientID, ready: false};
      dispatchToServer(thisClientID, readyAction);
      dispatch(readyAction);
      const otherReadyAction = {
        type: 'SET_PLAYER_READY', playerID: otherPlayerID, ready: false,
      };
      dispatchToServer(thisClientID, otherReadyAction);
      dispatch(otherReadyAction);

      // stop game
      const stopAction = {type: 'STOP_TICK'};
      dispatch(stopAction);
      dispatchToServer(thisClientID, stopAction);

      // update scores
      for (const id in state.game.ships) {
        const player = getPlayerByID(state, id);
        if (player.id != loserID) {
          const scoreAction = {
            type: 'SET_PLAYER_SCORE',
            playerID: player.id,
            score: player.score + 1,
          };
          dispatch(scoreAction);
          dispatchToServer(thisClientID, scoreAction);
        }
      }
      // dispatch modals with messages
      dispatch({
        type: 'SET_MODAL', title: 'You Lose!', text: message, name: 'gameover',
      });
      dispatchToServer(thisClientID, {
        type: 'SET_MODAL', title: 'You Win!', text: message, name: 'gameover',
      });
    }
  });
}

module.exports = {initCollisionSystem};
