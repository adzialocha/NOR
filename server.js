var connect = require('connect');
var serveStatic = require('serve-static');
var dgram = require('dgram');
var ws = require('ws');
var fs = require('fs');
var osc = require('osc-min');

var MINUTE_IN_MS = 60000;

var RANDOM_VALUES = [ 25, 50, 100, 200, 250, 400, 800, 1600, 2500, 3000, 5000 ];

var RANDOM_TIMER_MIN = 1000;
var RANDOM_TIMER_MAX = MINUTE_IN_MS;

var STATIC_FOLDER = 'app';
var HTTP_SERVER_PORT = 8080;

var WEBSOCKET_SERVER_PORT = 9000;

var UDP_TARGET_SERVER_ADDRESS = '192.168.178.52';
var UDP_TARGET_SERVER_PORT = 7500;

var websocketServer, udpClient;

var sessionUserCounter, currentFrequency;

function _log(sMessage) {

  var msg, date, hour, min, sec, time;

  date = new Date();

  hour = date.getHours();
  hour = (hour < 10 ? '0' : '') + hour;

  min  = date.getMinutes();
  min = (min < 10 ? '0' : '') + min;

  sec  = date.getSeconds();
  sec = (sec < 10 ? '0' : '') + sec;

  time = hour + ':' + min + ':' + sec;

  msg = time + ' - ' + sMessage;

  console.log(msg);

  fs.appendFile('log.txt', msg + '\n');

}

// random frequency

function getRandomFromArray(sArray) {
  return sArray[Math.floor(Math.random() * sArray.length)];
}

function getRandom(sMin, sMax) {
  return Math.round(Math.random() * (sMax - sMin) + sMin);
}

function broadcastFrequency(sFrequency) {

  var message;

  message = osc.toBuffer({
    address: '/frequency',
    args: [sFrequency]
  });

  sendToWebsockets(message);

}

function setNewFrequency() {

  var nextFrequency;

  nextFrequency = getRandomFromArray(RANDOM_VALUES);

  currentFrequency = nextFrequency;
  broadcastFrequency(nextFrequency);

  _log('SET FREQUENCY TO ' + nextFrequency);

  setTimeout(setNewFrequency, getRandom(RANDOM_TIMER_MIN, RANDOM_TIMER_MAX));

}

// websocket server

websocketServer = new ws.Server({ port: WEBSOCKET_SERVER_PORT });

websocketServer.on('connection', function(sData) {

  sessionUserCounter++;

  _log('NEW PARTICIPANT CONNECTED (total=' + sessionUserCounter + ')');

  broadcastFrequency(currentFrequency);

  sData.on('message', function(rMessage) {
    sendToUdpServer(rMessage);
  });

  sData.on('close', function(rMessage) {
    sessionUserCounter--;
    _log('PARTICIPANT LEFT (total=' + sessionUserCounter + ', message=' + rMessage + ')');
  });

  sData.on('error', function(rError) {
    _log('WS CLIENT ERROR (' + rError + ')');
  });

});

function sendToWebsockets(sMessage) {
  websocketServer.clients.forEach(function(eClient) {
    eClient.send(sMessage, function(rError) {
      if (rError) {
        _log('WS SERVER ERROR (' + rError + ')');
      }
    });
  });
}

// udp server

udpClient = dgram.createSocket('udp4');

udpClient.on('error', function(rError) {
  _log('UDP ERROR (' + rError + ')');
});

function sendToUdpServer(sMessage) {
  udpClient.send(sMessage, 0, sMessage.length, UDP_TARGET_SERVER_PORT, UDP_TARGET_SERVER_ADDRESS, function(rError) {
        if (rError) {
          _log('UDP ERROR (' + rError + ')');
        }
      }
  );
}

// go

_log('NOR #1');

// start http server

connect().use(serveStatic(__dirname + '/' + STATIC_FOLDER)).listen(HTTP_SERVER_PORT);

// start timer

setNewFrequency();

// set initial values

sessionUserCounter = 0;
