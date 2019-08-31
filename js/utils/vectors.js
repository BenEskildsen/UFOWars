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

// NOTE: see vectorTheta note if subtracting vectors to find the angle between them
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

const distance = (vector: Vector): number => {
  const {x, y} = vector;
  return Math.sqrt(x * x + y * y);
}

// what is the angle of this vector
// NOTE: that when subtracting two vectors in order to compute the theta
// between them, the target should be the first argument
// hmm this may not work :S
const vectorTheta = (vector: Vector): Radians => {
  return Math.atan2(vector.y, vector.x);
}

module.exports = {
  add,
  subtract,
  makeVector,
  distance,
  vectorTheta,
};
