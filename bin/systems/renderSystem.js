'use strict';

var _require = require('../config'),
    config = _require.config;

/**
 * Render things into the canvas
 */
var initRenderSystem = function initRenderSystem(store) {

  var time = store.getState().game.time;
  var canvas = null;
  var ctx = null;
  store.subscribe(function () {
    var state = store.getState();
    // only check on a new tick
    if (state.game.time == time) {
      return;
    }
    // import to do track time this way so this only happens once per tick
    time = state.game.time;

    if (!canvas) {
      canvas = document.getElementById('canvas');
      if (!canvas) return; // don't break
      ctx = canvas.getContext('2d');
    }

    // clear
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, config.width, config.height);

    // TODO abstract away rendering
    // render ships
    var game = state.game;

    for (var id in game.ships) {
      ctx.save();
      ctx.fillStyle = { '0': 'blue', '1': 'red' }[id];
      var ship = game.ships[id];
      ctx.beginPath();
      ctx.translate(ship.position.x, ship.position.y);
      ctx.rotate(ship.theta);
      ctx.moveTo(ship.radius, 0);
      ctx.lineTo(-1 * ship.radius / 2, -1 * ship.radius / 2);
      ctx.lineTo(-1 * ship.radius / 2, ship.radius / 2);
      ctx.closePath();
      ctx.fill();

      if (ship.thrust > 0) {
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.moveTo(-1 * ship.radius / 1.25, 0);
        ctx.lineTo(-1 * ship.radius / 2, -1 * ship.radius / 3);
        ctx.lineTo(-1 * ship.radius / 2, ship.radius / 3);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // render sun
    var sun = game.sun;

    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(sun.position.x, sun.position.y, sun.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    // render planets
    // TODO
  });
};

module.exports = { initRenderSystem: initRenderSystem };