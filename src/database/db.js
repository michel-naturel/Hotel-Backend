const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("hotel.db");

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS rooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            number INTEGER UNIQUE,
            type TEXT,
            price INTEGER
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            guestName TEXT,
            roomId INTEGER,
            checkIn TEXT,
            checkOut TEXT,
            FOREIGN KEY(roomId) REFERENCES rooms(id)
        )
    `);

});

module.exports = db;