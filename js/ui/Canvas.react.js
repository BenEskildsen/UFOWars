
const React = require('React');

/**
 *  props: {
 *    width: pixels, height: pixels, game: GameState
 *  }
 */
class Canvas extends React.Component {

  render() {
    const {props} = this;
    return (
      <canvas
        id="canvas" className="gameCanvas"
        width={props.width} height={props.height}
      />
    );
  }
};

module.exports = Canvas;
