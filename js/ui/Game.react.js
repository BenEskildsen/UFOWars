
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
        {this.getModal()}
      </div>
    );
  }

  getModal() {
    if (!this.state.modal) {
      return null;
    }
    const {title, text, buttons} = this.state.modal;
    const rect = document.getElementById('container').getBoundingClientRect();
    return (
      <div className="modal"
        style={{
          width: 300,
          top: (rect.height - 200) / 2,
          left: (rect.width - 300) / 2,
        }}>
        <h3><b>{title}</b></h3>
        {text}
        <div className="modalButtons">
          {buttons}
        </div>
      </div>
    );
  }
};

module.exports = Game;
