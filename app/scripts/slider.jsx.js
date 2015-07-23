(function(window, NOR, undefined) {

  NOR.Component = NOR.Component || {};

  NOR.Component.Slider = React.createClass({

    displayName: 'Slider',

    /* component */

    propTypes: {
      min: React.PropTypes.number,
      max: React.PropTypes.number,
      steps: React.PropTypes.number,
      initialValue: React.PropTypes.number,
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
        value: 0,
        offset: 0,
        width: 0
      }
    },

    componentDidMount: function() {
      window.addEventListener('resize', this._handleResize);
      this.setState({ value: this.props.initialValue || this.props.min });
      this._handleResize();
    },

    componentWillReceiveProps: function($nextProps) {
      this.setState({ value: $nextProps.initialValue });
    },

    shouldComponentUpdate: function($nextProps, $nextState) {
      if ($nextState.value != this.state.value) {
        this.props.onValueChanged($nextState.value);
      }
      return true;
    },

    componentWillUnmount: function() {
      window.removeEventListener('resize', this._handleResize);
    },

    /* public */

    render: function() {

      var sliderInnerStyle, styleTransform, position;

      position = (((this.state.value - this.props.min) / (this.props.max - this.props.min)) * this.state.width) - this.state.width;

      styleTransform = 'translate3d(' + position + 'px, 0, 0)';

      sliderInnerStyle = {
        WebkitTransform: styleTransform,
        transform: styleTransform,
        backgroundColor: this.props.backgroundColor
      };

      return React.DOM.div({ className: 'slider', onTouchStart: this._onChange, onTouchMove: this._onChange },
        React.DOM.div({ className: 'slider__inner', style: sliderInnerStyle }),
        React.DOM.div({ className: 'slider__label' }, React.DOM.p(null, this.state.value))
      );

    },

    getValue: function() {
      return this.state.value;
    },

    /* private */

    _onChange: function($event) {
      var position, percentage, value;
      position = $event.touches[0].clientX - this.state.offset;
      if (position >= 0 && position <= this.state.width) {
        percentage = position / this.state.width;
        value = this.props.min + (percentage * (this.props.max - this.props.min));
        value = Math.round(value / this.props.steps) * this.props.steps;
        this.setState({ value: value });
      }
    },

    _handleResize: function() {
      this.setState({
        offset: this.getDOMNode().offsetLeft,
        width: this.getDOMNode().offsetWidth
      });
    }

  });

})(window, window.NOR);
