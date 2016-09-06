// file system
var fs = require('fs');

module.exports = function (config) {

    // check if db exists
    var exists = fs.existsSync(config.sqliteDbLocation);

    // create blank db file if it doesn't exist
    if (!exists) {
        console.log("Creating DB file.");
        fs.openSync(config.sqliteDbLocation, "w");
    }

    // get sql module
    var sqlite3 = require("sqlite3").verbose();

    // new db object
    var db = new sqlite3.Database(config.sqliteDbLocation);

    // if no database exists, create initial table
    db.run("CREATE TABLE IF NOT EXISTS users(\
            id INTEGER PRIMARY KEY AUTOINCREMENT,\
            username TEXT NOT NULL,\
            password INT  NOT NULL,\
            salt CHAR(50) NOT NULL)");

    return db;
}