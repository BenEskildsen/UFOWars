// @flow

import type {Vector} from '../types';

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

module.exports = {
  add,
  subtract,
};
