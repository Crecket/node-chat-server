"use strict";
// is library, used for assertions
const is = require('@pwn/is');

// Generic crypto
var crypto = require('crypto');

// system info
var os = require('os');

// file system
var fs = require('fs');

// Express for serving files
var express = require('express');

// helmet is used to ensure HSTS
var helmet = require('helmet');

// Express app
var app = express();

// RSA encryption
var NodeRSA = require('node-rsa');

// Bcrypt support
var bcrypt = require('bcrypt');

// jwt tokens
var jwt = require('jsonwebtoken');

// Load app-vars
var config = require('./src/configs/config');

// Sqlite3 setup
// eval(fs.readFileSync('./src/sqlite_handler.js') + '');
var db = require('./src/sqlite_handler.js')(config);

// Load user management
var userManagement = require('./src/user_handler')(db);

// Create accounts
// userManagement.users.newUser('crecket', '1234');
// userManagement.users.createTestAccounts(100);

// start servertime
var serverTime = Math.floor(Date.now() / 1000);

// start the express server using either the online or offline settings
var https = require('https');
var server = https.createServer(config.sslOptions, app);
console.log('Server started over https for host: ' + os.hostname().trim());

// Retrieve the server's rsa keys
var RSAPrivateKey = fs.readFileSync('./src/certs/rsa.key') + '';
var RSAPrivateKeyBits = new NodeRSA(RSAPrivateKey, 'private');
var RSAPublicKey = fs.readFileSync('./src/certs/rsa.crt') + '';
var RSAPublicKeyBits = new NodeRSA(RSAPublicKey, 'public');

// Start the Socket.IO app
var io = require('socket.io').listen(server);

// Express start listening on port
server.listen(config.port);
console.log('Express started at port: ' + config.port);

// Io connection listener
eval(fs.readFileSync('./src/sockets.js') + '');

