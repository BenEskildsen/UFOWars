const React = require('React');

// props:
// id: ?string
// label: string
// onClick: () => void
// disabled: optional boolean

class Button extends React.Component {

  render() {
    const {props} = this;
    const id = props.id || props.label;
    return (
      <button type="button"
        key={id}
        className={props.disabled ? 'buttonDisable' : ''}
        id={id.toUpperCase() + '_button'}
        onClick={props.disabled ? () => {} : props.onClick}
        disabled={props.disabled}
      >
        {props.label}
      </button>
    );
  }
}

module.exports = Button;
