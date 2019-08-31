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

var _require4 = require('./systems/renderSystem'),
    initRenderSystem = _require4.initRenderSystem;

var _require5 = require('./systems/keyboardControlsSystem'),
    initKeyboardControlsSystem = _require5.initKeyboardControlsSystem;

var _require6 = require('./systems/collisionSystem'),
    initCollisionSystem = _require6.initCollisionSystem;

var _require7 = require('./systems/playerReadySystem'),
    initPlayerReadySystem = _require7.initPlayerReadySystem;

var _require8 = require('./systems/asteroidSystem'),
    initAsteroidSystem = _require8.initAsteroidSystem;

var store = createStore(rootReducer);
window.store = store; // useful for debugging

// set up client connection to server
var client = setupClientToServer(store);

// TODO there's probably a better way to set up the systems when the game starts
var started = false;
initPlayerReadySystem(store);
store.subscribe(function () {
  if (started) {
    return;
  }
  var state = store.getState();
  // happens in response to "START" action
  if (!state.game || state.players.length == 0) {
    return;
  }
  started = true;
  initRenderSystem(store);
  initKeyboardControlsSystem(store);
  initCollisionSystem(store);
  initAsteroidSystem(store);
});

ReactDOM.render(React.createElement(Game, { store: store }), document.getElementById('container'));