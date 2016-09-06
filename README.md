# nodejs-end-to-end
A simple (And probably insecure) attempt at end-to-end encryption using Javscript and NodeJS

## Requirements
- node.js
- npm 
- python 2.7.10 (Required for [node-gyp](https://github.com/nodejs/node-gyp#installation) which is used for node-bcrypt)

## Installation 
1. Go to src/configs/ and copy config-template.js. Rename it to config.js and enter your config settings.
2. `npm install` Install all required packages
3. `npm start` Start the server

## Commands list
- `npm run cert` : Creates RSA and SSL certificates to be used in the application

## Config options
- port: The port on which the server will be listening
- onlineHostName: a option which allows you to easily swap between 2 different hosts
- sqliteDbLocation: location of the sqlite databse file, it is based on the application root so ./test.db will place a databse file next to server.js
- sslOptions: a array with options used by socket io to create a secure TLS connection.
    - key: private key file
    - cert: public certificate
    - ca: your certificate authority chain
    - ciphers: a list of ciphers the server allows connections to use. Leave this as default if you don't know what it means
    - honorCipherOrder: whether to use the strongest algorithm first
    - requestCert: leave this on false as it will cause the server to send a pop-up and request a certificate from the client in some situations
    
    