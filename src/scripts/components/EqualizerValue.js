import PropTypes from 'prop-types';
import React, { Component } from 'react';

class EqualizerValue extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
  }

  render() {
    const percentage = Math.floor(
      Math.max(Math.min(1.0, 1.0 - this.props.value), 0.0) * 100
    );
    const style = { height: `${percentage}%` };

    return (
      <div className='equalizer__value'>
        <div className='equalizer__value-inner' style={style} />
      </div>
    );
  }
}

export default EqualizerValue;
