'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var playerReducer = function playerReducer(state, action) {
  switch (action.type) {
    case 'CREATE_PLAYER':
      {
        var playerID = action.playerID,
            gameID = action.gameID,
            isThisClient = action.isThisClient,
            name = action.name;

        return _extends({}, state, {
          players: [].concat(_toConsumableArray(state.players), [{ id: String(playerID), isThisClient: isThisClient, name: name, score: 0, gameID: gameID, ready: false }])
        });
      }
    case 'SET_PLAYER_NAME':
      {
        var _playerID = action.playerID,
            _name = action.name;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = state.players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var player = _step.value;

            if (player.id === _playerID) {
              player.name = _name;
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

        return state;
      }
    case 'SET_PLAYER_SCORE':
      {
        var _playerID2 = action.playerID,
            score = action.score;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = state.players[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _player = _step2.value;

            if (_player.id === _playerID2) {
              _player.score = score;
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

        return state;
      }
    case 'SET_PLAYER_READY':
      {
        var _playerID3 = action.playerID,
            ready = action.ready;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = state.players[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _player2 = _step3.value;

            if (_player2.id === _playerID3) {
              _player2.ready = ready;
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
  }
};

module.exports = { playerReducer: playerReducer };