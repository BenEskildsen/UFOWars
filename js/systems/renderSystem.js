const {config} = require('../config');
const {getClientPlayerID, getPlayerColor} = require('../selectors/selectors');
const {max, round, sqrt} = Math;

import type {Store, Game} from '../types';

/**
 * Render things into the canvas
 */
const initRenderSystem = (store: Store): void => {

  let time = store.getState().game.time;
  let canvas = null;
  let ctx = null;
  store.subscribe(() => {
    const state = store.getState();
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

    render(state, ctx);
  });
}

const render = (state: State, ctx: any): void => {
  const {game} = state;

  // TODO abstract away rendering
  // render ships
  for (const id in game.ships) {
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

  // render projectiles
  for (const projectile of game.projectiles) {
    if (projectile.type == 'missile') {
      renderMissile(state, ctx, projectile);
      continue;
    } 
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

  // render sun
  const {sun} = game;
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(
    sun.position.x, sun.position.y,
    sun.radius, 0, Math.PI * 2,
  );
  ctx.closePath();
  ctx.fill();

  // render planets
  // TODO
}

const renderMissile = (state, ctx, missile) => {
  ctx.save();
  ctx.strokeStyle = getPlayerColor(state, missile.playerID);
  ctx.fillStyle = 'green';
  ctx.beginPath();
  ctx.translate(missile.position.x, missile.position.y);
  ctx.rotate(missile.theta);
  ctx.moveTo(missile.radius, 0);
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

module.exports = {initRenderSystem};
