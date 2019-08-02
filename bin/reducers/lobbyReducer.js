'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('../state/initGameState'),
    initGameState = _require.initGameState;

var _require2 = require('../config'),
    config = _require2.config;

var _require3 = require('../selectors/selectors'),
    getPlayerByID = _require3.getPlayerByID;

var lobbyReducer = function lobbyReducer(state, action) {
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

        if (state.game != null && state.game.tickInterval != null) {
          return state;
        }
        return _extends({}, state, {
          game: _extends({}, initGameState(players), {
            tickInterval: setInterval(
            // HACK: store is only available via window
            function () {
              return store.dispatch({ type: 'TICK' });
            }, config.msPerTick)
          }),
          games: _extends({}, state.games, _defineProperty({}, _gameID2, _extends({}, state.games[_gameID2], { started: true })))
        });
      }
  }
  return state;
};

module.exports = { lobbyReducer: lobbyReducer };