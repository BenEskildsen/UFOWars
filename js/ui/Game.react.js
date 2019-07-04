
const React = require('React');
const {config} = require('../config');
const Canvas = require('./Canvas.react');

/**
 * state: {...store.getState()}
 * props: {store}
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
    let content = (
      <React.Fragment>
        <Canvas
          game={state.game}
          width={config.width} height={config.height}
        />
      </React.Fragment>
    );

    return (
      <div className="background">
        {content}
      </div>
    );
  }
};

module.exports = Game;
