'use strict';

var _require = require('../config'),
    config = _require.config;

var _require2 = require('../selectors/selectors'),
    getClientPlayerID = _require2.getClientPlayerID;

var max = Math.max,
    round = Math.round,
    sqrt = Math.sqrt;


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
    ctx.fillRect(0, 0, config.width, config.height);

    var game = state.game;

    render(game, ctx);
  });
};

var render = function render(game, ctx) {
  // TODO abstract away rendering
  // render ships
  var colorIndex = 0;
  for (var id in game.ships) {
    var ship = game.ships[id];

    ctx.save();
    ctx.fillStyle = ['blue', 'red'][colorIndex];
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

    ctx.beginPath();
    ctx.strokeStyle = ['blue', 'red'][colorIndex];
    if (ship.history.length > 0) {
      ctx.moveTo(ship.history[0].position.x, ship.history[0].position.y);
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = ship.history[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var pastShip = _step.value;

        ctx.lineTo(pastShip.position.x, pastShip.position.y);
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

    ctx.stroke();

    ctx.fillStyle = ['blue', 'red'][colorIndex];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = ship.future[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var futureShip = _step2.value;

        ctx.fillRect(futureShip.position.x, futureShip.position.y, 2, 2);
      }
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

    colorIndex++;
  }

  // render projectiles
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = game.projectiles[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var projectile = _step3.value;

      if (projectile.type == 'missile') {
        renderMissile(ctx, projectile);
        continue;
      }
      ctx.save();
      var color = 'white';
      var length = 50;
      var width = 50;
      if (projectile.type == 'laser') {
        color = 'lime';
        length = config.laserSpeed;
        width = 2;
      }
      // TODO track colors better
      // ctx.strokeStyle = ['blue', 'red'][projectile.playerID];
      ctx.lineWidth = 1;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.translate(projectile.position.x, projectile.position.y);
      ctx.rotate(projectile.theta);
      ctx.rect(0, 0, length, width);
      ctx.fill();
      // ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }

    // render sun
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
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
};

var renderMissile = function renderMissile(ctx, missile) {
  ctx.save();
  // TODO track colors better
  // ctx.fillStyle = ['blue', 'red'][colorIndex];
  ctx.fillStyle = 'green';
  ctx.beginPath();
  ctx.translate(missile.position.x, missile.position.y);
  ctx.rotate(missile.theta);
  ctx.moveTo(missile.radius, 0);
  ctx.lineTo(-1 * missile.radius / 2, -1 * missile.radius / 2);
  ctx.lineTo(-1 * missile.radius / 2, missile.radius / 2);
  ctx.closePath();
  ctx.fill();

  if (missile.thrust > 0) {
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.moveTo(-1 * missile.radius / 1.25, 0);
    ctx.lineTo(-1 * missile.radius / 2, -1 * missile.radius / 3);
    ctx.lineTo(-1 * missile.radius / 2, missile.radius / 3);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // ctx.beginPath();
  // ctx.strokeStyle = ['blue', 'red'][colorIndex];
  // if (missile.history.length > 0) {
  //   ctx.moveTo(missile.history[0].position.x, missile.history[0].position.y);
  // }
  // for (const pastShip of missile.history) {
  //   ctx.lineTo(pastShip.position.x, pastShip.position.y);
  // }
  // ctx.stroke();
  //
  // ctx.fillStyle = ['blue', 'red'][colorIndex];
  // for (const futureShip of missile.future) {
  //   ctx.fillRect(futureShip.position.x, futureShip.position.y, 2, 2);
  // }
};

module.exports = { initRenderSystem: initRenderSystem };