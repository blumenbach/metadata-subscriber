#!/usr/bin/env node

/**
 * Module dependencies.
 */
var app = require('../app');
var debug = require('debug')('redispubsub');
var http = require('http');
var redis = require('../src/lib/socket.io-redis');

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/*
 * enable node cluster and sticky-session
 */
// var sticky = require('sticky-session');
// sticky(server);

/*
 * setup socket.io, and socket-session
 */
var socketIO = require('socket.io');
var io = socketIO(server);
var socketIOExpressSession = require('socket.io-express-session');
io.use(socketIOExpressSession(app.session)); // session support
var setEvents = require('../events');
setEvents(io);
//var SessionSocket = require('session.socket.io');
//var sessionSockets = new SessionSocket(io, app.sessionStore, app.cookieParser);



/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

console.log('Listening at: http://localhost:3001');

io.adapter(redis({ host: '127.0.0.1', port: 6379, key: 'meta' }));

io.sockets.on('connection', function(socket) {
    socket.on('message', function(data) {
        socket.broadcast.emit('message', data);
        console.log(data);
    });
});