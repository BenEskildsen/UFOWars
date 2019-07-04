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

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = ship.history[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var pastShip = _step.value;

          ctx.fillStyle = { '0': 'blue', '1': 'red' }[id];
          ctx.fillRect(pastShip.position.x, pastShip.position.y, 2, 2);
        }
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
    }

    // render projectiles
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = game.projectiles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var projectile = _step2.value;

        ctx.save();
        var color = 'white';
        var length = 50;
        var width = 50;
        if (projectile.type == 'laser') {
          color = 'lime';
          length = config.laserSize * 6;
          width = config.laserSize;
        }
        ctx.strokeStyle = { '0': 'blue', '1': 'red' }[projectile.playerID];
        ctx.lineWidth = 1;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.translate(projectile.position.x, projectile.position.y);
        ctx.rotate(projectile.theta);
        ctx.rect(0, 0, length, width);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      }

      // render sun
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
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
  });
};

module.exports = { initRenderSystem: initRenderSystem };