(function(window, undefined) {

  var NOR = function() {
    this.message = 'Hello';
  };

  NOR.prototype.test = function() {
    return this.message;
  };

  window.NOR = window.NOR || NOR;

})(window);
