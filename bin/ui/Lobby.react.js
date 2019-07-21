'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('React');

var _require = require('../selectors/selectors'),
    getNextGameID = _require.getNextGameID,
    getClientPlayerID = _require.getClientPlayerID,
    getClientPlayer = _require.getClientPlayer,
    getClientGame = _require.getClientGame,
    getPlayerByID = _require.getPlayerByID;

var _require2 = require('../utils/clientToServer'),
    dispatchToServer = _require2.dispatchToServer;

var Button = require('./Button.react');

/**
 * props: {store}
 * state: {...state.getState()}
 */

var Lobby = function (_React$Component) {
  _inherits(Lobby, _React$Component);

  function Lobby(props) {
    _classCallCheck(this, Lobby);

    var _this = _possibleConstructorReturn(this, (Lobby.__proto__ || Object.getPrototypeOf(Lobby)).call(this, props));

    props.store.subscribe(function () {
      _this.setState(_extends({}, _this.props.store.getState()));
    });
    _this.state = _extends({}, _this.props.store.getState());
    return _this;
  }

  _createClass(Lobby, [{
    key: 'render',
    value: function render() {
      var state = this.state;
      var players = state.players,
          games = state.games;

      var clientPlayer = getClientPlayer(state);
      var clientGame = getClientGame(state);

      var hostedGame = null;
      var gameRows = [];
      for (var gameID in games) {
        if (gameID == 0) {
          continue;
        }
        var game = games[gameID];
        var host = game.players[0];
        if (host == clientPlayer.id) {
          hostedGame = React.createElement(
            'div',
            { className: 'hostedGame' },
            React.createElement(
              'p',
              null,
              'Joined: ',
              game.players.length == 2 ? getPlayerByID(state, game.players[1]).name : 'None'
            ),
            this.startButton()
          );
          continue;
        }
        var hostName = getPlayerByID(state, host).name;
        gameRows.push(React.createElement(
          'div',
          { className: 'gameRow', key: 'gameRow_' + host },
          React.createElement(
            'p',
            null,
            'Host: ',
            hostName
          ),
          React.createElement(
            'p',
            null,
            '# Players: ',
            game.players.length
          ),
          React.createElement(
            'p',
            null,
            game.started ? 'Game in progress' : this.joinButton(game.id, game.players.length > 1)
          )
        ));
      }

      return React.createElement(
        'div',
        { className: 'lobby' },
        this.playerNameRow(),
        this.createButton(),
        hostedGame,
        gameRows
      );
    }
  }, {
    key: 'playerNameRow',
    value: function playerNameRow() {
      var clientPlayer = getClientPlayer(this.state);
      var dispatch = this.props.store.dispatch;
      return React.createElement(
        'div',
        { className: 'nameRow' },
        'Name:',
        React.createElement('input', {
          type: 'text',
          value: clientPlayer.name,
          onChange: function onChange(ev) {
            var nameChangeAction = {
              type: 'SET_PLAYER_NAME',
              playerID: clientPlayer.id,
              name: ev.target.value
            };
            dispatch(nameChangeAction);
            dispatchToServer(clientPlayer.id, nameChangeAction);
          }
        })
      );
    }
  }, {
    key: 'startButton',
    value: function startButton() {
      var state = this.state;
      var playerID = getClientPlayerID(state);
      var clientGame = getClientGame(state);
      var gameReady = clientGame.players.length == 2;
      var dispatch = this.props.store.dispatch;

      return React.createElement(Button, {
        label: 'Start Game',
        onClick: function onClick() {
          // NEVER dispatch START to yourself!
          var readyAction = { type: 'SET_PLAYER_READY', playerID: playerID, ready: true };
          dispatchToServer(playerID, readyAction);
          dispatch(readyAction);
        },
        disabled: !gameReady
      });
    }
  }, {
    key: 'createButton',
    value: function createButton() {
      var gameID = getNextGameID(this.state);
      var playerID = getClientPlayerID(this.state);
      var clientGame = getClientGame(this.state);
      var dispatch = this.props.store.dispatch;

      return React.createElement(Button, {
        label: 'Create Game',
        onClick: function onClick() {
          var createAction = { type: 'CREATE_GAME', playerID: playerID, gameID: gameID };
          dispatchToServer(playerID, createAction);
          dispatch(createAction);
        },
        disabled: clientGame.id != 0
      });
    }
  }, {
    key: 'joinButton',
    value: function joinButton(gameID, disabled) {
      var playerID = getClientPlayerID(this.state);
      var dispatch = this.props.store.dispatch;

      return React.createElement(Button, {
        label: 'Join Game',
        onClick: function onClick() {
          var joinAction = { type: 'JOIN_GAME', playerID: playerID, gameID: gameID };
          dispatchToServer(playerID, joinAction);
          dispatch(joinAction);

          var readyAction = { type: 'SET_PLAYER_READY', playerID: playerID, ready: true };
          dispatchToServer(playerID, readyAction);
          dispatch(readyAction);
        },
        disabled: disabled
      });
    }
  }]);

  return Lobby;
}(React.Component);

module.exports = Lobby;