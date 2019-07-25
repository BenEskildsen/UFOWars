// @flow

const config = {
  msPerTick: 40,
  width: 4000,
  height: 4000,
  canvasWidth: 500,
  canvasHeight: 500,
  ship: {
    thrust: 0.05,
    thetaSpeed: 5 * Math.PI / 180,
    radius: 35,
    mass: 10,
    maxFuel: 100,
    maxLaser: 100,
  },
  sun: {
    radius: 100,
    mass: 10000,
  },
  earth: {
    radius: 35,
    mass: 1000,
  },
  missile: {
    thrust: 1,
    radius: 20,
    mass: 5,
    maxFuel: 30,
    thrustAt: 10,
    maxAge: 80,
    speed: 12,
  },
  G: 1, // gravitational constant
  maxHistorySize: 75,
  maxFutureSize: 75,
  laserSize: 4, // deprecated in favor of laserSpeed
  laserSpeed: 20,
  maxProjectiles: 100,
  c: Infinity, // speed of light, in pixels per tick
  playerColors: [
    'white',
    'LightSkyBlue',
    'OrangeRed',
  ],
};

module.exports = {config};
