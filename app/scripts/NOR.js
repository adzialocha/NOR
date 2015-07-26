(function(window, OSC, undefined) {

  'use strict';

  var OSC_ADDRESS = 'param';

  var OSC_CONTROLLER_IDS = {
    bandpassMin: 0,
    bandpassMax: 1,
    inputA: 2,
    inputB: 3,
    compressor: 4,
    reverb: 5
  };

  var NOOP = function() { return false; };

  // private

  var _osc, _status;

  var _id;

  var _frequency = {
    min: 0,
    max: 0
  };

  var _callback = {
    status: NOOP,
    frequency: NOOP
  };

  var _controller = {
    bandpassMin: 0,
    bandpassMax: 0,
    inputA: false,
    inputB: false,
    compressor: false,
    reverb: false
  };

  var _randomFrequency;

  function _convert(nVal) {
    if (typeof nVal !== 'boolean') {
      return (Math.log(nVal) - Math.log(_frequency.min)) / (Math.log(_frequency.max) - Math.log(_frequency.min));
    } else {
      return nVal? 1.0 : 0.0;
    }
  }

  function _informServer(nControllerKey) {
    var message = new OSC.Message(
      OSC_ADDRESS,
      (_id * Object.keys(OSC_CONTROLLER_IDS).length) + OSC_CONTROLLER_IDS[nControllerKey],
      _convert(_controller[nControllerKey])
    );
    _osc.send(message);
  }

  function _informServerAll() {
    Object.keys(OSC_CONTROLLER_IDS).forEach(function(eItem) {
      _informServer(eItem);
    });
  }

  function _setStatus(nStatus) {
    _status = nStatus;
    _callback.status(nStatus);
  }

  function _setController(nKey, nValue) {
    _controller[nKey] = nValue;
    if (_status === NOR.SERVER_CONNECTED) {
      _informServer(nKey);
    }
  }

  // public

  var NOR = function(nMinFrequency, nMaxFrequency) {

    if (typeof nMinFrequency !== 'number' || typeof nMaxFrequency !== 'number') {
      return false;
    }

    _osc = new OSC();

    _osc.on('open', function() {
      _setStatus(NOR.SERVER_CONNECTED);
      _informServerAll();
    });

    _osc.on('close', function() {
      _setStatus(NOR.SERVER_DISCONNECTED);
    });

    _osc.on('error', function() {
      _setStatus(NOR.SERVER_ERROR);
    });

    _osc.on('/frequency', function(cData) {
      _randomFrequency = cData.args[0];
      _callback.frequency(_randomFrequency);
    });

    _randomFrequency = 0;

    _frequency.min = nMinFrequency;
    _frequency.max = nMaxFrequency;

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

  NOR.prototype.onFrequencyChange = function(nCallback) {
    if (! nCallback || typeof nCallback !== 'function') {
      return false;
    }
    _callback.frequency = nCallback;
    return true;
  };

  NOR.prototype.connect = function(nId, nAddress, nPort) {

    if (typeof nId !== 'number' || ! nAddress || ! nPort) {
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

  NOR.prototype.isConnected = function() {
    return _status === NOR.SERVER_CONNECTED;
  };

  NOR.prototype.setBandpass = function(nMinFrequency, nMaxFrequency) {

    if (typeof nMinFrequency !== 'number' || typeof nMaxFrequency !== 'number') {
      return false;
    }


    if (nMinFrequency < _frequency.min || nMaxFrequency > _frequency.max) {
      return false;
    }

    _setController('bandpassMin', nMinFrequency);
    _setController('bandpassMax', nMaxFrequency);

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

  NOR.prototype.setInput = function(nIndex, nStatus) {

    if (typeof nIndex !== 'number' || typeof nStatus !== 'boolean') {
      return false;
    }

    if (nIndex === 0) {
      _setController('inputA', nStatus);
      return true;
    } else if (nIndex === 1) {
      _setController('inputB', nStatus);
      return true;
    } else {
      return false;
    }

  };

  window.NOR = window.NOR || NOR;

}(window, window.OSC));
