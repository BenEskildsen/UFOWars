const {config} = require('../config');
const {getClientPlayerID, getPlayerColor} = require('../selectors/selectors');
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

  // render ships
  for (const id in game.ships) {
    renderShip(state, ctx, id);
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
  // TODO

  ctx.restore();
}

module.exports = {initRenderSystem};
