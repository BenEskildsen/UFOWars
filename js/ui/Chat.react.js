
const React = require('React');
const {
  getNextGameID,
  getClientPlayerID,
  getClientPlayer,
  getClientGame,
  getPlayerByID,
} = require('../selectors/selectors');
const {dispatchToServer} = require('../utils/clientToServer');
const Button = require('./Button.react');

/**
 * props: {
 *  rows: ?number,
 *  cols: ?number,
 *  chat: string,
 *  onSend: (message) => void
 * }
 *
 * state: {localInput: string}
 */
class Chat extends React.Component {

  constructor(props) {
    super(props);
    this.state = {localInput: ''};
    document.onkeydown = (ev) => {
      if (ev.keyCode == 13) { // enter
        this.props.onSend(this.state.localInput);
        this.setState({localInput: ''});
      }
    }
  }

  render() {
    const numRows = this.props.rows || 40;
    const numCols = this.props.cols || 60;
    return (
      <div className="chatBar">
        <textarea rows={numRows} cols={numCols}
          disabled={true} readOnly={true} value={this.props.chat}
          style={{resize: 'none'}}
        />
        <div>
          <input
            type="text"
            size={55}
            value={this.state.localInput}
            onChange={(ev) => {
              this.setState({localInput: ev.target.value});
            }}
          />
          <Button
            label="Send"
            onClick={() => {
              this.props.onSend(this.state.localInput);
              this.setState({localInput: ''});
            }}
          />
        </div>
      </div>
    );
  }
}

module.exports = Chat;
