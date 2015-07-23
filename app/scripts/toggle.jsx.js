(function(window, NOR, undefined) {

  NOR.Component = NOR.Component || {};

  NOR.Component.Toggle = React.createClass({

    displayName: 'Toggle',

    /* component */

    propTypes: {
      initialValue: React.PropTypes.bool,
      backgroundColor: React.PropTypes.string,
      label: React.PropTypes.string,
      onValueChanged: React.PropTypes.func
    },

    getDefaultProps: function() {
      return {
        label: '',
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
      this.setState({ value: this.props.initialValue || false });
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

      var toggleStyle;

      toggleStyle = {
        backgroundColor: this.state.value? this.props.backgroundColor : 'transparent'
      };

      return React.DOM.div({ className: 'toggle', style: toggleStyle, onTouchStart: this._onToggle },
          React.DOM.div({ className: 'toggle__inner' }, React.DOM.p(null, this.props.label)));

    },

    getValue: function() {
      return this.state.value;
    },

    /* private */

    _onToggle: function($event) {
      this.setState({ value: ! this.state.value });
    },

    _handleResize: function() {
      this.setState({
        offset: this.getDOMNode().offsetLeft,
        width: this.getDOMNode().offsetWidth
      });
    }

  });

})(window, window.NOR);
