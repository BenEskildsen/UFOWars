'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('../utils/gravity'),
    computeNextEntity = _require.computeNextEntity;

var _require2 = require('../utils/queue'),
    queueAdd = _require2.queueAdd;

var _require3 = require('../utils/vectors'),
    subtract = _require3.subtract,
    distance = _require3.distance;

var _require4 = require('../utils/updateEntities'),
    updateShip = _require4.updateShip,
    updateProjectile = _require4.updateProjectile;

var _require5 = require('../config'),
    config = _require5.config;

var sin = Math.sin,
    cos = Math.cos,
    abs = Math.abs,
    sqrt = Math.sqrt;

var _require6 = require('./gameReducer'),
    gameReducer = _require6.gameReducer;

var _require7 = require('../utils/errors'),
    invariant = _require7.invariant;

var _require8 = require('../selectors/selectors'),
    getEntityByID = _require8.getEntityByID;

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

  var sun = state.sun,
      planets = state.planets;

  var masses = [sun].concat(_toConsumableArray(planets));

  for (var id in state.ships) {
    updateShip(state, id, 1 /* one tick */);
    var ship = state.ships[id];
    ship.future = [];
    var futureShip = _extends({}, ship);
    while (ship.future.length < config.maxFutureSize) {
      futureShip = _extends({}, computeNextEntity(masses, futureShip));
      ship.future.push(futureShip);
    }
  }

  // update planets
  state.planets = state.planets.map(function (planet) {
    var history = planet.history;
    queueAdd(history, planet, config.maxHistorySize);
    return _extends({}, planet, computeNextEntity([sun], planet), {
      history: history
    });
  });

  // update projectiles
  for (var i = 0; i < state.projectiles.length; i++) {
    // handle missiles
    if (state.projectiles[i].type != 'missile') {
      continue;
    }
    var missile = state.projectiles[i];
    missile.age += 1;
    // target missle
    var missileTarget = getEntityByID(state, missile.target);
    if (missileTarget == null) {
      break; // if no missile to target, just shoot wherever
    }
    var dist = subtract(missileTarget.position, missile.position);
    missile.theta = Math.atan2(dist.y, dist.x);

    if (missile.age > config.missile.thrustAt && missile.fuel.cur > 0) {
      missile.fuel.cur -= 1;
      missile.thrust = config.missile.thrust;
    }

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

    // projectiles colliding with sun
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

  var nextProjectiles = state.projectiles.filter(function (projectile) {
    var dist = distance(subtract(projectile.position, sun.position));
    return dist > sun.radius;
  });
  // clean up old missiles
  nextProjectiles = nextProjectiles.filter(function (projectile) {
    return !(projectile.type == 'missile' && projectile.age > config.missile.maxAge);
  });

  return _extends({}, nextState, {
    projectiles: nextProjectiles,
    actionQueue: nextActionQueue
  });
};

module.exports = { tickReducer: tickReducer };