// @flow

const {makeEntity} = require('./entity');

import type {Explosion} from '../types';

const makeExplosion = (
  position,
  rate,
  age,
  color,
  radius,
): Explosion => {
  return {
    ...makeEntity(0, radius, position, 0, 0),
    age,
    rate,
    color,
    opacity: 1,
  };
};

module.exports = {makeExplosion};
