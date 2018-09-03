const OSC = require('osc-js');
const chalk = require('chalk');

const WebsocketServerPlugin = require('./plugin');

const CHAOS_CONTROLLER = [
  'compressor',
  'eq',
  'microphoneA',
  'microphoneB',
  'reverb',
];

const EQ_BINS = 128;

const TICK_RATE = 10;

const MIN_CHAOS = 5;
const MAX_CHAOS = 50;
const NEXT_CHAOS_PROPABILITY = 0.001;

function randomRange(min, max) {
  return Math.floor(min + (Math.random() * (max - min)));
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

class SessionServer {
  constructor(options) {
    this.options = options;
    this.clients = {};

    this.chaosFactor = 0.0;
    this.tickInterval = undefined;

    const { wsServer, udpClient } = this.options;

    this.ws = new OSC({
      plugin: new WebsocketServerPlugin({
        port: wsServer.port,
        host: wsServer.host,
      }),
    });

    this.ws.on('handshake', message => {
      this.onClientJoin(message);
    });

    this.ws.on('goodbye', message => {
      this.onClientLeft(message);
    });

    this.ws.on('controller', message => {
      this.onClientControllerUpdate(message);
    });

    this.ws.on('open', () => {
      console.log(`${chalk.green('✔')} websocket server ready`);

      this.tickInterval = setInterval(() => {
        this.tick();
      }, TICK_RATE);
    });

    this.ws.on('error', error => {
      this.onError(error);
    });

    this.ws.on('close', () => {
      clearInterval(this.tickInterval);
    });

    this.udp = new OSC({
      plugin: new OSC.DatagramPlugin({
        send: {
          port: udpClient.port,
          host: udpClient.host,
        },
      }),
    });

    this.udp.on('error', error => {
      this.onError(error);
    });

    this.udp.on('open', () => {
      console.log(`${chalk.green('✔')} udp server ready`);
    });

    this.udp.on('close', () => {
      console.log(`${chalk.red('✔')} udp server closed`);
    });
  }

  onClientJoin(message) {
    const id = message.args.pop();
    const name = message.args[0];

    if (Object.keys(this.clients).find(key => this.clients[key].name === name)) {
      this.onError(`participant with name ${chalk.red(name)} already exists!`);
    }

    this.clients[id] = {
      id,
      name,
      controller: {
        chaos: false,
        compressor: false,
        microphoneA: false,
        microphoneB: false,
        reverb: false,
        eq: new Array(EQ_BINS).fill(0.0),
      },
    };

    this.sendChaosFactor(this.chaosFactor);

    const total = Object.keys(this.clients).length;
    console.log(`participant ${chalk.blue(name)} entered session with ID #${id}, total = ${total}`);
  }

  onClientLeft(message) {
    const id = message.args.pop();
    const name = this.clients[id].name;

    delete this.clients[id];

    const total = Object.keys(this.clients).length;
    console.log(`participant ${chalk.blue(name)} left session with ID #${id}, total = ${total}`);
  }

  onClientControllerUpdate(message) {
    const clientId = message.args.pop();
    const client = this.clients[clientId];

    const name = message.args[0];
    const value = message.args[1];

    if (name === 'eq') {
      const start = message.args[2];
      const end = message.args[3];

      client.controller.eq = client.controller.eq.map((oldValue, index) => {
        if (index >= start && index <= end) {
          return value;
        }
        return oldValue;
      });

      this.sendEqualizerParam(client.name, value, start, end);
    } else {
      client.controller[name] = value;

      if (CHAOS_CONTROLLER.includes(name)) {
        this.sendParam(client.name, name, value);
      }
    }
  }

  onError(error) {
    console.error(`${chalk.red('✘')} error: ${error}`);
  }

  start() {
    this.ws.open();
    this.udp.open();
  }

  tick() {
    if (Math.random() < NEXT_CHAOS_PROPABILITY) {
      this.chaosFactor = Math.round(randomRange(MIN_CHAOS, MAX_CHAOS)) / 100;
      this.sendChaosFactor(this.chaosFactor);

      console.log(`change chaos factor to ${chalk.blue((Math.round(this.chaosFactor * 100)) + '%')}`);
    }

    if (Math.random() < this.chaosFactor) {
      if (Math.random() < this.chaosFactor) {
        this.sendChaos();
      }
    }
  }

  sendParam(clientName, name, value) {
    const message = new OSC.Message(['param', clientName, name], value);
    this.udp.send(message);
  }

  sendEqualizerParam(clientName, value, start, end) {
    const message = new OSC.Message(['param', clientName, 'eq'], value, start + 1, end + 1);
    this.udp.send(message);
  }

  sendChaosFactor(chaosFactor) {
    const message = new OSC.Message('session', 'chaos', chaosFactor);
    this.ws.send(message);
  }

  sendChaos() {
    Object.keys(this.clients).forEach(id => {
      const client = this.clients[id];

      if (client.controller.chaos) {
        const name = randomItem(CHAOS_CONTROLLER);

        const message = new OSC.Message('controller');
        message.add(name);

        if (name === 'eq') {
          const valueA = randomRange(0, EQ_BINS);
          const valueB = randomRange(0, EQ_BINS);

          message.add(Math.random());
          message.add(Math.min(valueA, valueB));
          message.add(Math.max(valueA, valueB));
        } else {
          message.add(Math.random() < 0.5 ? 1 : 0);
        }

        this.ws.send(message, { id: client.id });
      }
    });
  }
}

module.exports = SessionServer;
