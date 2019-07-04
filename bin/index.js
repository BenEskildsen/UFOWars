'use strict';

var _require = require('redux'),
    createStore = _require.createStore;

var Game = require('./ui/Game.react');
var React = require('react');
var ReactDOM = require('react-dom');

var _require2 = require('./reducers/rootReducer'),
    rootReducer = _require2.rootReducer;

var _require3 = require('./systems/tickSystem'),
    initTickSystem = _require3.initTickSystem;

var _require4 = require('./systems/renderSystem'),
    initRenderSystem = _require4.initRenderSystem;

var _require5 = require('./systems/keyboardControlsSystem'),
    initKeyboardControlsSystem = _require5.initKeyboardControlsSystem;

var store = createStore(rootReducer);
window.store = store; // useful for debugging

// TODO there's probably a better way to set up the systems when the game starts
var started = false;
store.subscribe(function () {
  if (started || !store.getState().game) {
    return;
  }
  started = true;
  initTickSystem(store);
  initRenderSystem(store);
  initKeyboardControlsSystem(store);
});

// TODO this doesn't go here
store.dispatch({ type: 'START' });

ReactDOM.render(React.createElement(Game, { store: store }), document.getElementById('container'));