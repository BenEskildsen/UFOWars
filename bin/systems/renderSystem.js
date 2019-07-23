'use strict';

var _require = require('../config'),
    config = _require.config;

var _require2 = require('../selectors/selectors'),
    getClientPlayerID = _require2.getClientPlayerID,
    getPlayerColor = _require2.getPlayerColor;

var _require3 = require('../entities/ship'),
    renderShip = _require3.renderShip;

var _require4 = require('../entities/projectile'),
    renderProjectile = _require4.renderProjectile;

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
    if (state.game.time == time && state.game.tickInterval != null) {
      return;
    }
    // important to track time this way so this only happens once per tick
    time = state.game.time;

    if (!canvas) {
      canvas = document.getElementById('canvas');
      if (!canvas) return; // don't break
      ctx = canvas.getContext('2d');
    }

    // clear
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);

    render(state, ctx);
  });
};

var render = function render(state, ctx) {
  var game = state.game;

  // scale solar system to the canvas

  ctx.save();
  ctx.scale(config.canvasWidth / config.width, config.canvasHeight / config.height);

  // render ships
  for (var id in game.ships) {
    renderShip(state, ctx, id);
  }

  // render projectiles
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = game.projectiles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var projectile = _step.value;

      renderProjectile(state, ctx, projectile);
    }

    // render sun
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var sun = game.sun;

  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(sun.position.x, sun.position.y, sun.radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();

  // render planets
  // TODO

  ctx.restore();
};

module.exports = { initRenderSystem: initRenderSystem };