// @flow

const {makeEntity} = require('./entity');
const {config} = require('../config');

import type {Asteroid, Mass, Radians, Vector, Size, Entity} from '../types';

const makeAsteroid = (
  position: Vector,
  velocity: Vector,
): Asteroid => {
  const asteroid = makeEntity(
    config.asteroid.mass,
    config.asteroid.radius,
    position,
    velocity,
    0, // theta
  );

  asteroid.type = 'asteroid';
  asteroid.thetaSpeed = config.asteroid.thetaSpeed;
  asteroid.age = 0;

  return asteroid;
};

const renderAsteroid = (state: State, ctx: any, asteroid: Asteroid): void => {
  ctx.save();
  ctx.strokeStyle = 'white';
  ctx.translate(asteroid.position.x, asteroid.position.y);
  ctx.rotate(asteroid.theta);
  ctx.lineWidth = 4;

  // circular asteroid
  // ctx.beginPath();
  // ctx.arc(
  //   0, 0, asteroid.radius, 0, Math.PI * 2,
  // );
  // ctx.closePath();
  // ctx.stroke();

  // square asteroid
  const squaredRad = asteroid.radius - 5; // make drawing slightly smaller than radius
  ctx.beginPath();
  ctx.moveTo(-squaredRad, -squaredRad);
  ctx.lineTo(-squaredRad, squaredRad);
  ctx.lineTo(squaredRad, squaredRad);
  ctx.lineTo(squaredRad, -squaredRad);
  ctx.closePath();
  ctx.stroke();

  ctx.restore();
};

module.exports = {makeAsteroid, renderAsteroid};
