'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('./gameReducer'),
    gameReducer = _require.gameReducer;

var _require2 = require('../state/initState'),
    initState = _require2.initState;

var _require3 = require('../state/initGameState'),
    initGameState = _require3.initGameState;

var rootReducer = function rootReducer(state, action) {
  if (state === undefined) return initState();

  switch (action.type) {
    case 'CREATE_GAME':
      {
        var gameID = action.gameID,
            playerID = action.playerID;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = state.players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var player = _step.value;

            if (player.id === playerID) {
              player.gameID = gameID;
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

        return _extends({}, state, {
          games: _extends({}, state.games, _defineProperty({}, gameID, { id: gameID, players: [playerID], started: false }))
        });
      }
    case 'JOIN_GAME':
      {
        var _gameID = action.gameID,
            _playerID = action.playerID;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = state.players[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _player = _step2.value;

            if (_player.id === _playerID) {
              _player.gameID = _gameID;
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        return _extends({}, state, {
          games: _extends({}, state.games, _defineProperty({}, _gameID, _extends({}, state.games[_gameID], {
            players: [].concat(_toConsumableArray(state.games[_gameID].players), [_playerID])
          })))
        });
      }
    case 'START':
      {
        var _gameID2 = action.gameID;
        var players = state.games[_gameID2].players;

        return _extends({}, state, {
          game: initGameState(players),
          games: _extends({}, state.games, _defineProperty({}, _gameID2, _extends({}, state.games[_gameID2], { started: true })))
        });
      }
    case 'CREATE_PLAYER':
      {
        var _playerID2 = action.playerID,
            _gameID3 = action.gameID,
            isThisClient = action.isThisClient,
            name = action.name;

        return _extends({}, state, {
          players: [].concat(_toConsumableArray(state.players), [{ id: _playerID2, isThisClient: isThisClient, name: name, score: 0, gameID: _gameID3, ready: false }])
        });
      }
    case 'SET_PLAYER_NAME':
      {
        var _playerID3 = action.playerID,
            _name = action.name;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = state.players[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _player2 = _step3.value;

            if (_player2.id === _playerID3) {
              _player2.name = _name;
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        return state;
      }
    case 'RESTART':
      // TODO: restart systems if necessary
      return initState();
    case 'TICK':
    case 'SET_TURN':
    case 'SET_THRUST':
    case 'FIRE_LASER':
      if (!state.game) {
        return state;
      }
      return _extends({}, state, {
        game: gameReducer(state.game, action)
      });
  }
  return state;
};

module.exports = { rootReducer: rootReducer };