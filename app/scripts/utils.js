(function(window, undefined) {

  'use strict';

  // public

  var _ = {};

  _.hasClass = function($element, uClassName) {
    return !! $element.className.match(new RegExp('(\\s|^)' + uClassName + '(\\s|$)'));
  };

  _.addClass = function($element, uClassName) {
    if (! _.hasClass($element, uClassName)) $element.className += ' ' + uClassName;
  };

  _.removeClass = function($element, uClassName) {
    if (_.hasClass($element, uClassName)) {
      var reg = new RegExp('(\\s|^)' + uClassName + '(\\s|$)');
      $element.className = $element.className.replace(reg, '');
    }
  };

  _.toggleClass = function($element, uClassName) {
    if (_.hasClass($element, uClassName)) {
      _.removeClass($element, uClassName);
    } else {
      _.addClass($element, uClassName);
    }
  };

  _.random = function(uMinValue, uMaxValue) {
    return Math.round(Math.random() * (uMaxValue - uMinValue) + uMinValue);
  };

  window._ = window._ || _;

}(window));
