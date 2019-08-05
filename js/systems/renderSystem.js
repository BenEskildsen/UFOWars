const {config} = require('../config');
const {getClientPlayerID, getPlayerColor, getEntityByID} = require('../selectors/selectors');
const {renderShip} = require('../entities/ship');
const {renderProjectile} = require('../entities/projectile');

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
    ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);

    render(state, ctx);
  });
}

const render = (state: State, ctx: any): void => {
  const {game} = state;

  // scale solar system to the canvas
  ctx.save();
  ctx.scale(
    config.canvasWidth / config.width,
    config.canvasHeight / config.height,
  );

  // render ships and their target
  for (const id in game.ships) {
    renderShip(state, ctx, id);

    const ship = game.ships[id];
    const targetEntity = getEntityByID(game, ship.target);
    if (targetEntity != null) {
      ctx.save();
      ctx.strokeStyle = getPlayerColor(state, ship.playerID);
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(
        targetEntity.position.x, targetEntity.position.y, 
        50, 0, Math.PI * 2); 
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }

  // render projectiles
  for (const projectile of game.projectiles) {
    renderProjectile(state, ctx, projectile);
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
  for (const planet of game.planets) {
    ctx.fillStyle = 'steelblue';
    ctx.beginPath();
    ctx.arc(
      planet.position.x, planet.position.y,
      planet.radius, 0, Math.PI * 2,
    );
    ctx.closePath();
    ctx.fill();
  }

  // render explosions
  for (const explosion of game.explosions) {
    if (explosion.radius <= 0) {
      continue;
    }
    ctx.globalAlpha = 1 - ((config.explosion.age - explosion.age) / config.explosion.age)
    ctx.fillStyle = explosion.color;
    ctx.beginPath();
    ctx.arc(
      explosion.position.x, explosion.position.y,
      explosion.radius, 0, Math.PI * 2,
    );
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

module.exports = {initRenderSystem};
