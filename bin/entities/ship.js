'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('./entity'),
    makeEntity = _require.makeEntity;

var _require2 = require('../config'),
    config = _require2.config;

var _require3 = require('../selectors/selectors'),
    getPlayerColor = _require3.getPlayerColor;

var max = Math.max,
    round = Math.round,
    sqrt = Math.sqrt;


var makeShip = function makeShip(playerID, mass, radius, position, velocity) {
  // TODO make velocity function of position to guarantee stable orbit
  var theta = Math.atan2(velocity.y, velocity.x);
  return _extends({}, makeEntity(mass, radius, position, velocity, theta), {
    playerID: playerID,
    thrust: 0,

    fuel: { cur: 100, max: config.ship.maxFuel },
    laserCharge: { cur: 100, max: config.ship.maxLaser }
  });
};

var renderShip = function renderShip(state, ctx, id) {
  var game = state.game;

  var ship = game.ships[id];
  var color = getPlayerColor(state, ship.playerID);

  ctx.save();
  ctx.fillStyle = color;
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
  ctx.strokeStyle = color;
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

  ctx.fillStyle = color;
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
};

module.exports = { makeShip: makeShip, renderShip: renderShip };