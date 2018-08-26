const chalk = require('chalk');
const ip = require('ip');

const pkg = require('../package.json');
const StaticServer = require('./static');
const SessionServer = require('./session');

function hello(options) {
  const ipAddress = ip.address();

  // Clear terminal
  process.stdout.write('\x1Bc');

  // Say hello!
  console.log(chalk.bold.blue(pkg.name));
  console.log('- - - - - - - - - - - - - - - - - - - - -');
  console.log(`version: ${chalk.green(pkg.version)}`);
  console.log(`ip: ${chalk.green(ipAddress)}`);
  console.log('- - - - - - - - - - - - - - - - - - - - -');

  console.log(chalk.bold('http'));
  console.log('  server');
  console.log(`    host: ${chalk.green(options.static.host)}`);
  console.log(`    port: ${chalk.green(options.static.port)}`);
  console.log(chalk.bold('udp'));
  console.log('  client');
  console.log(`    host: ${chalk.green(options.session.udpClient.host)}`);
  console.log(`    port: ${chalk.green(options.session.udpClient.port)}`);
  console.log(chalk.bold('websocket'));
  console.log('  server');
  console.log(`    host: ${chalk.green(options.session.wsServer.host)}`);
  console.log(`    port: ${chalk.green(options.session.wsServer.port)}`);
  console.log('- - - - - - - - - - - - - - - - - - - - -');
}

const options = require('../options');
hello(options);

const staticServer = new StaticServer(options.static);
staticServer.start()
  .then(() => {
    console.log(`${chalk.green('✔')} http server ready`);
  })
  .catch(error => {
    console.error(`${chalk.red('✘')} http error: ${error.message}`);
  });

const sessionServer = new SessionServer(options.session);
sessionServer.start();
