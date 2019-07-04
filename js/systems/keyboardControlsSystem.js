
const {config} = require('../config');
const {getClientPlayerID} = require('../selectors/selectors');

const initKeyboardControlsSystem = (store) => {
  const {dispatch} = store;
  const state = store.getState();
  const playerID = getClientPlayerID(state);

  document.onkeydown = (ev) => {
    switch (ev.keyCode) {
      case 37: // left
        dispatch({type: 'SET_TURN', playerID, thetaSpeed: -1 * config.ship.thetaSpeed});
        break;
      case 38: // up
        dispatch({type: 'SET_THRUST', playerID, thrust: config.ship.thrust});
        break;
      case 39: // right
        dispatch({type: 'SET_TURN', playerID, thetaSpeed: config.ship.thetaSpeed});
    }
  }

  document.onkeyup = (ev) => {
    switch (ev.keyCode) {
      case 37: // left
        dispatch({type: 'SET_TURN', playerID, thetaSpeed: 0});
      case 38: // up
        dispatch({type: 'SET_THRUST', playerID, thrust: 0});
        break;
      case 39: // right
        dispatch({type: 'SET_TURN', playerID, thetaSpeed: 0});
        break;
      case 32: // space
        dispatch({type: 'FIRE_LASER', playerID});
    }
  }
};

module.exports = {initKeyboardControlsSystem};
