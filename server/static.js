const fs = require('fs');
const path = require('path');

const express = require('express');

class StaticServer {
  constructor(options) {
    this.options = options;
    this.server = express();
  }

  start() {
    const { port, host } = this.options;
    const staticPath = path.resolve(__dirname, this.options.staticFolderName);

    return new Promise((resolve, reject) => {
      fs.access(staticPath, fsError => {
        if (fsError) {
          reject(fsError);
        } else {
          this.httpServer = express();
          this.httpServer.use(express.static(staticPath));

          this.httpServer.listen(port, host, () => {
            resolve();
          }).on('error', httpError => {
            reject(httpError);
          });
        }
      });
    });
  }
}

module.exports = StaticServer;
