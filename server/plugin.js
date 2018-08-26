const OSC = require('osc-js');
const WebsocketServer = require('ws').Server;

const STATUS = {
  IS_NOT_INITIALIZED: -1,
  IS_CONNECTING: 0,
  IS_OPEN: 1,
  IS_CLOSING: 2,
  IS_CLOSED: 3,
};

class WebsocketServerPlugin {
  constructor(options) {
    this.options = options;

    this.socket = null;
    this.socketStatus = STATUS.IS_NOT_INITIALIZED;
    this.notify = () => {};

    this.connections = 0;
  }

  registerNotify(fn) {
    this.notify = fn;
  }

  status() {
    return this.socketStatus;
  }

  open() {
    const { port, host } = this.options;

    if (this.socket) {
      this.close();
    }

    this.socket = new WebsocketServer({ host, port });
    this.socket.binaryType = 'arraybuffer';
    this.socketStatus = STATUS.IS_CONNECTING;

    this.socket.on('listening', () => {
      this.socketStatus = STATUS.IS_OPEN;
      this.notify('open');
    });

    this.socket.on('error', (error) => {
      this.notify('error', error);
    });

    this.socket.on('connection', (client) => {
      client.id = this.connections;
      this.connections += 1;

      client.on('close', () => {
        const message = new OSC.Message('goodbye', client.id);
        this.notify(message);
      });

      client.on('message', (data) => {
        const message = new OSC.Message();
        message.unpack(new DataView(new Uint8Array(data).buffer));
        message.add(client.id);

        this.notify(message);
      });
    });
  }

  close() {
    this.socketStatus = STATUS.IS_CLOSING;

    this.socket.close(() => {
      this.socketStatus = STATUS.IS_CLOSED;
      this.notify('close');
    });
  }

  send(binary, customOptions = {}) {
    const id = customOptions.id || undefined;

    this.socket.clients.forEach((client) => {
      if (typeof id === 'undefined' || client.id === id) {
        client.send(binary, { binary: true });
      }
    });
  }
}

module.exports = WebsocketServerPlugin;
