
const {config} = require('../config');
const {
  getGameMode,
  getNextTarget,
  getClientPlayerID,
  getHostPlayerID,
} = require('../selectors/selectors');
const {dispatchToServer} = require('../utils/clientToServer');

const initKeyboardControlsSystem = (store) => {
  const {dispatch} = store;
  const state = store.getState();
  const playerID = getClientPlayerID(state);

  document.onkeydown = (ev) => {
    const state = store.getState();
    const {time, ships} = state.game;
    switch (ev.keyCode) {
      case 37: { // left
        if (ships[playerID].thetaSpeed == -1 * config.ship.thetaSpeed) {
          return; // don't dispatch redundantly
        }
        const action = {
          type: 'SET_TURN', time, playerID, thetaSpeed: -1 * config.ship.thetaSpeed,
        };
        dispatchToServer(playerID, action);
        dispatch(action);
        break;
      }
      case 38: { // up
        if (ships[playerID].thrust == config.ship.thrust) {
          return; // don't dispatch redundantly
        }
        const action = {type: 'SET_THRUST', time, playerID, thrust: config.ship.thrust};
        dispatchToServer(playerID, action);
        dispatch(action);
        break;
      }
      case 39: { // right
        if (ships[playerID].thetaSpeed == config.ship.thetaSpeed) {
          return; // don't dispatch redundantly
        }
        const action = {type: 'SET_TURN', time, playerID, thetaSpeed: config.ship.thetaSpeed};
        dispatchToServer(playerID, action);
        dispatch(action);
        break;
      }
    }
  }

  document.onkeyup = (ev) => {
    const state = store.getState();
    const {time} = state.game;
    let target = null;
    switch (ev.keyCode) {
      case 37: { // left
        const action = {type: 'SET_TURN', time, playerID, thetaSpeed: 0};
        dispatchToServer(playerID, action);
        dispatch(action);
        break;
      }
      case 38: { // up
        const action = {type: 'SET_THRUST', time, playerID, thrust: 0};
        dispatchToServer(playerID, action);
        dispatch(action);
        break;
      }
      case 39: { // right
        const action = {type: 'SET_TURN', time, playerID, thetaSpeed: 0};
        dispatchToServer(playerID, action);
        dispatch(action);
        break;
      }
      case 32: { // space
        // don't fire the action at all if this player has any other missiles
        let dontFire = false;
        for (const projectile of state.game.projectiles) {
          if (projectile.playerID == playerID) {
            dontFire = true;
            break;
          }
        }
        dontFire = dontFire && gameMode == 'versus'; // can fire more in co-op
        if (dontFire) {
          break;
        }
        target = state.game.ships[playerID].target;
        const thisPlayerIsHost = getClientPlayerID(state) === getHostPlayerID(state);
        const offset = thisPlayerIsHost ? 5 : 10;
        const id = window.nextID + offset; // HACK: pass this along so both players
                                           // agree what its id is
        const gameMode = getGameMode(state);
        if (gameMode == 'versus') {
          const action = {type: 'FIRE_MISSILE', time, playerID, target, id};
          dispatchToServer(playerID, action);
          dispatch(action);
        } else {
          const action = {type: 'FIRE_LASER', time, playerID};
          dispatchToServer(playerID, action);
          dispatch(action);
        }
        break;
      }

      case 16: { // shift
        const targetID = getNextTarget(state.game, playerID);
        const action = {type: 'SHIFT_TARGET', playerID, targetID};
        if (getGameMode(state) == 'coop') {
          dispatchToServer(playerID, action);
        }
        dispatch(action);
      }
    }
  }
};

module.exports = {initKeyboardControlsSystem};
