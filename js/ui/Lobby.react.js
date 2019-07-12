
const React = require('React');
const {
  getNextGameID,
  getClientPlayerID,
  getClientPlayer,
  getClientGame,
} = require('../selectors/selectors');
const {dispatchToServer} = require('../utils/clientToServer');
const Button = require('./Button.react');

/**
 * props: {store}
 * state: {...state.getState()}
 */

class Lobby extends React.Component {

  constructor(props) {
    super(props);
    props.store.subscribe(() => {
      this.setState({...this.props.store.getState()});
    });
    this.state = {...this.props.store.getState()};
  }

  render() {
    const state = this.state;
    const {players, games} = state;
    const clientPlayer = getClientPlayer(state);
    const clientGame = getClientGame(state);

    let hostedGame = null;
    const gameRows = [];
    for (const gameID in games) {
      if (gameID == 0) {
        continue;
      }
      const game = games[gameID];
      const host = game.players[0];
      if (host == clientPlayer.id) {
        hostedGame = (
          <div className="hostedGame">
            <p>Joined: {game.players.length == 2 ? game.players[1]: 'None'}</p>
            {this.startButton()}
          </div>
        );
        continue;
      }
      gameRows.push(
        <div className="gameRow" key={'gameRow_' + host}>
          <p>Host: {host}</p>
          <p># Players: {game.players.length}</p>
          <p>
            {game.started
              ? 'Game in progress'
              : this.joinButton(game.id, game.players.length > 1)
            }
          </p>
        </div>
      );
    }

    return (
      <div className="lobby">
        <div className="nameRow">
           Name: {clientPlayer.name}
        </div>
        {this.createButton()}
        {hostedGame}
        {gameRows}
      </div>
    );
  }

  startButton() {
    const state = this.state;
    const playerID = getClientPlayerID(state);
    const clientGame = getClientGame(state);
    const gameReady = clientGame.players.length == 2;
    const {dispatch} = this.props.store;
    return (
      <Button
        label="Start Game"
        onClick={() => {
          const startAction = {type: 'READY', gameID: clientGame.id};
          dispatchToServer(playerID, startAction);
        }}
        disabled={!gameReady}
      />
    );
  }

  createButton() {
    const gameID = getNextGameID(this.state);
    const playerID = getClientPlayerID(this.state);
    const clientGame = getClientGame(this.state);
    const {dispatch} = this.props.store;
    return (
      <Button
        label="Create Game"
        onClick={() => {
          const createAction = {type: 'CREATE_GAME', playerID, gameID};
          dispatchToServer(playerID, createAction);
          dispatch(createAction);
        }}
        disabled={clientGame.id != 0}
      />
    );
  }

  joinButton(gameID, disabled) {
    const playerID = getClientPlayerID(this.state);
    const {dispatch} = this.props.store;
    return (
      <Button
        label="Join Game"
        onClick={() => {
          const joinAction = {type: 'JOIN_GAME', playerID, gameID};
          dispatchToServer(playerID, joinAction);
          dispatch(joinAction);
        }}
        disabled={disabled}
      />
    );
  }
}

module.exports = Lobby;
