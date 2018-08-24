import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ToggleButton } from './';
import { toggleStatus } from '../actions/controller';

class Controller extends Component {
  static propTypes = {
    status: PropTypes.shape({
      chaos: PropTypes.bool.isRequired,
      compressor: PropTypes.bool.isRequired,
      microphoneA: PropTypes.bool.isRequired,
      microphoneB: PropTypes.bool.isRequired,
      reverb: PropTypes.bool.isRequired,
      eq: PropTypes.array.isRequired,
    }).isRequired,
    toggleStatus: PropTypes.func.isRequired,
  }

  onToggleClicked(id) {
    this.props.toggleStatus(id);
  }

  render() {
    return (
      <div className='controller'>
        <div className='controller__primary'>
        </div>

        <div className='controller__secondary'>
          <ToggleButton
            className='controller__toggle-button'
            id='microphoneA'
            isActive={this.props.status.microphoneA}
            label='IN 1'
            onClicked={this.onToggleClicked}
          />

          <ToggleButton
            className='controller__toggle-button'
            id='microphoneB'
            isActive={this.props.status.microphoneB}
            label='IN 2'
            onClicked={this.onToggleClicked}
          />

          <ToggleButton
            className='controller__toggle-button'
            id='compressor'
            color='yellow'
            isActive={this.props.status.compressor}
            label='CMP'
            onClicked={this.onToggleClicked}
          />

          <ToggleButton
            className='controller__toggle-button'
            id='reverb'
            color='yellow'
            isActive={this.props.status.reverb}
            label='RVB'
            onClicked={this.onToggleClicked}
          />

          <ToggleButton
            className='controller__toggle-button'
            id='chaos'
            color='red'
            isActive={this.props.status.chaos}
            label='CHAOS'
            onClicked={this.onToggleClicked}
          />
        </div>
      </div>
    );
  }

  constructor(props) {
    super(props);

    this.onToggleClicked = this.onToggleClicked.bind(this);
  }
}

function mapStateToProps(state) {
  return {
    status: state.controller,
  };
}

export default connect(
  mapStateToProps, {
    toggleStatus,
  }
)(Controller);