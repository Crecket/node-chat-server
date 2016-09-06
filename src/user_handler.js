module.exports = function (db) {
    // RSA encryption
    var NodeRSA = require('node-rsa');
    // Bcrypt support
    var bcrypt = require('bcrypt');
    // CryptoJS library
    var CryptoJS = require("crypto-js");
    // file management
    var fs = require('fs');
    // Generic crypto
    var crypto = require('crypto');
    // Random 128 byte token
    function randomToken() {
        return crypto.randomBytes(128).toString('hex');
    }

    // TODO sqlite3

    var userManagement = {
        session: {
            // stored users in this session
            userList: {},
            // return the user list
            getUserList: function () {
                return this.userList;
            },
            // update timestamp for this user
            updateTime: function (userName) {
                if (this.userList[userName]) {
                    this.userList[userName]['last_activity'] = new Date();
                    return true;
                }
                return false;
            },
            // add a new user to the session
            addUser: function (userName, socketId, ip) {
                this.userList[userName] = {
                    'username': userName,
                    'public_key': false,
                    'socketId': socketId,
                    'allow_files': false,
                    'ip': ip,
                    'last_activity': new Date()
                };
            },
            // remove user from the list
            removeUser: function (userName) {
                delete this.userList[userName];
            },
            // set the public keys for a user
            setUserKeys: function (username, keys) {
                if (keys) {
                    // create NodeRSA object so we can check the properties
                    var tempKey = new NodeRSA(keys.publicKey, 'public');
                    var tempKeySign = new NodeRSA(keys.publicKeySign, 'public');

                    // check if both keys have public propperties and check if user exists
                    if (tempKey.isPublic() && tempKeySign.isPublic() && this.userList[username]) {
                        // export as pem
                        this.userList[username]['public_key'] = tempKey.exportKey('public');
                        // export as pem
                        this.userList[username]['public_key_sign'] = tempKeySign.exportKey('public');
                        return true;
                    }
                }
                return false;
            }
        },
        users: {
            // load the userlist from the config
            getUserList: function (callback) {
                var users = [];
                db.all("SELECT * FROM users", function (err, rows) {
                    if (!err) {
                        for (var key in rows) {
                            // format correctly
                            users[rows[key]['username']] = rows[key];
                        }
                    }
                    if (callback) {
                        callback(users);
                    }
                });
            },
            // add a new user to the config files
            newUser: function (username, password, callback) {
                var fn = this;

                // check if user already exists
                db.get("SELECT * FROM users WHERE username = ?", [username.toLowerCase()], function (err, row) {

                    if (!row && !err) {

                        // salt to use in the client
                        var clientSalt = randomToken();

                        // hash that the client would generate
                        var clientHash = CryptoJS.enc.Hex.stringify(CryptoJS.SHA512(password + clientSalt));

                        // hash the password with bcrypt
                        bcrypt.genSalt(11, function (err, salt) {
                            bcrypt.hash(clientHash, salt, function (err, hash) {
                                if (!err && hash) {
                                    // store in sqlite3 db
                                    db.run("INSERT INTO users (username, password, salt) VALUES (?, ?, ?)",
                                        [username.toLowerCase(), hash, clientSalt]);

                                    console.log('Created user ' + username);

                                    // callback
                                    if (callback) {
                                        callback(true);
                                    }
                                }
                            });
                        });
                    } else {
                        console.log(row, err);
                    }

                });
            },
            // delete a user
            removeUser: function (username) {
                db.run("DELETE FROM users WHERE username = ?", [username.toLowerCase()]);
            },
            // create test accounts
            createTestAccounts: function (amount) {
                if (!amount) {
                    amount = 100;
                }
                for (var i = 0; i < amount; i++) {
                    userManagement.users.newUser('test' + i, '');
                }
            }
        }
    };

    return userManagement;
};