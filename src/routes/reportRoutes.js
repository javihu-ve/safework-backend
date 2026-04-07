const express = require("express");
const router = express.Router();
const { createReporte, getReportes } = require("../controllers/ReportController");

// Endpoints según el contrato [source: 10]
router.post("/createReporte", createReporte); // Fíjate que es sin la 's' al final
router.get("/getAllReports", getReportes);

module.exports = router;