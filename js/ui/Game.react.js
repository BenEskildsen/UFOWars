
const React = require('React');
const {config} = require('../config');
const Canvas = require('./Canvas.react');
const Lobby = require('./Lobby.react');
const Button = require('./Button.react');

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
        <div className="background">
          <Canvas
            game={state.game}
            width={config.width} height={config.height}
          />
        </div>
      );
    }

    return (
      <React.Fragment>
        {content}
        {this.getModal()}
      </React.Fragment>
    );
  }

  getModal() {
    if (!this.state.modal) {
      return null;
    }
    const {title, text, buttons} = this.state.modal;
    const rect = document.getElementById('container').getBoundingClientRect();
    const buttonHTML = buttons.map(button => {
      return <Button label={button.label} onClick={button.onClick} />;
    });
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
          {buttonHTML}
        </div>
      </div>
    );
  }
};

module.exports = Game;
