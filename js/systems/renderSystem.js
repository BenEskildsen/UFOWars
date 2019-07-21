const {config} = require('../config');
const {getClientPlayerID} = require('../selectors/selectors');
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

    const {game} = state;
    const referencePosition = game.ships[getClientPlayerID(state)].position;
    render(game, ctx, referencePosition, config.c);
    if (config.renderGroundTruth) {
      render(game, ctx, referencePosition, float('inf'));
    }
  });
}

const tickDifference = (position: Vector, otherPosition: Vector, c: number): number => {
  const dx = (position.x - otherPosition.x);
  const dy = (position.y - otherPosition.y);
  return round(sqrt(dx*dx + dy*dy) / c);
}

const render = (game: Game, ctx: any, referencePosition: Vector, c: number): void => {
  // TODO abstract away rendering
  // render ships
  let colorIndex = 0;
  let playerTickDiffs = {};
  for (const id in game.ships) {
    const currentShip = game.ships[id];
    const {position, history} = currentShip;
    const tickDiff = tickDifference(referencePosition, position, c);
    const idx = history.length - 1 - tickDiff;
    playerTickDiffs[id] = tickDiff;

    if (idx >= 0) {
      const ship = history[idx];

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
      for (const pastShip of ship.history) {
        ctx.lineTo(pastShip.position.x, pastShip.position.y);
      }
      ctx.stroke();

      ctx.fillStyle = ['blue', 'red'][colorIndex];
      for (const futureShip of ship.future) {
        ctx.fillRect(futureShip.position.x, futureShip.position.y, 2, 2);
      }
    }

    colorIndex++;
  }

  // render projectiles
  for (const currentProjectile of game.projectiles) {
    const {position, history, type} = currentProjectile;
    if (type == 'missile') {
      renderMissile(ctx, currentProjectile, referencePosition);
      continue;
    }
    const tickDiff = tickDifference(referencePosition, position, c);

    // Compute tick difference based on projectile's player:
    // const tickDiff = playerTickDiffs[currentProjectile.playerID];

    const idx = history.length - 1 - tickDiff;

    if (idx >= 0) {
      const projectile = history[idx];

      ctx.save();
      let color = 'white';
      let length = 50;
      let width = 50;
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

const renderMissile = (ctx, projectile, referencePosition) => {
  const {history, position} = projectile;
  const tickDiff = tickDifference(referencePosition, position, config.c);
  const idx = history.length - 1 - tickDiff;

  if (idx >= 0) {
    const missile = history[idx];

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
  }
};

module.exports = {initRenderSystem};
