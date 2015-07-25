(function(window, _, React, NOR, undefined) {

  var STATUS_ERROR_CLASS = 'status--error';
  var STATUS_POSITIVE_CLASS = 'status--positive';

  var UI_ELEMENT_IDS = [
      'server-address',
      'server-port',
      'participant-id',
      'connect'
    ];

  var MIN_FREQUENCY_RANGE = 20;
  var MAX_FREQUENCY_RANGE = 20000;

  // private

  var _nor;

  var _bandpass, _compressor, _inputA, _inputB, _reverb, _random;

  var _randomModeStatus, _randomTimeout, _randomFrequency;

  function _setStatus(sMessage, sClass) {

    var elem;
    elem = document.getElementById('status');

    _.removeClass(elem, STATUS_ERROR_CLASS);
    _.removeClass(elem, STATUS_POSITIVE_CLASS);

    if (sClass) {
      _.addClass(elem, sClass);
    }

    elem.innerText = sMessage;

  }

  function _setUIAvailability(sStatus) {
    UI_ELEMENT_IDS.forEach(function(eItem) {
      document.getElementById(eItem).disabled = ! sStatus;
    });
  }

  // random mode

  function _doChaos() {

    var randComponent;
    var randMin;

    randComponent = Math.round(Math.random() * 4);

    if (randComponent === 0) {
      randMin = _.random(MIN_FREQUENCY_RANGE, MAX_FREQUENCY_RANGE);
      _bandpass.setState({
        valueMin: randMin,
        valueMax: _.random(randMin, MAX_FREQUENCY_RANGE)
      });
    } else if (randComponent === 1) {
      _inputA.setState({ value: ! _inputA.state.value });
    } else if (randComponent === 2) {
      _inputB.setState({ value: ! _inputB.state.value });
    } else if (randComponent === 3) {
      _compressor.setState({ value: ! _compressor.state.value });
    }

  }

  function _resetRandomStep() {
    if (_randomTimeout) {
      window.clearTimeout(_randomTimeout);
    }
  }

  function _nextRandomStep() {
    if (_randomModeStatus && _nor.isConnected()) {
      _doChaos();
      _randomTimeout = window.setTimeout(_nextRandomStep, _randomFrequency);
    }
  }

  // public

  var app = {};

  app.init = function() {

    var firstViewId;

    _nor = new NOR();

    _nor.onStatusChange(function(nStatus) {

      var message, type;

      if (nStatus === NOR.SERVER_ERROR) {

        type = STATUS_ERROR_CLASS;
        message = 'ERROR';
        _setUIAvailability(true);

      } else if (nStatus === NOR.SERVER_DISCONNECTED) {

        type = STATUS_ERROR_CLASS;
        message = 'OFFLINE';
        _setUIAvailability(true);

      } else if (nStatus === NOR.SERVER_CONNECTED) {

        type = STATUS_POSITIVE_CLASS;
        message = 'ONLINE';
        _setUIAvailability(false);

        if (_randomModeStatus) {
          _nextRandomStep();
        }

      } else {
        message = 'CONNECTING';
      }

      _setStatus(message, type);

    });

    _randomFrequency = 0;

    _nor.onFrequencyChange(function(nFrequency) {

      _randomFrequency = nFrequency;
      _random.setProps({
        label: 'CHAOS [' + nFrequency + ']',
        initialValue: _random.state.value
      });

      if (_randomModeStatus) {
        _resetRandomStep()
        _nextRandomStep();
      }

    });

    // react setup

    React.initializeTouchEvents(true);

    // components

    _bandpass = React.render(React.createElement(NOR.Component.Slider, {
      min: MIN_FREQUENCY_RANGE,
      max: MAX_FREQUENCY_RANGE,
      onValueChanged: function(cFromValue, cToValue) {
        _nor.setBandpass(cFromValue, cToValue);
      }
    }), document.getElementById('slider-bandpass'));

    _inputA = React.render(React.createElement(NOR.Component.Toggle, {
      label: 'IN A',
      backgroundColor: NOR.BLUE,
      onValueChanged: function(cStatus) {
        _nor.setInput(0, cStatus);
      }
    }), document.getElementById('toggle-input-a'));

    _inputB = React.render(React.createElement(NOR.Component.Toggle, {
      label: 'IN B',
      backgroundColor: NOR.BLUE,
      onValueChanged: function(cStatus) {
        _nor.setInput(1, cStatus);
      }
    }), document.getElementById('toggle-input-b'));

    _compressor = React.render(React.createElement(NOR.Component.Toggle, {
      label: 'COMP',
      backgroundColor: NOR.YELLOW,
      onValueChanged: _nor.setCompressor,
    }), document.getElementById('toggle-compressor'));

    _reverb = React.render(React.createElement(NOR.Component.Toggle, {
      label: 'RVB',
      backgroundColor: NOR.YELLOW,
      onValueChanged: _nor.setReverb,
    }), document.getElementById('toggle-reverb'));

    _random = React.render(React.createElement(NOR.Component.Toggle, {
      label: 'CHAOS',
      backgroundColor: NOR.RED,
      onValueChanged: function(cStatus) {
        _nor.setRandom(cStatus);
        _randomModeStatus = cStatus;
        if (cStatus) {
          _nextRandomStep();
        }
      },
    }), document.getElementById('toggle-random'));

    // initial status

    _setStatus('STANDBY');

    // connect button

    document.getElementById('connect').addEventListener('click', function() {

      var address, port, id;

      address = document.getElementById('server-address').value;
      port = parseInt(document.getElementById('server-port').value, 10)
      id = parseInt(document.getElementById('participant-id').value, 10)

      _nor.connect(id, address, port);

      _setUIAvailability(false);

    });

  };

  window.app = window.app || app;

})(window, window._, window.React, window.NOR);
