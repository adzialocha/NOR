(function(window, NOR, undefined) {

  NOR.Component = NOR.Component || {};

  var DOUBLE_TAP_TRESHOLD_MS = 180;
  var SMALL_RANGE_SIZE = 100;

  NOR.Component.Slider = React.createClass({

    displayName: 'Slider',

    /* component */

    propTypes: {
      min: React.PropTypes.number,
      max: React.PropTypes.number,
      steps: React.PropTypes.number,
      initialValueMin: React.PropTypes.number,
      initialValueMax: React.PropTypes.number,
      backgroundColor: React.PropTypes.string,
      onValueChanged: React.PropTypes.func
    },

    getDefaultProps: function() {
      return {
        min: 0,
        max: 100,
        steps: 1,
        backgroundColor: NOR.DEFAULT_COLOR,
        onValueChanged: function() {}
      };
    },

    getInitialState: function() {
      return {
        valueMin: 0,
        valueMax: 0,
        offset: 0,
        width: 0
      }
    },

    componentDidMount: function() {

      window.addEventListener('resize', this._handleResize);

      this.setState({
        valueMin: this.props.initialValueMin || this.props.min,
        valueMax: this.props.initialValueMax || this.props.max
      });

      this._handleResize();

      this._log.minLog = Math.log(this.props.min);
      this._log.maxLog = Math.log(this.props.max);

      this._log.scale = (this._log.maxLog - this._log.minLog) / (this.props.max - this.props.min);

    },

    componentWillReceiveProps: function($nextProps) {
      this.setState({
        valueMin: $nextProps.initialValueMin,
        valueMax: $nextProps.initialValueMax
      });
    },

    shouldComponentUpdate: function($nextProps, $nextState) {
      if ($nextState.valueMin != this.state.valueMin || $nextState.valueMax != this.state.valueMax) {
        this.props.onValueChanged(
          this._calculateLog($nextState.valueMin),
          this._calculateLog($nextState.valueMax)
        );
      }
      return true;
    },

    componentWillUnmount: function() {
      window.removeEventListener('resize', this._handleResize);
    },

    /* public */

    render: function() {

      var sliderInnerStyle, styleTransform, positionA, positionB;

      positionA = ((this.state.valueMin - this.props.min) / (this.props.max - this.props.min)) * this.state.width;

      positionB = ((this.state.valueMax - this.props.min) / (this.props.max - this.props.min)) * this.state.width;

      styleTransform = 'translate3d(' + positionA + 'px, 0, 0)';

      sliderInnerStyle = {
        WebkitTransform: styleTransform,
        transform: styleTransform,
        backgroundColor: this.props.backgroundColor,
        width: (positionB - positionA) + 'px'
      };

      return React.DOM.div({ className: 'slider', onTouchStart: this._onTouchStart, onTouchMove: this._onTouchMove, onTouchEnd: this._onTouchEnd, onTouchCancel: this._onTouchEnd },
        React.DOM.div({ className: 'slider__inner', style: sliderInnerStyle }),
        React.DOM.div({ className: 'slider__label' }, React.DOM.p(null, this._calculateLog(this.state.valueMin) + ' - ' + this._calculateLog(this.state.valueMax)))
      );

    },

    getValue: function() {
      return [
        this._calculateLog(this.state.valueMin),
        this._calculateLog(this.state.valueMax)
      ];
    },

    /* private */

    _currentTouch: {

      startA: 0,
      startB: 0,

      currentA: 0,
      currentB: 0,

      isActive: false,
      isDoubleGesture: false,

      lastTimestamp: 0

    },

    _log: {

      minLog: 0,
      maxLog: 0,

      scale: 0

    },

    _calculateLog: function(rValue) {
      return Math.round(Math.exp((rValue - this.props.min) * this._log.scale + this._log.minLog));
    },

    _calculateValue: function(rPosition) {

      var percentage, value;

      percentage = rPosition / this.state.width;
      value = this.props.min + (percentage * (this.props.max - this.props.min));
      value = Math.round(value / this.props.steps) * this.props.steps;

      return value;

    },

    _setRange: function(rPositionA, rPositionB) {

      var valueA, valueB;

      if (rPositionB >= 0 && rPositionB <= this.state.width) {

        valueA = this._calculateValue(rPositionA);
        valueB = this._calculateValue(rPositionB);

        if (valueA > valueB) {
          this.setState({ valueMin: valueB, valueMax: valueA });
        } else {
          this.setState({ valueMin: valueA, valueMax: valueB });
        }

      }

    },

    _setPosition: function(rPositionA, rWidth) {

      var valueA, moveA, moveB, center, diff;

      if (rPositionA >= 0 && rPositionA <= this.state.width) {

        valueA = this._calculateValue(rPositionA);

        if (rWidth) {
          center = rWidth;
        } else {
          center = Math.round((this.state.valueMax - this.state.valueMin) / 2);
        }

        moveA = valueA - center;
        moveB = valueA + center;

        if (moveA < this.props.min) {
          diff = Math.abs(this.props.min - moveA);
          moveA = this.props.min;
          moveB = moveB + diff;
        }

        if (moveB > this.props.max) {
          diff = Math.abs(this.props.max - moveB);
          moveB = this.props.max;
          moveA = moveA - diff;
        }

        this.setState({ valueMin: moveA, valueMax: moveB });

      }

    },

    _onTouchStart: function($event) {

      this._currentTouch.isDoubleGesture = $event.touches.length == 2;

      this._currentTouch.isActive = true;

      this._currentTouch.startA = $event.touches[0].clientX - this.state.offset;
      this._currentTouch.currentA = this._currentTouch.startA;

      if (this._currentTouch.isDoubleGesture) {

        this._currentTouch.startB = $event.touches[1].clientX - this.state.offset;
        this._currentTouch.currentB = this._currentTouch.startB;
        this._setRange(this._currentTouch.currentA, this._currentTouch.currentB);

      } else {

        if ($event.timeStamp - this._currentTouch.lastTimestamp < DOUBLE_TAP_TRESHOLD_MS) {
          this._setPosition(this._currentTouch.currentA, SMALL_RANGE_SIZE);
        } else {
          this._setPosition(this._currentTouch.currentA);
        }

        this._currentTouch.lastTimestamp = $event.timeStamp;

      }

    },

    _onTouchMove: function($event) {

      this._currentTouch.currentA = $event.touches[0].clientX - this.state.offset;

      if (this._currentTouch.isDoubleGesture) {
        this._currentTouch.currentB = $event.touches[1].clientX - this.state.offset;
        this._setRange(this._currentTouch.currentA, this._currentTouch.currentB);
      } else {
        this._setPosition(this._currentTouch.currentA);
      }

    },

    _onTouchEnd: function($event) {
      this._currentTouch.isActive = false;
    },

    _handleResize: function() {
      this.setState({
        offset: this.getDOMNode().offsetLeft,
        width: this.getDOMNode().offsetWidth
      });
    }

  });

})(window, window.NOR);
