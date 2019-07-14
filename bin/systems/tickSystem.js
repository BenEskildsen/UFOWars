'use strict';

var _require = require('../config'),
    config = _require.config;

var initTickSystem = function initTickSystem(store) {
  var interval = setInterval(function () {
    return store.dispatch({ type: 'TICK' });
  }, config.msPerTick);
};

module.exports = { initTickSystem: initTickSystem };