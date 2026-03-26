const express = require("express");
const cors = require("cors");

const roomsRoutes = require("./routes/rooms");
const reservationsRoutes = require("./routes/reservations");

const app = express();

app.use(cors());
app.use(express.json());

/* ===== LOGGER ===== */

app.use((req, res, next) => {

    const now = new Date().toISOString();

    console.log(`[${now}] ${req.method} ${req.url}`);

    next();

});

/* ===== ROOT ===== */

app.get("/", (req, res) => {
    res.send("Hotel backend działa!");
});

/* ===== ROUTES ===== */

app.use("/rooms", roomsRoutes);
app.use("/reservations", reservationsRoutes);

module.exports = app;