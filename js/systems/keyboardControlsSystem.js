
const {config} = require('../config');
const {getClientPlayerID} = require('../selectors/selectors');
const {dispatchToServer} = require('../utils/clientToServer');

const initKeyboardControlsSystem = (store) => {
  const {dispatch} = store;
  const state = store.getState();
  const playerID = getClientPlayerID(state);
  const {time} = state;

  document.onkeydown = (ev) => {
    switch (ev.keyCode) {
      case 37: { // left
        const action = {
          type: 'SET_TURN', time, playerID, thetaSpeed: -1 * config.ship.thetaSpeed,
        };
        dispatchToServer(playerID, action);
        dispatch(action);
        break;
      }
      case 38: { // up
        const action = {type: 'SET_THRUST', time, playerID, thrust: config.ship.thrust};
        dispatchToServer(playerID, action);
        dispatch(action);
        break;
      }
      case 39: { // right
        const action = {type: 'SET_TURN', time, playerID, thetaSpeed: config.ship.thetaSpeed};
        dispatchToServer(playerID, action);
        dispatch(action);
        break;
      }
    }
  }

  document.onkeyup = (ev) => {
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
        const action = {type: 'FIRE_LASER', time, playerID};
        dispatchToServer(playerID, action);
        dispatch(action);
        break;
      }
    }
  }
};

module.exports = {initKeyboardControlsSystem};
