'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('React');

var _require = require('../config'),
    config = _require.config;

var Canvas = require('./Canvas.react');
var Lobby = require('./Lobby.react');

/**
 * props: {store}
 * state: {...store.getState()}
 */

var Game = function (_React$Component) {
  _inherits(Game, _React$Component);

  function Game(props) {
    _classCallCheck(this, Game);

    var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, props));

    props.store.subscribe(function () {
      _this.setState(_extends({}, _this.props.store.getState()));
    });
    _this.state = _extends({}, _this.props.store.getState());
    return _this;
  }

  _createClass(Game, [{
    key: 'render',
    value: function render() {
      var dispatch = this.props.store.dispatch;
      var state = this.state;

      var content = null;
      if (state.players.length != 0) {
        content = React.createElement(Lobby, { store: this.props.store });
      }
      if (state.game != null) {
        content = React.createElement(
          React.Fragment,
          null,
          React.createElement(Canvas, {
            game: state.game,
            width: config.width, height: config.height
          })
        );
      }

      return React.createElement(
        'div',
        { className: 'background' },
        content,
        this.getModal()
      );
    }
  }, {
    key: 'getModal',
    value: function getModal() {
      if (!this.state.modal) {
        return null;
      }
      var _state$modal = this.state.modal,
          title = _state$modal.title,
          text = _state$modal.text,
          buttons = _state$modal.buttons;

      var rect = document.getElementById('container').getBoundingClientRect();
      return React.createElement(
        'div',
        { className: 'modal',
          style: {
            width: 300,
            top: (rect.height - 200) / 2,
            left: (rect.width - 300) / 2
          } },
        React.createElement(
          'h3',
          null,
          React.createElement(
            'b',
            null,
            title
          )
        ),
        text,
        React.createElement(
          'div',
          { className: 'modalButtons' },
          buttons
        )
      );
    }
  }]);

  return Game;
}(React.Component);

;

module.exports = Game;