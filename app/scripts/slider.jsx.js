(function(window, NOR, undefined) {

  NOR.Component = NOR.Component || {};

  NOR.Component.Slider = React.createClass({

    displayName: 'Slider',

    getDefaultProps: function() {
      return {
        min: 0,
        max: 100,
        backgroundColor: '#00ff22'
      };
    },

    getInitialState: function() {
      return {
        value: 0,
        position: 0,
        offset: 0,
        width: 0
      }
    },

    onValueChange: function(event) {
      var _position, _percentage;
      _position = event.touches[0].clientX - this.state.offset;
      if (_position >= 0 && _position <= this.state.width) {
        _percentage =  _position / this.state.width;
        this.setState({
          position: _position,
          value: Math.floor(this.props.min + (_percentage * (this.props.max - this.props.min)))
        });
      }
    },

    componentDidMount: function() {
      this.setState({
        offset: this.getDOMNode().offsetLeft,
        width: this.getDOMNode().offsetWidth
      });
    },

    render: function() {
      var sliderInnerStyle;
      sliderInnerStyle = {
        width: this.state.position + 'px',
        backgroundColor: this.props.backgroundColor
      };
      return React.DOM.div({ className: 'slider', onTouchStart: this.onValueChange, onTouchMove: this.onValueChange },
        React.DOM.div({ className: 'slider__inner', style: sliderInnerStyle })
      );
    }

  });

})(window, window.NOR);
