'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('../utils/gravity'),
    computeNextEntity = _require.computeNextEntity;

var _require2 = require('../utils/queue'),
    queueAdd = _require2.queueAdd;

var _require3 = require('../utils/updateEntities'),
    updateShip = _require3.updateShip,
    updateProjectile = _require3.updateProjectile;

var _require4 = require('../config'),
    config = _require4.config;

var sin = Math.sin,
    cos = Math.cos,
    abs = Math.abs,
    sqrt = Math.sqrt;

var _require5 = require('./gameReducer'),
    gameReducer = _require5.gameReducer;

var tickReducer = function tickReducer(state, action) {
  switch (action.type) {
    case 'START_TICK':
      // this behavior bundled into START
      // if (!state.tickInterval) {
      //   state.tickInterval = setInterval(
      //     () => store.dispatch({type: 'TICK'}),
      //     config.msPerTick,
      //   );
      // }
      return state;
    case 'STOP_TICK':
      clearInterval(state.tickInterval);
      state.tickInterval = null;
      return state;
    case 'TICK':
      return handleTick(state);
  }
  return state;
};

/**
 * Updates the gamestate in place for performance/laziness
 */
var handleTick = function handleTick(state) {
  state.time = state.time + 1;

  var sun = state.sun;


  for (var id in state.ships) {
    updateShip(state, id, 1 /* one tick */);
    var ship = state.ships[id];
    ship.future = [];
    var futureShip = _extends({}, ship);
    while (ship.future.length < config.maxFutureSize) {
      futureShip = _extends({}, computeNextEntity(sun, futureShip));
      ship.future.push(futureShip);
    }
  }

  // update planets
  state.planets = state.planets.map(function (planet) {
    var history = planet.history;
    queueAdd(history, planet, config.maxHistorySize);
    return _extends({}, planet, computeNextEntity(sun, planet), {
      history: history
    });
  });

  for (var i = 0; i < state.projectiles.length; i++) {
    updateProjectile(state, i, 1 /* one tick */);
  }

  // check on queued actions
  var nextState = state;
  var nextActionQueue = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = state.actionQueue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var action = _step.value;

      if (action.time == state.time) {
        nextState = gameReducer(nextState, action);
      } else {
        nextActionQueue.push(action);
      }
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

  return _extends({}, nextState, {
    actionQueue: nextActionQueue
  });
};

module.exports = { tickReducer: tickReducer };