const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/authController");
const { createUser } = require("../controllers/authController");
const { createReport } = require("../controllers/ReportController");

// Definimos el endpoint exacto del contrato
// Como esta ruta la vamos a agrupar bajo "/api/auth" en el index, aquí solo ponemos "/loginUser"
router.post("/loginUser", loginUser);
router.post("/createUser", createUser);
router.post("/createReportes", createReport.createReporte);
router.get("/getAllReports", createReport.getReportes);

module.exports = router;
