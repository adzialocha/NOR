import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';

import { EQ_BIN_NUM } from '../reducers/controller';
import { EqualizerValue } from './';

class Equalizer extends Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    onChanged: PropTypes.func.isRequired,
    values: PropTypes.array.isRequired,
  }

  onStarted(event) {
    this.setState({ isActive: true });
  }

  onChanged(event) {
    if (!this.state.isActive || this.props.disabled) {
      return;
    }

    const position = { x: 0, y: 0 };

    if ('targetTouches' in event) {
      position.x = event.targetTouches[0].clientX;
      position.y = event.targetTouches[0].clientY;
    } else {
      position.x = event.clientX;
      position.y = event.clientY;
    }

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

  onClicked(event) {
    if (this.props.disabled) {
      return;
    }

    const position = {
      x: event.clientX,
      y: event.clientY,
    };

    const { index, value } = this.getIndexAndValue(position);
    this.props.onChanged(index, index, value);
  }

  onEnded(event) {
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
        onClick={this.onClicked}
        onMouseDown={this.onStarted}
        onMouseMove={this.onChanged}
        onMouseUp={this.onEnded}
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
    position.x -= rect.x;
    position.y -= rect.y;

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
    };

    this.onClicked = this.onClicked.bind(this);
    this.onStarted = this.onStarted.bind(this);
    this.onEnded = this.onEnded.bind(this);
    this.onChanged = this.onChanged.bind(this);
  }
}

export default Equalizer;
