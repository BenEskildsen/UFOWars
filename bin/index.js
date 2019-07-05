'use strict';

var _require = require('redux'),
    createStore = _require.createStore;

var Game = require('./ui/Game.react');
var React = require('react');
var ReactDOM = require('react-dom');

var _require2 = require('./reducers/rootReducer'),
    rootReducer = _require2.rootReducer;

var _require3 = require('./utils/clientToServer'),
    setupClientToServer = _require3.setupClientToServer;

var _require4 = require('./systems/tickSystem'),
    initTickSystem = _require4.initTickSystem;

var _require5 = require('./systems/renderSystem'),
    initRenderSystem = _require5.initRenderSystem;

var _require6 = require('./systems/keyboardControlsSystem'),
    initKeyboardControlsSystem = _require6.initKeyboardControlsSystem;

var store = createStore(rootReducer);
window.store = store; // useful for debugging

// set up client connection to server
var client = setupClientToServer(store);

// TODO there's probably a better way to set up the systems when the game starts
var started = false;
store.subscribe(function () {
  if (started) {
    return;
  }
  var state = store.getState();
  if (!state.game || state.players.length == 0) {
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