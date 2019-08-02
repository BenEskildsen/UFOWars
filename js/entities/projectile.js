// @flow

const {makeEntity} = require('./entity');
const {config} = require('../config');
const {makeVector, add} = require('../utils/vectors');
const {getPlayerColor} = require('../selectors/selectors');
const {max, round, sqrt} = Math;

import type {Radians, PlayerID, Vector, Projectile, Missile} from '../types';

const makeLaserProjectile = (
  playerID: PlayerID,
  position: Vector,
  theta: Radians,
): Projectile => {
  const velocity = makeVector(theta, config.laserSpeed);
  return {
    ...makeEntity(0 /* mass */, 0 /* radius */, position, velocity, theta),
    playerID,
    type: 'laser',
  };
};

const makeMissileProjectile = (
  playerID: PlayerID,
  position: Vector,
  theta: Radians,
  velocity: Vector,
  target: 'Ship' | 'Missile' | 'Planet',
): Missile => {
  const projectile = {
    ...makeLaserProjectile(playerID, position, theta),
    type: 'missile',
    mass: config.missile.mass,
    radius: config.missile.radius,
    velocity: add(velocity, makeVector(theta, config.missile.speed)),
    target,
    age: 0,
    thrust: 0,
    fuel: {cur: config.missile.maxFuel, max: config.missile.maxFuel},
  };
  return projectile;
}

const renderProjectile = (state, ctx, projectile): void => {
  switch (projectile.type) {
    case 'missile':
      renderMissile(state, ctx, projectile);
      break;
    case 'laser':
      renderLaser(state, ctx, projectile);
      break;
  }
}

const renderLaser = (state, ctx, projectile): void => {
  ctx.save();
  let color = 'white';
  let length = 50;
  let width = 50;
  if (projectile.type == 'laser') {
    color = 'lime';
    length = config.laserSpeed;
    width = 2;
  }
  ctx.strokeStyle = getPlayerColor(state, projectile.playerID);
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

const renderMissile = (state, ctx, missile): void => {
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
  makeLaserProjectile,
  makeMissileProjectile,
  renderMissile,
  renderProjectile,
  renderLaser,
};
