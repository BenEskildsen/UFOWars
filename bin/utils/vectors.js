'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var cos = Math.cos,
    sin = Math.sin;


var add = function add() {
  for (var _len = arguments.length, vectors = Array(_len), _key = 0; _key < _len; _key++) {
    vectors[_key] = arguments[_key];
  }

  var resultVec = { x: 0, y: 0 };
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = vectors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var v = _step.value;

      resultVec.x += v.x;
      resultVec.y += v.y;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return resultVec;
};

var subtract = function subtract() {
  for (var _len2 = arguments.length, vectors = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    vectors[_key2] = arguments[_key2];
  }

  var resultVec = _extends({}, vectors[0]);
  for (var i = 1; i < vectors.length; i++) {
    resultVec.x -= vectors[i].x;
    resultVec.y -= vectors[i].y;
  }
  return resultVec;
};

var makeVector = function makeVector(theta, speed) {
  var x = speed * cos(theta);
  var y = speed * sin(theta);
  return { x: x, y: y };
};

var distance = function distance(vector) {
  var x = vector.x,
      y = vector.y;

  return Math.sqrt(x * x + y * y);
};

module.exports = {
  add: add,
  subtract: subtract,
  makeVector: makeVector,
  distance: distance
};