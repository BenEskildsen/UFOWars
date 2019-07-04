'use strict';

var _require = require('../config'),
    config = _require.config;

var initTickSystem = function initTickSystem(store) {
  // TODO need a mechanism for pausing
  var interval = setInterval(function () {
    return store.dispatch({ type: 'TICK' });
  }, config.msPerTick);
};

module.exports = { initTickSystem: initTickSystem };