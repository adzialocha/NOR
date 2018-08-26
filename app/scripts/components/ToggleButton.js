import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';

class ToggleButton extends Component {
  static propTypes = {
    color: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    onClicked: PropTypes.func.isRequired,
  }

  onClicked() {
    this.props.onClicked(this.props.id);
  }

  render() {
    const className = classnames('button', this.props.className, {
      [`button--${this.props.color}`]: this.props.color,
      'button--active': this.props.isActive,
    });

    return (
      <button
        className={className}
        disabled={this.props.disabled}
        onClick={this.onClicked}
      >
        { this.props.label }
      </button>
    );
  }

  constructor(props) {
    super(props);

    this.onClicked = this.onClicked.bind(this);
  }
}

export default ToggleButton;
