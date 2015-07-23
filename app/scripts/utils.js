(function(window, undefined) {

  // public

  var _ = {};

  _.hasClass = function($element, className) {
    return !! $element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  };

  _.addClass = function($element, className) {
    if (! _.hasClass($element, className)) $element.className += ' ' + className;
  };

  _.removeClass = function($element, className) {
    if (_.hasClass($element, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      $element.className = $element.className.replace(reg, '');
    }
  };

  _.toggleClass = function($element, className) {
    if (_.hasClass($element, className)) {
      _.removeClass($element, className);
    } else {
      _.addClass($element, className);
    }
  };

  window._ = window._ || _;

})(window);
