import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';

import { EQ_BIN_NUM } from '../reducers/controller';
import { EqualizerValue } from './';

const DOUBLE_CLICK_DURATION = 200;

class Equalizer extends Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    onChanged: PropTypes.func.isRequired,
    values: PropTypes.array.isRequired,
  }

  onStarted(event) {
    if (this.props.disabled) {
      return;
    }

    event.preventDefault();

    const now = Date.now();

    if (now - this.state.lastStart < DOUBLE_CLICK_DURATION) {
      this.props.onChanged(0, EQ_BIN_NUM, 0);
    } else {
      const position = {
        x: event.targetTouches[0].clientX,
        y: event.targetTouches[0].clientY,
      };

      const { index, value } = this.getIndexAndValue(position);
      this.props.onChanged(index, index, value);
    }

    this.setState({ isActive: true, lastStart: now });
  }

  onChanged(event) {
    if (!this.state.isActive || this.props.disabled) {
      return;
    }

    event.preventDefault();

    const position = {
      x: event.targetTouches[0].clientX,
      y: event.targetTouches[0].clientY,
    };

    const { index, value } = this.getIndexAndValue(position);

    let lastIndex = this.state.lastIndex;
    if (typeof lastIndex === 'undefined') {
      lastIndex = index;
    }

    const rangeStart = Math.min(index, lastIndex);
    const rangeEnd = Math.max(index, lastIndex);

    this.setState({
      lastIndex: index,
    });

    this.props.onChanged(rangeStart, rangeEnd, value);
  }

  onEnded(event) {
    event.preventDefault();

    this.setState({
      isActive: false,
      lastIndex: undefined,
    });
  }

  render() {
    const className = classnames('equalizer', {
      'equalizer--disabled': this.props.disabled,
    });

    return (
      <div
        className={className}
        ref={(ref) => { this._equalizerElem = ref; }}
        onTouchEnd={this.onEnded}
        onTouchMove={this.onChanged}
        onTouchStart={this.onStarted}
      >
        { this.renderValues() }
      </div>
    );
  }

  renderValues() {
    return this.props.values.map((value, index) => {
      return <EqualizerValue value={value} key={index} />;
    });
  }

  getIndexAndValue(position) {
    const rect = this._equalizerElem.getBoundingClientRect();
    position.x -= rect.left;
    position.y -= rect.top;

    const index = Math.ceil(
      Math.min(1.0, Math.max(0.0, position.x / rect.width)) * (EQ_BIN_NUM - 1));
    const value = Math.min(1.0, Math.max(0.0, 1.0 - (position.y / rect.height)));

    return { index, value };
  }

  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
      lastIndex: undefined,
      lastStart: 0,
    };

    this.onStarted = this.onStarted.bind(this);
    this.onEnded = this.onEnded.bind(this);
    this.onChanged = this.onChanged.bind(this);
  }
}

export default Equalizer;
