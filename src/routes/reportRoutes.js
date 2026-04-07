const express = require("express");
const router = express.Router();
const { createReporte, getReportes, escalarReporte } = require("../controllers/ReportController");
const { verificarToken } = require("../middlewares/authMiddleware");

// Endpoints según el contrato [source: 10]
router.post("/createReporte",verificarToken, createReporte); // Fíjate que es sin la 's' al final
router.get("/getAllReports",verificarToken, getReportes);
router.put("/:id/escalar", verificarToken, escalarReporte);

module.exports = router;