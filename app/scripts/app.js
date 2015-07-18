(function(window, React, NOR, undefined) {

  var _component, _anotherComponent;

  // public

  var app = {};

  app.init = function() {

    React.initializeTouchEvents(true);

    _component = React.render(React.createElement(NOR.Component.Slider, {
      min: 0,
      max: 255,
      steps: 15,
      initialValue: 60,
      onValueChanged: function(cValue) {
        console.log(cValue);
      }
    }), document.getElementById('slider-compressor'));

    _anotherComponent = React.render(React.createElement(NOR.Component.Slider, {
      min: 50,
      max: 100,
      steps: 10,
      onValueChanged: function(cValue) {
        console.log(cValue);
      }
    }), document.getElementById('slider-bandpass'));

    window.setTimeout(function() {
      _anotherComponent.setProps({ initialValue: 70 });
    }, 1500);

  };

  window.app = window.app || app;

})(window, window.React, window.NOR);
