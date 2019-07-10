
const React = require('React');
const {config} = require('../config');
const Canvas = require('./Canvas.react');
const Lobby = require('./Lobby.react');

/**
 * props: {store}
 * state: {...store.getState()}
 */
class Game extends React.Component {

  constructor(props) {
    super(props);
    props.store.subscribe(() => {
      this.setState({...this.props.store.getState()});
    });
    this.state = {...this.props.store.getState()};
  }

  render() {
    const {dispatch} = this.props.store;
    const {state} = this;
    let content = null;
    if (state.players.length != 0) {
      content = <Lobby store={this.props.store} />;
    }
    if (state.game != null) {
      content = (
        <React.Fragment>
          <Canvas
            game={state.game}
            width={config.width} height={config.height}
          />
        </React.Fragment>
      );
    }

    return (
      <div className="background">
        {content}
      </div>
    );
  }
};

module.exports = Game;
