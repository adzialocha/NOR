(function(window, React, NOR, undefined) {

  var _component;

  _component = React.createElement(NOR.Component.Slider, { min: 0, max: 255 });

  // public

  var app = {};

  app.init = function() {
    React.initializeTouchEvents(true);
    React.render(_component, document.getElementById('slider-compressor'));
    React.render(_component, document.getElementById('slider-bandpass'));
  };

  window.app = window.app || app;

})(window, window.React, window.NOR);
