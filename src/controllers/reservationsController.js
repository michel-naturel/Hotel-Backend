const db = require("../database/db");

/* ===== DATE PARSER ===== */

function parseDate(dateStr) {

    const regex = /^\d{2}-\d{2}-\d{4}$/;

    if (!regex.test(dateStr)) {
        return null;
    }

    const [day, month, year] = dateStr.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/* ===== GET ALL RESERVATIONS ===== */

exports.getReservations = (req, res) => {

    db.all("SELECT * FROM reservations", [], (err, rows) => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);

    });

};

/* ===== CREATE RESERVATION ===== */

exports.createReservation = (req, res) => {

    const { guestName, roomId, checkIn, checkOut } = req.body;

    /* ===== BASIC VALIDATION ===== */

    if (!guestName || !roomId || !checkIn || !checkOut) {
        return res.status(400).json({
            message: "Brakuje danych rezerwacji"
        });
    }

    /* ===== DATE VALIDATION ===== */

    const checkInISO = parseDate(checkIn);
    const checkOutISO = parseDate(checkOut);

    if (!checkInISO || !checkOutISO) {
        return res.status(400).json({
            message: "Daty muszą mieć format DD-MM-YYYY i być poprawne"
        });
    }

    if (checkInISO >= checkOutISO) {
        return res.status(400).json({
            message: "checkOut musi być później niż checkIn"
        });
    }

    /* ===== CHECK ROOM EXISTS ===== */

    db.get("SELECT id FROM rooms WHERE id = ?", [roomId], (err, room) => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!room) {
            return res.status(404).json({
                message: "Pokój nie istnieje"
            });
        }

        /* ===== CHECK DATE CONFLICT ===== */

        const checkSql = `
            SELECT *
            FROM reservations
            WHERE roomId = ?
            AND NOT (
                checkOut <= ?
                OR checkIn >= ?
            )
        `;

        db.all(checkSql, [roomId, checkInISO, checkOutISO], (err, rows) => {

            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (rows.length > 0) {
                return res.status(409).json({
                    message: "Pokój jest już zarezerwowany w tym terminie"
                });
            }

            /* ===== CREATE RESERVATION ===== */

            const insertSql = `
                INSERT INTO reservations (guestName, roomId, checkIn, checkOut)
                VALUES (?, ?, ?, ?)
            `;

            db.run(insertSql, [guestName, roomId, checkInISO, checkOutISO], function(err) {

                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.json({
                    message: "Rezerwacja zapisana",
                    reservationId: this.lastID
                });

            });

        });

    });

};

/* ===== DELETE RESERVATION ===== */

exports.deleteReservation = (req, res) => {

    const reservationId = req.params.id;

    const sql = `
        DELETE FROM reservations
        WHERE id = ?
    `;

    db.run(sql, [reservationId], function(err) {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                message: "Rezerwacja nie istnieje"
            });
        }

        res.json({
            message: "Rezerwacja anulowana",
            deletedId: reservationId
        });

    });

};