import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Equalizer, ToggleButton } from './';
import { changeValues, toggleStatus } from '../actions/controller';

class Controller extends Component {
  static propTypes = {
    controls: PropTypes.shape({
      chaos: PropTypes.bool.isRequired,
      compressor: PropTypes.bool.isRequired,
      microphoneA: PropTypes.bool.isRequired,
      microphoneB: PropTypes.bool.isRequired,
      reverb: PropTypes.bool.isRequired,
      eq: PropTypes.array.isRequired,
    }).isRequired,
    changeValues: PropTypes.func.isRequired,
    chaosRate: PropTypes.number.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    toggleStatus: PropTypes.func.isRequired,
  }

  onToggleClicked(id) {
    this.props.toggleStatus(id);
  }

  onEqualizerChanged(start, end, value) {
    this.props.changeValues(start, end, value);
  }

  render() {
    const percentage = Math.round(this.props.chaosRate * 100);
    const chaosLabel = `${percentage}% CHAOS`;

    return (
      <div className='controller'>
        <div className='controller__primary'>
          <Equalizer
            disabled={this.props.isDisabled}
            values={this.props.controls.eq}
            onChanged={this.onEqualizerChanged}
          />
        </div>

        <div className='controller__secondary'>
          <ToggleButton
            className='controller__toggle-button'
            disabled={this.props.isDisabled}
            id='microphoneA'
            isActive={this.props.controls.microphoneA}
            label='IN 1'
            onClicked={this.onToggleClicked}
          />

          <ToggleButton
            className='controller__toggle-button'
            disabled={this.props.isDisabled}
            id='microphoneB'
            isActive={this.props.controls.microphoneB}
            label='IN 2'
            onClicked={this.onToggleClicked}
          />

          <ToggleButton
            className='controller__toggle-button'
            disabled={this.props.isDisabled}
            id='compressor'
            color='yellow'
            isActive={this.props.controls.compressor}
            label='CMP'
            onClicked={this.onToggleClicked}
          />

          <ToggleButton
            className='controller__toggle-button'
            disabled={this.props.isDisabled}
            id='reverb'
            color='yellow'
            isActive={this.props.controls.reverb}
            label='RVB'
            onClicked={this.onToggleClicked}
          />

          <ToggleButton
            className='controller__toggle-button'
            disabled={this.props.isDisabled}
            id='chaos'
            color='red'
            isActive={this.props.controls.chaos}
            label={chaosLabel}
            onClicked={this.onToggleClicked}
          />
        </div>
      </div>
    );
  }

  constructor(props) {
    super(props);

    this.onEqualizerChanged = this.onEqualizerChanged.bind(this);
    this.onToggleClicked = this.onToggleClicked.bind(this);
  }
}

function mapStateToProps(state) {
  const {
    chaosRate,
  } = state.session;

  return {
    chaosRate,
    controls: state.controller,
    isDisabled: !state.osc.isOpen,
  };
}

export default connect(
  mapStateToProps, {
    changeValues,
    toggleStatus,
  }
)(Controller);
