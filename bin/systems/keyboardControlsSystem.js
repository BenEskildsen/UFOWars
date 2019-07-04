'use strict';

var _require = require('../config'),
    config = _require.config;

var _require2 = require('../selectors/selectors'),
    getClientPlayerID = _require2.getClientPlayerID;

var initKeyboardControlsSystem = function initKeyboardControlsSystem(store) {
  var dispatch = store.dispatch;

  var state = store.getState();
  var playerID = getClientPlayerID(state);

  document.onkeydown = function (ev) {
    switch (ev.keyCode) {
      case 37:
        // left
        dispatch({ type: 'SET_TURN', playerID: playerID, thetaSpeed: -1 * config.ship.thetaSpeed });
        break;
      case 38:
        // up
        dispatch({ type: 'SET_THRUST', playerID: playerID, thrust: config.ship.thrust });
        break;
      case 39:
        // right
        dispatch({ type: 'SET_TURN', playerID: playerID, thetaSpeed: config.ship.thetaSpeed });
    }
  };

  document.onkeyup = function (ev) {
    switch (ev.keyCode) {
      case 37:
        // left
        dispatch({ type: 'SET_TURN', playerID: playerID, thetaSpeed: 0 });
      case 38:
        // up
        dispatch({ type: 'SET_THRUST', playerID: playerID, thrust: 0 });
        break;
      case 39:
        // right
        dispatch({ type: 'SET_TURN', playerID: playerID, thetaSpeed: 0 });
        break;
      case 32:
        // space
        dispatch({ type: 'FIRE_LASER', playerID: playerID });
    }
  };
};

module.exports = { initKeyboardControlsSystem: initKeyboardControlsSystem };