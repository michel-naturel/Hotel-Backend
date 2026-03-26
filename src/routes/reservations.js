const express = require("express");
const router = express.Router();

const reservationsController = require("../controllers/reservationsController");

router.get("/", reservationsController.getReservations);
router.post("/", reservationsController.createReservation);
router.delete("/:id", reservationsController.deleteReservation);

module.exports = router;