// @flow

const {makeEntity} = require('./entity');
const {config} = require('../config');
const {getPlayerColor} = require('../selectors/selectors');
const {max, round, sqrt} = Math;

import type {State, Mass, PlayerID, Vector, Size, Ship} from '../types';

const makeShip = (
  playerID: PlayerID,
  mass: Mass,
  radius: Size,
  position: Vector,
  velocity: Vector,
): Ship => {
  // TODO make velocity function of position to guarantee stable orbit
  const theta = Math.atan2(velocity.y, velocity.x);
  return {
    ...makeEntity(mass, radius, position, velocity, theta),
    playerID,
    thrust: 0,

    fuel: {cur: 100, max: config.ship.maxFuel},
    laserCharge: {cur: 100, max: config.ship.maxLaser},
  };
};

const renderShip = (state: State, ctx: any, id: PlayerID): void => {
  const {game} = state;
  const ship = game.ships[id];
  const color = getPlayerColor(state, ship.playerID);

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
  for (const pastShip of ship.history) {
    ctx.lineTo(pastShip.position.x, pastShip.position.y);
  }
  ctx.stroke();

  ctx.fillStyle = color;
  for (const futureShip of ship.future) {
    ctx.fillRect(futureShip.position.x, futureShip.position.y, 2, 2);
  }
}

module.exports = {makeShip, renderShip};
