var connect = require('connect');
var serveStatic = require('serve-static');

var STATIC_FOLDER = 'app';
var SERVER_PORT = 8080;

connect().use(serveStatic(__dirname + '/' + STATIC_FOLDER)).listen(SERVER_PORT);
