
const {
  getPlayerByID,
  getClientPlayerID,
  getClientGame,
} = require('../selectors/selectors');
const {dispatchToServer} = require('../utils/clientToServer');

const initPlayerReadySystem = (store) => {
  store.subscribe(() => {
    // don't do anything if we're already running
    const state = store.getState();
    if (state.game && state.game.tickInterval) {
      return;
    }

    let allReady = true;
    const clientGame = getClientGame(state);
    for (const id of clientGame.players) {
      const player = getPlayerByID(state, String(id));
      if (!player.ready) {
        allReady = false;
        break;
      }
    }
    const playerID = getClientPlayerID(state);
    // only start if everyone is ready, we're not in the lobby, and this player
    // is the "host"
    if (allReady && clientGame.id != '0' && clientGame.players[0] == playerID) {
      dispatchToServer(playerID, {type: 'START', gameID: clientGame.id});
    }
  });
}

module.exports = {initPlayerReadySystem};
