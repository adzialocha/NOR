(function(window, OSC, undefined) {

  var OSC_ADDRESS = 'param';

  var OSC_CONTROLLER_IDS = {
    bandpass: 0,
    inputs: 1,
    compressor: 2,
    reverb: 3
  };

  var NOOP = function() { return false; };

  // private

  var _osc, _status;

  var _id;

  var _callback = {
    status: NOOP
  };

  var _controller = {
    bandpass: [0, 0],
    inputs: [false, false],
    compressor: false,
    reverb: false
  };

  var _randomMode;

  function _informServer() {
    var message = new OSC.Message(OSC_ADDRESS);
    _osc.send(message);
  }

  function _setStatus(nStatus) {
    _status = nStatus;
    _callback.status(nStatus);
  }

  function _setRandomMode(nStatus) {
    _randomMode = nStatus;
  }

  function _setController(nKey, nValue) {
    _controller[nKey] = nValue;
    if (_status === NOR.SERVER_CONNECTED) {
      _informServer();
    }
  }

  // public

  var NOR = function() {

    _osc = new OSC();

    _osc.on('open', function(cEvent) {
      _setStatus(NOR.SERVER_CONNECTED);
      _informServer();
    });

    _osc.on('close', function(cEvent) {
      _setStatus(NOR.SERVER_DISCONNECTED);
    });

    _osc.on('error', function(cEvent) {
      _setStatus(NOR.SERVER_ERROR);
    });

    _randomMode = false;

  };

  NOR.BLUE = '#3498db';
  NOR.RED = '#e74c3c';
  NOR.GREEN = '#2ecc71';
  NOR.YELLOW = '#f1c40f';

  NOR.DEFAULT_COLOR = NOR.GREEN;

  NOR.SERVER_ERROR = 1;
  NOR.SERVER_CONNECTED = 2;
  NOR.SERVER_DISCONNECTED = 3;
  NOR.SERVER_WAITING = 4;

  NOR.prototype.onStatusChange = function(nCallback) {
    if (! nCallback || typeof nCallback !== 'function') {
      return false;
    }
    _callback.status = nCallback;
    return true;
  };

  NOR.prototype.connect = function(nId, nAddress, nPort) {

    if (! nId || ! nAddress || ! nPort) {
      return false;
    }

    if (_status === NOR.SERVER_CONNECTED || _status === NOR.SERVER_WAITING) {
      return false;
    }

    _setStatus(NOR.SERVER_WAITING);

    _id = nId;
    _osc.connect(nAddress, nPort);

    return true;

  };

  NOR.prototype.setBandpass = function(nMinFrequency, nMaxFrequency) {
    if (typeof nMinFrequency !== 'number' || ! typeof nMaxFrequency !== 'number') {
      return false;
    }
    _setController('bandpass', [nMinFrequency, nMaxFrequency]);
    return true;
  };

  NOR.prototype.setCompressor = function(nStatus) {
    if (typeof nStatus !== 'boolean') {
      return false;
    }
    _setController('compressor', nStatus);
    return true;
  };

  NOR.prototype.setReverb = function(nStatus) {
    if (typeof nStatus !== 'boolean') {
      return false;
    }
    _setController('reverb', nStatus);
    return true;
  };

  NOR.prototype.setRandom = function(nStatus) {
    if (typeof nStatus !== 'boolean') {
      return false;
    }
    _setRandomMode(nStatus);
    return true;
  };

  NOR.prototype.setInput = function(nIndex, nStatus) {
    if (typeof nIndex !== 'number' || typeof nStatus !== 'boolean') {
      return false;
    }
    if (_controller.inputs.length - 1 < nIndex) {
      return false;
    }
    _controller.inputs[nIndex] = nStatus;
    _setController('inputs', _controller.inputs);
    return true;
  };


  window.NOR = window.NOR || NOR;

})(window, window.OSC);
