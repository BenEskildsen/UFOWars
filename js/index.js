// @flow

const {createStore} = require('redux');
const Game = require('./ui/Game.react');
const React = require('react');
const ReactDOM = require('react-dom');
const {rootReducer} = require('./reducers/rootReducer');
const {setupClientToServer} = require('./utils/clientToServer');

const {initTickSystem} = require('./systems/tickSystem');
const {initRenderSystem} = require('./systems/renderSystem');
const {initKeyboardControlsSystem} = require('./systems/keyboardControlsSystem');
const {initCollisionSystem} = require('./systems/collisionSystem');

const store = createStore(rootReducer);
window.store = store; // useful for debugging

// set up client connection to server
const client = setupClientToServer(store);

// TODO there's probably a better way to set up the systems when the game starts
let started = false;
store.subscribe(() => {
  if (started) {
    return;
  }
  const state = store.getState();
  if (!state.game || state.players.length == 0) {
    return;
  }
  started = true;
  initTickSystem(store);
  initRenderSystem(store);
  initKeyboardControlsSystem(store);
  initCollisionSystem(store);
});

ReactDOM.render(
  <Game store={store} />,
  document.getElementById('container'),
);
