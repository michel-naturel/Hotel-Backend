const db = require("../database/db");

exports.getRooms = (req, res) => {

    db.all("SELECT * FROM rooms", [], (err, rows) => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);

    });

};

exports.createRoom = (req, res) => {

    const { number, type, price } = req.body;

    if (!number || !type || !price) {
        return res.status(400).json({
            message: "Brakuje danych pokoju"
        });
    }

    const sql = `
        INSERT INTO rooms (number, type, price)
        VALUES (?, ?, ?)
    `;

    db.run(sql, [number, type, price], function(err) {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json({
            message: "Pokój dodany",
            roomId: this.lastID
        });

    });

};

/* ===== AVAILABLE ROOMS ===== */

exports.getAvailableRooms = (req, res) => {

    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
        return res.status(400).json({
            message: "Podaj checkIn i checkOut"
        });
    }

    // WALIDACJA KOLEJNOŚCI DAT
    if (checkOut <= checkIn) {
        return res.status(400).json({
            message: "checkOut musi być później niż checkIn"
        });
    }

    const sql = `
        SELECT *
        FROM rooms
        WHERE id NOT IN (
            SELECT roomId
            FROM reservations
            WHERE NOT (
                checkOut <= ?
                OR checkIn >= ?
            )
        )
    `;

    db.all(sql, [checkIn, checkOut], (err, rows) => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);

    });

};

/* ===== ROOM RESERVATIONS ===== */

exports.getRoomReservations = (req, res) => {

    const roomId = req.params.id;

    const sql = `
        SELECT *
        FROM reservations
        WHERE roomId = ?
        ORDER BY checkIn
    `;

    db.all(sql, [roomId], (err, rows) => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);

    });

};