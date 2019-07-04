// @flow

const {cos, sin} = Math;

import type {Vector, Radians} from '../types';

const add = (...vectors: Array<Vector>): Vector => {
  const resultVec = {x: 0, y: 0};
  for (const v of vectors) {
    resultVec.x += v.x;
    resultVec.y += v.y;
  }
  return resultVec;
}

const subtract = (...vectors: Array<Vector>): Vector => {
  const resultVec = {...vectors[0]};
  for (let i = 1; i < vectors.length; i++) {
    resultVec.x -= vectors[i].x;
    resultVec.y -= vectors[i].y;
  }
  return resultVec;
}

const makeVector = (theta: Radians, speed: number): Vector => {
  const x = speed * cos(theta);
  const y = speed * sin(theta);
  return {x, y};
}

module.exports = {
  add,
  subtract,
  makeVector,
};
