
const {config} = require('../config');
const {getClientPlayerID} = require('../selectors/selectors');
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
      case 67: // c
        // if defender, target missile, if attacker, target planet
        for (const id in state.game.ships) {
          target = id == playerID ? 'Missile' : 'Planet';
          break;
        }

        // purposefully fall through into space
      case 32: { // space
        // don't fire the action at all if this player has any other missiles
        let dontFire = false;
        for (const projectile of state.game.projectiles) {
          if (projectile.playerID == playerID) {
            dontFire = true;
            break;
          }
        }
        if (dontFire) {
          break;
        }
        target = target == null ? 'Ship' : target;
        const action = {type: 'FIRE_MISSILE', time, playerID, target};
        dispatchToServer(playerID, action);
        dispatch(action);
        break;
      }
    }
  }
};

module.exports = {initKeyboardControlsSystem};
