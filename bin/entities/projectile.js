'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('./entity'),
    makeEntity = _require.makeEntity;

var _require2 = require('../config'),
    config = _require2.config;

var _require3 = require('../utils/vectors'),
    makeVector = _require3.makeVector,
    add = _require3.add;

var _require4 = require('../selectors/selectors'),
    getPlayerColor = _require4.getPlayerColor;

var max = Math.max,
    round = Math.round,
    sqrt = Math.sqrt;


var makeLaserProjectile = function makeLaserProjectile(playerID, position, theta) {
  var velocity = makeVector(theta, config.laserSpeed);
  return _extends({}, makeEntity(0 /* mass */, 0 /* radius */, position, velocity, theta), {
    playerID: playerID,
    type: 'laser'
  });
};

var makeMissileProjectile = function makeMissileProjectile(playerID, position, theta, velocity, target) {
  var projectile = _extends({}, makeLaserProjectile(playerID, position, theta), {
    type: 'missile',
    mass: config.missile.mass,
    radius: config.missile.radius,
    velocity: add(velocity, makeVector(theta, config.missile.speed)),
    target: target,
    age: 0,
    thrust: 0,
    fuel: { cur: config.missile.maxFuel, max: config.missile.maxFuel }
  });
  return projectile;
};

var renderProjectile = function renderProjectile(state, ctx, projectile) {
  switch (projectile.type) {
    case 'missile':
      renderMissile(state, ctx, projectile);
      break;
    case 'laser':
      renderLaser(state, ctx, projectile);
      break;
  }
};

var renderLaser = function renderLaser(state, ctx, projectile) {
  ctx.save();
  ctx.beginPath();
  var length = config.laserSpeed;
  var width = 8;
  ctx.fillStyle = 'lime';
  ctx.translate(projectile.position.x, projectile.position.y);
  ctx.rotate(projectile.theta);
  ctx.rect(0, 0, length, width);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

var renderMissile = function renderMissile(state, ctx, missile) {
  ctx.save();
  ctx.strokeStyle = getPlayerColor(state, missile.playerID);
  ctx.fillStyle = 'green';
  ctx.beginPath();
  ctx.translate(missile.position.x, missile.position.y);
  ctx.rotate(missile.theta);

  // ctx.arc(0, 0, missile.radius, Math.PI * 1.5, Math.PI * 0.5);
  ctx.moveTo(missile.radius, 0);
  // ctx.lineTo(missile.radius, -2 * missile.radius);
  // ctx.lineTo(-1 * missile.radius, -2 * missile.radius);
  // ctx.lineTo(-1 * missile.radius, 0);

  ctx.lineTo(-1 * missile.radius / 2, -1 * missile.radius / 2);
  ctx.lineTo(-1 * missile.radius / 2, missile.radius / 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

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
};

module.exports = {
  makeLaserProjectile: makeLaserProjectile,
  makeMissileProjectile: makeMissileProjectile,
  renderMissile: renderMissile,
  renderProjectile: renderProjectile,
  renderLaser: renderLaser
};